import { useNavigate, useLocation, useParams } from "react-router-dom";
import {
  ChevronLeft,
  RotateCcw,
  Mic,
  Menu,
  X,
  ShoppingBag,
  ExternalLink,
  Save,
  Wand2,
} from "lucide-react";
import { type Property } from "../types/property";
import { useState, useEffect } from "react";
import { PanoramaViewer } from "../components/PanoramaViewer";
import { useRef } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { virtualStagingService } from "../services/virtualStagingService";
import {
  getStagingSessionId,
  storeStagingSession,
  removeStagingSession,
} from "../utils/stagingSessionStorage";
import { motion, AnimatePresence } from "framer-motion";

// Furniture data structure for AI Virtual Staging (matches API response)
interface SearchLink {
  price_bracket: string;
  search_url: string;
  shop: string;
}

interface ExtractedFurniture {
  description: string;
  item_type: string;
  top_3_search_links: SearchLink[];
}

interface BudgetSummary {
  strategy: string;
  total_allocation: number;
}

export interface FurnitureApiResponse {
  budget_summary: BudgetSummary;
  currency: string;
  extracted_furniture: ExtractedFurniture[];
  message: string;
  success: boolean;
  total_budget: number;
}

// // Sample furniture data - this would come from AI staging results
// const sampleFurnitureData: FurnitureApiResponse = {
//   budget_summary: {
//     strategy:
//       "The total budget of 50,000 PHP was dynamically split between the identified furniture items. A larger portion was allocated to the sofa (up to 35,000 PHP) as it typically represents a more significant investment, while the coffee table received a smaller allocation (up to 15,000 PHP).",
//     total_allocation: 50000,
//   },
//   currency: "PHP",
//   extracted_furniture: [
//     {
//       description: "A multi-seater sofa with a contemporary design.",
//       item_type: "Sofa",
//       top_3_search_links: [
//         {
//           price_bracket: "15000 - 35000",
//           search_url: "https://mandauefoam.ph/search?q=Sofa&type=product",
//           shop: "Mandaue Foam",
//         },
//         {
//           price_bracket: "15000 - 35000",
//           search_url: "https://smhome.ph/search?q=Sofa&type=product",
//           shop: "SM Home",
//         },
//         {
//           price_bracket: "15000 - 35000",
//           search_url: "https://uratex.com.ph/search?type=product&q=Sofa",
//           shop: "Uratex",
//         },
//       ],
//     },
//     {
//       description: "A round coffee table with a sturdy base.",
//       item_type: "Coffee Table",
//       top_3_search_links: [
//         {
//           price_bracket: "5000 - 15000",
//           search_url:
//             "https://mandauefoam.ph/search?q=Coffee%20Table&type=product",
//           shop: "Mandaue Foam",
//         },
//         {
//           price_bracket: "5000 - 15000",
//           search_url: "https://smhome.ph/search?q=Coffee%20Table&type=product",
//           shop: "SM Home",
//         },
//         {
//           price_bracket: "5000 - 15000",
//           search_url:
//             "https://uratex.com.ph/search?type=product&q=Coffee%20Table",
//           shop: "Uratex",
//         },
//       ],
//     },
//   ],
//   message: "Successfully extracted furniture from image",
//   success: true,
//   total_budget: 50000,
// };

const isMobileDevice = () =>
  /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

export default function VRViewerPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: propertyId } = useParams<{ id: string }>();
  const [property] = useState<Property | null>(
    location.state?.property || null
  );
  const [showUI, setShowUI] = useState(true);
  const [uiTimeout, setUiTimeout] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);
  const initialIndex = (location.state as any)?.startIndex ?? 0;
  const [currentImageIndex, setCurrentImageIndex] =
    useState<number>(initialIndex);
  const [isPortrait, setIsPortrait] = useState(false);
  const [orientationPermission, setOrientationPermission] = useState<
    "granted" | "denied" | "prompt"
  >("prompt");
  const [voiceCommandActive, setVoiceCommandActive] = useState(false);
  const [voiceInitError, setVoiceInitError] = useState<string | null>(null);
  const [lastDetection, setLastDetection] = useState<string | null>(null);
  const [voiceStatus, setVoiceStatus] = useState<string>("idle");
  const [navMode, setNavMode] = useState(false);
  const [inputMode, setInputMode] = useState<"voice" | "typing" | null>(null);
  const [typedCommand, setTypedCommand] = useState<string>("");
  const [showGalleryMenu, setShowGalleryMenu] = useState(false);
  const [showFurnitureMenu, setShowFurnitureMenu] = useState(false);
  const [furnitureData, setFurnitureData] = useState<FurnitureApiResponse>();
  const [isFurnitureLoading, setIsFurnitureLoading] = useState(false);
  const [furnitureLoadingStep, setFurnitureLoadingStep] = useState(0);
  const [isStagedImageLoading, setIsStagedImageLoading] = useState(false);

  // Initialize budget from localStorage or default
  const [setupStep, setSetupStep] = useState<"budget" | "input-mode" | "done">(
    () => {
      const savedBudget = localStorage.getItem("vista-user-budget");
      return savedBudget ? "input-mode" : "budget";
    }
  );
  const [budget, setBudget] = useState<number>(() => {
    const savedBudget = localStorage.getItem("vista-user-budget");
    return savedBudget ? parseInt(savedBudget, 10) : 50000;
  });
  const [budgetInput, setBudgetInput] = useState<string>(() => {
    const savedBudget = localStorage.getItem("vista-user-budget");
    return savedBudget || "50000";
  });
  const MIN_BUDGET = 10000;
  const MAX_BUDGET = 500000;

  // Virtual Staging State
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [stagedImageUrl, setStagedImageUrl] = useState<string | null>(null);
  const [isImagesLoading, setIsImagesLoading] = useState(true);
  const generationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  // Cycle through loading steps
  useEffect(() => {
    if (!isFurnitureLoading) return;

    const interval = setInterval(() => {
      setFurnitureLoadingStep((prev) => (prev + 1) % 4);
    }, 1500);

    return () => clearInterval(interval);
  }, [isFurnitureLoading]);

  const extractFurniture = async (
    sessionId: string,
    index: number,
    budget: number
  ): Promise<FurnitureApiResponse> => {
    return virtualStagingService.extractFurniture(
      sessionId,
      index,
      budget.toString()
    );
  };
  // React Speech Recognition hook
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  const recognitionRef = useRef<any>(null);
  const voiceTriggerTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const silenceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [liveTranscript, setLiveTranscript] = useState<string>("");

  // Initialize panoramic images from session or property
  const sessionPanoramicImages =
    (location.state as any)?.panoramicImagesFromSession || null;

  const initialPanoramicImages = sessionPanoramicImages
    ? sessionPanoramicImages.map((img: any) => ({
        url: img.url,
        title: img.filename || "Panoramic View",
        description: "",
      }))
    : (property?.images || [])
        .filter((img: any) => img.imageType === "panoramic")
        .map((img: any) => ({
          url: img.url,
          title: img.filename || "Panoramic View",
          description: "",
        }));

  const [panoramicImages, setPanoramicImages] = useState<any[]>(
    initialPanoramicImages.length > 0
      ? initialPanoramicImages
      : property?.panoramicImages || []
  );

  const isMobile = isMobileDevice();

  const parseSpokenNumber = (text: string) => {
    const digitMatch = text.match(/\b(\d{1,2})\b/);
    if (digitMatch) return parseInt(digitMatch[1], 10);
    const words: Record<string, number> = {
      one: 1,
      two: 2,
      three: 3,
      four: 4,
      five: 5,
      six: 6,
      seven: 7,
      eight: 8,
      nine: 9,
      ten: 10,
      eleven: 11,
      twelve: 12,
    };
    const tokens = text.split(/\s+/);
    for (const t of tokens) {
      if (words[t] !== undefined) return words[t];
    }
    return null;
  };

  // Initialize virtual staging session
  const initializeSession = async () => {
    if (!propertyId || sessionId) return;

    try {
      // Check localStorage for existing session for this property
      const storedSessionId = getStagingSessionId(propertyId);

      if (storedSessionId) {
        // Session exists in localStorage, use it
        console.log(
          "✅ Using existing session from localStorage:",
          storedSessionId
        );

        // Verify session is still valid by fetching it
        try {
          await virtualStagingService.getSession(storedSessionId);
          console.log("✅ Existing session is valid");
          setSessionId(storedSessionId);
          return;
        } catch (error) {
          console.warn("⚠️ Stored session invalid, creating new one:", error);
          removeStagingSession(propertyId);
        }
      }

      // Create a new session (either no stored session or stored session was invalid)
      const response = await virtualStagingService.createSession({
        property_id: propertyId,
        user_id: "guest",
        room_name: "Main Room",
      });

      const newSessionId = response.session_id;
      storeStagingSession(propertyId, newSessionId);
      setSessionId(newSessionId);
      setGenerationError(null);
    } catch (error: any) {
      console.error("Failed to create staging session:", error);
      setGenerationError(error.message || "Failed to create staging session");
    }
  };

  // Generate staging from prompt
  const generateStagingImage = async (prompt: string) => {
    if (!sessionId) return;

    setIsGenerating(true);
    setGenerationError(null);
    setStagedImageUrl(null); // Clear previous staged image first

    try {
      const response = await virtualStagingService.generateStaging({
        session_id: sessionId,
        image_index: currentImageIndex,
        custom_prompt: prompt,
        user_message: prompt,
      });

      console.log("Staging generation response:", response);
      // Set new staged image URL
      setStagedImageUrl(response.new_panorama_url);
      setIsStagedImageLoading(true); // Show loading while image loads
      console.log("Generated staged image:", response.new_panorama_url);
    } catch (error: any) {
      console.error("Failed to generate staging:", error);
      setGenerationError(error.message || "Failed to generate staged image");
    } finally {
      setIsGenerating(false);
    }
  };

  // Preload staged image URL to reduce delay
  useEffect(() => {
    if (stagedImageUrl) {
      const proxyUrl = `https://images.weserv.nl/?url=${encodeURIComponent(stagedImageUrl)}`;
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = proxyUrl;
      img.onload = () => {
        console.log("✅ Staged image preloaded:", stagedImageUrl);
        setIsStagedImageLoading(false); // Image is ready
      };
      img.onerror = () => {
        console.error("❌ Failed to preload staged image:", stagedImageUrl);
        setIsStagedImageLoading(false); // Stop loading even if failed
      };
    }
  }, [stagedImageUrl]);

  // Mark images as loaded after component mounts
  useEffect(() => {
    // Small delay to ensure Three.js scene is initialized
    const timer = setTimeout(() => {
      setIsImagesLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Helper function to generate staging and refetch session
  const generateAndRefreshSession = async (prompt: string) => {
    await generateStagingImage(prompt);
    // Refetch session after staging completes to get updated content
    if (sessionId) {
      try {
        const updatedSession =
          await virtualStagingService.getSession(sessionId);
        console.log(
          "✅ Session refetched with updated content:",
          updatedSession
        );
        // Update panoramic images with new content from session
        if (
          updatedSession.session.panoramic_images &&
          updatedSession.session.panoramic_images.length > 0
        ) {
          const newPanoramicImages =
            updatedSession.session.panoramic_images.map((img: any) => ({
              url: img.url,
              title: img.filename || "Panoramic View",
              description: "",
            }));
          // Update state with new panoramic images
          setPanoramicImages(newPanoramicImages);
          console.log("✅ Panoramic images updated in state");
        }
      } catch (error) {
        console.error("Failed to refetch session:", error);
      }
    }
    // Clear transcripts and subtitle after generation completes
    setLiveTranscript("");
    resetTranscript();
  };

  // Handle voice command (5 second delay then generate and refresh)
  const scheduleVoiceGeneration = (prompt: string) => {
    // Clear existing timeout
    if (generationTimeoutRef.current) {
      clearTimeout(generationTimeoutRef.current);
    }

    // Schedule generation after 5 seconds
    generationTimeoutRef.current = setTimeout(() => {
      generateAndRefreshSession(prompt);
    }, 5000);
  };

  // Detect Web Speech API support (Chrome)
  useEffect(() => {
    if (browserSupportsSpeechRecognition) {
      // Get the actual recognition instance from react-speech-recognition
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = SpeechRecognition.getRecognition?.() || null;
      }
    }
  }, [browserSupportsSpeechRecognition]);

  // Clear interim and reset navMode when listening stops
  useEffect(() => {
    if (!listening && (navMode || liveTranscript)) {
      console.log(
        "🎤 Listening stopped - clearing interim and resetting navMode"
      );
      setLiveTranscript("");
      setNavMode(false);
    }
  }, [listening, navMode, liveTranscript]);

  useEffect(() => {
    console.log("📸 Current image index changed to:", currentImageIndex);
    // Clear staged image when navigating to a different panoramic image
    setStagedImageUrl(null);
  }, [currentImageIndex]);

  // Process transcript from react-speech-recognition
  useEffect(() => {
    if (!transcript.trim()) return;

    const text = transcript.toLowerCase().trim();
    console.log("📝 Transcript received:", text);

    // Clear any existing silence timeout
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
    }

    if (listening) {
      const heyEchoIndex = text.indexOf("hey echo");

      // Only process if "hey echo" is found in the transcript
      if (heyEchoIndex !== -1) {
        // Extract only the part from "hey echo" onwards
        const capturedText = text.substring(heyEchoIndex);
        console.log('🎤 Captured from "hey echo":', capturedText);
        console.log("🎤 Storing in liveTranscript:", capturedText);

        // Check for exit navigate command
        if (capturedText.includes("exit navigate")) {
          setNavMode(false);
          setLiveTranscript("");
          console.log(
            '🎤 "exit navigate" detected - closing navigation panel and clearing interim'
          );
        } else {
          // Check if "navigate" is in the captured text
          const hasNavigate = capturedText.includes("navigate");
          if (hasNavigate && !navMode) {
            setNavMode(true);
            setLiveTranscript("");
            console.log(
              '🎤 "navigate" detected - showing navigation panel and clearing interim'
            );
          } else {
            // Regular "hey echo" with other text - show interim and schedule generation
            setLiveTranscript(capturedText);

            // If in voice mode and not navigating, schedule generation
            if (inputMode === "voice" && !hasNavigate && sessionId) {
              const commandText = capturedText.replace("hey echo", "").trim();
              if (commandText) {
                scheduleVoiceGeneration(commandText);
              }
            }
          }
        }

        // Clear previous silence timeout and set new one
        if (silenceTimeoutRef.current) {
          clearTimeout(silenceTimeoutRef.current);
        }
      } else {
        // "hey echo" not found, clear display and exit nav mode
        if (navMode) {
          console.log('🎤 Speech without "hey echo" - resetting');
          setLiveTranscript("");
          setNavMode(false);
        }
      }
    } else {
      // Final result when listening stops
      if (navMode) {
        const heyEchoIndex = text.indexOf("hey echo");
        if (heyEchoIndex !== -1) {
          const capturedText = text.substring(heyEchoIndex);
          const hasNavigate = capturedText.includes("navigate");
          const chosen = parseSpokenNumber(capturedText);

          if (
            hasNavigate &&
            chosen !== null &&
            chosen >= 1 &&
            chosen <= panoramicImages.length
          ) {
            // Valid navigation command
            setCurrentImageIndex(chosen - 1);
            setStagedImageUrl(null); // Reset staged image when navigating
            setLastDetection(
              `navigate to ${chosen} @ ${new Date().toLocaleTimeString()}`
            );
            setNavMode(false);
            setVoiceCommandActive(false);
            setVoiceStatus("speech listening");
            setLiveTranscript("");
          } else {
            // Started with "hey echo" but no valid navigate command
            setLiveTranscript(capturedText);
            setLastDetection(`heard: ${capturedText}`);
          }
        } else {
          // Was in nav mode but final result doesn't contain "hey echo"
          setLiveTranscript("");
          setNavMode(false);
        }
      } else {
        setLiveTranscript("");
      }
      resetTranscript();
    }
  }, [
    transcript,
    listening,
    navMode,
    panoramicImages.length,
    inputMode,
    sessionId,
  ]);

  // Web Speech API: listen for "hey echo"
  const startSpeechRecognition = async () => {
    if (!browserSupportsSpeechRecognition) return;
    try {
      await SpeechRecognition.startListening({
        continuous: true,
        language: "en-US",
      });
      setVoiceStatus("speech listening");
      setVoiceInitError(null);
    } catch (err: any) {
      console.error("SpeechRecognition start failed", err);
      setVoiceInitError(err?.message || "SpeechRecognition start failed");
      setVoiceStatus("speech error");
    }
  };

  // Cleanup speech recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        try {
          recognitionRef.current.stop();
        } catch (_) {
          /* noop */
        }
        recognitionRef.current = null;
      }
      if (voiceTriggerTimeoutRef.current) {
        clearTimeout(voiceTriggerTimeoutRef.current);
      }
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
      if (generationTimeoutRef.current) {
        clearTimeout(generationTimeoutRef.current);
      }
    };
  }, []);

  // Ensure full screen without scrolling
  useEffect(() => {
    document.documentElement.style.margin = "0";
    document.documentElement.style.padding = "0";
    document.documentElement.style.width = "100%";
    document.documentElement.style.height = "100vh";
    document.documentElement.style.overflow = "hidden";

    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.width = "100%";
    document.body.style.height = "100vh";
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.touchAction = "none";

    return () => {
      document.documentElement.style.overflow = "auto";
      document.body.style.overflow = "auto";
      document.body.style.position = "relative";
      document.body.style.touchAction = "auto";
    };
  }, []);

  // Lock to landscape on mobile and detect orientation
  useEffect(() => {
    if (isMobileDevice()) {
      // Try to lock screen orientation to landscape
      const lockOrientation = async () => {
        try {
          const orientation = screen.orientation as any;
          if (orientation && orientation.lock) {
            await orientation.lock("landscape");
            console.log("Screen locked to landscape");
          }
        } catch (err) {
          console.log("Could not lock orientation:", err);
        }
      };
      lockOrientation();

      // Check current orientation
      const checkOrientation = () => {
        setIsPortrait(window.innerHeight > window.innerWidth);
      };
      checkOrientation();
      window.addEventListener("resize", checkOrientation);
      window.addEventListener("orientationchange", checkOrientation);

      return () => {
        // Unlock orientation when leaving
        const orientation = screen.orientation as any;
        if (orientation && orientation.unlock) {
          orientation.unlock();
        }
        window.removeEventListener("resize", checkOrientation);
        window.removeEventListener("orientationchange", checkOrientation);
      };
    }
  }, []);

  // Request device orientation permission (iOS 13+)
  const requestOrientationPermission = async () => {
    console.log("Requesting orientation permission...");

    if (
      typeof DeviceOrientationEvent !== "undefined" &&
      typeof (DeviceOrientationEvent as any).requestPermission === "function"
    ) {
      try {
        console.log("iOS detected, requesting permission...");
        const permission = await (
          DeviceOrientationEvent as any
        ).requestPermission();
        console.log("Permission result:", permission);
        setOrientationPermission(permission);
        if (permission === "granted") {
          setInputMode("voice");
        }
      } catch (err) {
        console.error("Orientation permission error:", err);
        setOrientationPermission("denied");
      }
    } else {
      // Non-iOS devices (Android) don't need permission
      console.log("Non-iOS device, granting permission automatically");
      setOrientationPermission("granted");
      setInputMode("voice");
    }
  };

  useEffect(() => {
    const handleMouseMove = () => {
      setShowUI(true);
      if (uiTimeout) clearTimeout(uiTimeout);
      const timeout = setTimeout(() => setShowUI(false), 3000);
      setUiTimeout(timeout);
    };

    const handleMouseLeave = () => {
      if (uiTimeout) clearTimeout(uiTimeout);
      setShowUI(false);
    };

    // Also show UI on touch for mobile
    const handleTouchStart = () => {
      setShowUI(true);
      if (uiTimeout) clearTimeout(uiTimeout);
      const timeout = setTimeout(() => setShowUI(false), 3000);
      setUiTimeout(timeout);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("touchstart", handleTouchStart);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("touchstart", handleTouchStart);
      if (uiTimeout) clearTimeout(uiTimeout);
    };
  }, [uiTimeout]);

  // Initialize staging session when component mounts and input mode is set
  useEffect(() => {
    if (inputMode && !sessionId && propertyId) {
      initializeSession();
    }
  }, [inputMode, propertyId, sessionId]);

  if (!property) {
    return (
      <div className="bg-vista-bg flex min-h-screen flex-col">
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <h1 className="text-vista-primary mb-2 text-2xl font-bold">
              Property Not Found
            </h1>
            <button
              onClick={() => navigate("/seller/properties")}
              className="text-vista-accent hover:text-vista-primary transition-colors"
            >
              Back to Properties
            </button>
          </div>
        </div>
      </div>
    );
  }

  const voiceActive = listening;

  return (
    <div className="fixed top-0 left-0 h-screen w-screen overflow-hidden bg-black">
      {/** Combined voice active state for Porcupine or Web Speech */}
      {/** Decide active state before JSX to reduce duplication */}

      {/* Budget Input - First step */}
      {setupStep === "budget" && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/95 p-8 text-white">
          <h2 className="mb-2 text-center text-3xl font-bold">
            Set Your Budget
          </h2>
          <p className="mb-8 text-center text-white/70">
            What's your estimated budget for furniture staging?
          </p>

          <div className="w-full max-w-md space-y-6">
            {/* Budget Display */}
            <div className="text-center">
              <span className="text-vista-accent text-5xl font-bold">
                ₱{budget.toLocaleString()}
              </span>
            </div>

            {/* Range Slider */}
            <div className="space-y-2">
              <input
                type="range"
                min={MIN_BUDGET}
                max={MAX_BUDGET}
                step={1000}
                value={budget}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setBudget(val);
                  setBudgetInput(val.toString());
                }}
                className="accent-vista-accent h-3 w-full cursor-pointer appearance-none rounded-lg bg-white/20"
                style={{
                  background: `linear-gradient(to right, #FFB800 0%, #FFB800 ${((budget - MIN_BUDGET) / (MAX_BUDGET - MIN_BUDGET)) * 100}%, rgba(255,255,255,0.2) ${((budget - MIN_BUDGET) / (MAX_BUDGET - MIN_BUDGET)) * 100}%, rgba(255,255,255,0.2) 100%)`,
                }}
              />
              <div className="flex justify-between text-xs text-white/50">
                <span>₱{MIN_BUDGET.toLocaleString()}</span>
                <span>₱{MAX_BUDGET.toLocaleString()}</span>
              </div>
            </div>

            {/* Manual Input */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-white/70">Or enter amount:</span>
              <div className="relative flex-1">
                <span className="absolute top-1/2 left-3 -translate-y-1/2 text-white/50">
                  ₱
                </span>
                <input
                  type="text"
                  value={budgetInput}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/[^0-9]/g, "");
                    setBudgetInput(raw);
                    const val = parseInt(raw) || MIN_BUDGET;
                    if (val >= MIN_BUDGET && val <= MAX_BUDGET) {
                      setBudget(val);
                    }
                  }}
                  onBlur={() => {
                    const val = parseInt(budgetInput) || MIN_BUDGET;
                    const clamped = Math.max(
                      MIN_BUDGET,
                      Math.min(MAX_BUDGET, val)
                    );
                    setBudget(clamped);
                    setBudgetInput(clamped.toString());
                  }}
                  className="focus:border-vista-accent w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 pl-8 text-white focus:outline-none"
                  placeholder="50000"
                />
              </div>
            </div>

            {/* Continue Button */}
            <button
              onClick={() => {
                localStorage.setItem("vista-user-budget", budget.toString());
                setSetupStep("input-mode");
              }}
              className="bg-vista-accent hover:bg-vista-accent/80 mt-4 w-full rounded-lg px-8 py-4 font-semibold text-black transition-colors"
            >
              Continue
            </button>

            <p className="text-center text-xs text-white/40">
              Minimum budget: ₱{MIN_BUDGET.toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {/* Input Mode Selection - Second step (desktop only) */}
      {setupStep === "input-mode" && inputMode === null && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/95 p-8 text-white">
          <div className="bg-vista-accent/20 mb-4 rounded-full px-4 py-2">
            <span className="text-vista-accent text-sm font-medium">
              Budget: ₱{budget.toLocaleString()}
            </span>
          </div>
          <h2 className="mb-4 text-center text-3xl font-bold">
            Choose Input Method
          </h2>
          <p className="mb-8 text-center text-white/70">
            How would you like to navigate?
          </p>
          <div className="flex gap-6">
            <button
              onClick={() => {
                setInputMode("voice");
                setSetupStep("done");
              }}
              className="bg-vista-accent hover:bg-vista-accent/80 rounded-lg px-8 py-4 font-semibold text-black transition-colors"
            >
              🎤 Voice Commands (Echo)
            </button>
            <button
              onClick={() => {
                setInputMode("typing");
                setSetupStep("done");
              }}
              className="rounded-lg bg-white/20 px-8 py-4 font-semibold text-white transition-colors hover:bg-white/30"
            >
              ⌨️ Type Commands
            </button>
          </div>
          <button
            onClick={() => setSetupStep("budget")}
            className="mt-6 text-sm text-white/50 transition-colors hover:text-white/70"
          >
            ← Change budget
          </button>
        </div>
      )}

      {/* Desktop Input Mode Toggle - Show voice mode indicator only */}
      {!isMobile && inputMode === "voice" && false && (
        <div className="absolute top-2 right-2 z-30">
          <button
            onClick={() => setInputMode("typing")}
            className="bg-vista-accent rounded-full px-3 py-1 text-xs font-semibold text-black hover:opacity-90"
          >
            🎤 Voice
          </button>
        </div>
      )}

      {/* Mobile/Desktop Hamburger Menu Button (All modes) */}
      {inputMode !== null && (
        <div
          className={`absolute ${isMobile ? "top-2 right-2" : "top-2 right-2"} z-30 flex gap-2`}
        >
          {/* Save Changes Button */}
          <button
            onClick={() => {
              // Handle save changes logic
              console.log("Save changes clicked");
            }}
            className="bg-vista-accent rounded-lg p-2 text-black hover:opacity-90"
            title="Save Changes"
          >
            <Save size={20} />
          </button>
          {/* Furniture Summary Button */}
          <button
            onClick={() => {
              setShowFurnitureMenu(!showFurnitureMenu);
              setShowGalleryMenu(false);
            }}
            className="bg-vista-accent rounded-lg p-2 text-black hover:opacity-90"
            title="Furniture Summary"
          >
            <ShoppingBag size={20} />
          </button>
          {/* Gallery Menu Button */}
          <button
            onClick={() => {
              setShowGalleryMenu(!showGalleryMenu);
              setShowFurnitureMenu(false);
            }}
            className="bg-vista-accent rounded-lg p-2 text-black hover:opacity-90"
            title="Panoramic Views"
          >
            {showGalleryMenu ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      )}
      {typeof window !== "undefined" &&
        (!isMobile || (orientationPermission === "granted" && !isPortrait)) &&
        browserSupportsSpeechRecognition &&
        !voiceActive &&
        !(
          window.isSecureContext || window.location.hostname === "localhost"
        ) && (
          <div className="absolute top-14 left-1/2 z-30 -translate-x-1/2 rounded-full bg-amber-600/90 px-4 py-2 text-sm text-white shadow">
            Microphone requires HTTPS or localhost
          </div>
        )}
      {/* Portrait Mode Warning for Mobile */}
      {isMobileDevice() && isPortrait && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/95 p-8 text-white">
          <RotateCcw size={64} className="mb-6 animate-pulse" />
          <h2 className="mb-2 text-center text-2xl font-bold">
            Rotate Your Device
          </h2>
          <p className="mb-6 text-center text-white/70">
            Please rotate your phone to landscape mode for the best VR
            experience
          </p>
        </div>
      )}

      {/* Mobile Budget Input - First step */}
      {isMobile && setupStep === "budget" && !isPortrait && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/95 p-6 text-white">
          <h2 className="mb-2 text-center text-2xl font-bold">
            Set Your Budget
          </h2>
          <p className="mb-6 text-center text-sm text-white/70">
            Estimated budget for furniture staging
          </p>

          <div className="w-full max-w-sm space-y-5">
            {/* Budget Display */}
            <div className="text-center">
              <span className="text-vista-accent text-4xl font-bold">
                ₱{budget.toLocaleString()}
              </span>
            </div>

            {/* Range Slider */}
            <div className="space-y-2">
              <input
                type="range"
                min={MIN_BUDGET}
                max={MAX_BUDGET}
                step={1000}
                value={budget}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setBudget(val);
                  setBudgetInput(val.toString());
                }}
                className="accent-vista-accent h-3 w-full cursor-pointer appearance-none rounded-lg bg-white/20"
                style={{
                  background: `linear-gradient(to right, #FFB800 0%, #FFB800 ${((budget - MIN_BUDGET) / (MAX_BUDGET - MIN_BUDGET)) * 100}%, rgba(255,255,255,0.2) ${((budget - MIN_BUDGET) / (MAX_BUDGET - MIN_BUDGET)) * 100}%, rgba(255,255,255,0.2) 100%)`,
                }}
              />
              <div className="flex justify-between text-xs text-white/50">
                <span>₱{MIN_BUDGET.toLocaleString()}</span>
                <span>₱{MAX_BUDGET.toLocaleString()}</span>
              </div>
            </div>

            {/* Manual Input */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/70">Or enter:</span>
              <div className="relative flex-1">
                <span className="absolute top-1/2 left-3 -translate-y-1/2 text-sm text-white/50">
                  ₱
                </span>
                <input
                  type="number"
                  inputMode="numeric"
                  value={budgetInput}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/[^0-9]/g, "");
                    setBudgetInput(raw);
                    const val = parseInt(raw) || MIN_BUDGET;
                    if (val >= MIN_BUDGET && val <= MAX_BUDGET) {
                      setBudget(val);
                    }
                  }}
                  onBlur={() => {
                    const val = parseInt(budgetInput) || MIN_BUDGET;
                    const clamped = Math.max(
                      MIN_BUDGET,
                      Math.min(MAX_BUDGET, val)
                    );
                    setBudget(clamped);
                    setBudgetInput(clamped.toString());
                  }}
                  className="focus:border-vista-accent w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 pl-7 text-sm text-white focus:outline-none"
                  placeholder="50000"
                />
              </div>
            </div>

            {/* Continue Button */}
            <button
              onClick={() => {
                localStorage.setItem("vista-user-budget", budget.toString());
                setSetupStep("done");
              }}
              className="bg-vista-accent hover:bg-vista-accent/80 w-full rounded-lg px-6 py-3 font-semibold text-black transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* iOS Permission Request */}
      {isMobileDevice() &&
        setupStep === "done" &&
        orientationPermission === "prompt" &&
        !isPortrait && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/90 p-8 text-white">
            <h2 className="mb-4 text-center text-2xl font-bold">
              Enable Motion Controls
            </h2>
            <p className="mb-6 text-center text-white/70">
              Allow device motion to look around by moving your phone
            </p>
            <p className="mb-4 text-center text-sm text-white/50">
              ✨ Say "Hey Echo" to navigate to next view hands-free
            </p>
            <button
              onClick={requestOrientationPermission}
              className="bg-vista-accent hover:bg-vista-accent/80 rounded-lg px-6 py-3 font-semibold text-white transition-colors"
            >
              Enable Motion Controls
            </button>
            <button
              onClick={() => {
                setOrientationPermission("denied");
                setInputMode("typing");
              }}
              className="mt-4 text-white/50 transition-colors hover:text-white/70"
            >
              Skip (use touch instead)
            </button>
          </div>
        )}

      {/* Voice Command Indicator - Only show in voice mode */}
      {voiceActive && inputMode === "voice" && (
        <div className="absolute top-20 left-1/2 z-30 flex -translate-x-1/2 transform items-center gap-2 rounded-full bg-black/70 px-3 py-1 backdrop-blur-sm">
          <Mic
            size={12}
            className={`text-vista-accent ${voiceCommandActive ? "animate-pulse" : ""}`}
          />
          <span className="text-xs text-white">Voice commands active</span>
        </div>
      )}

      {/* Live Captions - Only show in voice mode */}
      {voiceActive &&
        inputMode === "voice" &&
        (liveTranscript || isGenerating) && (
          <div className="absolute right-0 bottom-20 left-0 z-30 flex justify-center px-2 md:px-4">
            <div className="w-full max-w-2xl rounded-lg border border-white/10 bg-black/90 px-3 py-2 text-center text-sm text-white shadow-lg backdrop-blur-sm md:rounded-xl md:px-4 md:py-3 md:text-base">
              {isGenerating ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="bg-vista-accent h-2 w-2 animate-pulse rounded-full"></div>
                  <span className="font-medium">
                    Generating staged image...
                  </span>
                </div>
              ) : (
                <span className="font-medium">{liveTranscript}</span>
              )}
            </div>
          </div>
        )}

      {/* Typing Input - Show in typing mode */}
      {inputMode === "typing" && (
        <div className="absolute right-0 bottom-20 left-0 z-30 flex justify-center px-3 md:bottom-8 md:px-4">
          <div className="flex w-full max-w-lg flex-col gap-2">
            <input
              type="text"
              value={typedCommand}
              onChange={(e) => setTypedCommand(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const cmd = typedCommand.toLowerCase().trim();
                  if (cmd.includes("navigate")) {
                    setNavMode(true);
                    setTypedCommand("");
                  } else if (cmd.includes("exit navigate")) {
                    setNavMode(false);
                    setTypedCommand("");
                  } else {
                    // Handle number navigation
                    const num = parseInt(cmd);
                    if (
                      !isNaN(num) &&
                      num >= 1 &&
                      num <= panoramicImages.length
                    ) {
                      setCurrentImageIndex(num - 1);
                      setStagedImageUrl(null); // Reset staged image when navigating
                      setLastDetection(`navigate to ${num}`);
                      setTypedCommand("");
                    } else {
                      // Treat as staging prompt - generate and refresh session
                      if (sessionId && cmd) {
                        generateAndRefreshSession(cmd);
                        setTypedCommand("");
                      }
                    }
                  }
                }
              }}
              placeholder="Type a design prompt or 'navigate'..."
              className="focus:border-vista-accent flex-1 rounded-lg border border-white/20 bg-black/80 px-3 py-2 text-xs text-white focus:outline-none md:text-sm"
            />
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const cmd = typedCommand.toLowerCase().trim();
                  if (cmd.includes("navigate")) {
                    setNavMode(true);
                    setTypedCommand("");
                  } else if (cmd.includes("exit navigate")) {
                    setNavMode(false);
                    setTypedCommand("");
                  } else {
                    // Handle number navigation
                    const num = parseInt(cmd);
                    if (
                      !isNaN(num) &&
                      num >= 1 &&
                      num <= panoramicImages.length
                    ) {
                      setCurrentImageIndex(num - 1);
                      setStagedImageUrl(null); // Reset staged image when navigating
                      setLastDetection(`navigate to ${num}`);
                      setTypedCommand("");
                    } else {
                      // Treat as staging prompt - generate and refresh session
                      if (sessionId && cmd) {
                        generateAndRefreshSession(cmd);
                        setTypedCommand("");
                      }
                    }
                  }
                }}
                disabled={isGenerating}
                className="bg-vista-accent rounded-lg px-2 py-2 text-xs font-semibold whitespace-nowrap text-black hover:opacity-90 disabled:opacity-50 md:px-3 md:text-sm"
              >
                {isGenerating ? "Generating..." : "Send"}
              </button>
            </div>
            {generationError && (
              <div className="rounded bg-red-900/20 px-2 py-1 text-xs text-red-400">
                {generationError}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation modal when in navigate mode */}
      {navMode && panoramicImages.length > 1 && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="flex max-h-[70vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0f172a]/95 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div className="font-semibold text-white">
                Say a number to switch views
              </div>
              <div className="text-xs text-white/60">
                {panoramicImages.length} available
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 overflow-y-auto p-4 md:grid-cols-3">
              {panoramicImages.map((image: any, idx: any) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCurrentImageIndex(idx);
                    setStagedImageUrl(null); // Reset staged image when navigating
                    setNavMode(false);
                  }}
                  className="hover:border-vista-accent flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 transition-all hover:bg-white/10"
                >
                  <div className="bg-vista-accent flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-black">
                    {idx + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold text-white">
                      {image.title || `View ${idx + 1}`}
                    </div>
                    <div className="truncate text-xs text-white/50">
                      Say "{idx + 1}" to jump
                    </div>
                  </div>
                  <div className="h-12 w-16 overflow-hidden rounded-lg border border-white/10 bg-black/40">
                    <img
                      src={image.url}
                      alt={image.title || `View ${idx + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </button>
              ))}
            </div>
            <div className="border-t border-white/10 px-4 py-3 text-xs text-white/60">
              Say "Hey Echo, Navigate" then a number (1-{panoramicImages.length}
              ) to select
            </div>
          </div>
        </div>
      )}

      {/* CTA: Tap to enable voice (requests mic permission and starts listening) */}
      {browserSupportsSpeechRecognition &&
        inputMode === "voice" &&
        !voiceActive &&
        orientationPermission === "granted" &&
        !isPortrait && (
          <div className="pointer-events-auto absolute bottom-32 left-1/2 z-50 -translate-x-1/2">
            <button
              className="bg-vista-accent cursor-pointer rounded-full px-5 py-2 font-medium text-black shadow hover:opacity-90 active:opacity-80"
              onClick={async () => {
                try {
                  if (
                    !(
                      window.isSecureContext ||
                      window.location.hostname === "localhost"
                    )
                  ) {
                    setVoiceInitError("Microphone requires HTTPS or localhost");
                    return;
                  }
                  if (!navigator.mediaDevices?.getUserMedia) {
                    setVoiceInitError("Microphone API not available");
                    return;
                  }
                  const stream = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                  });
                  stream.getTracks().forEach((t) => t.stop());
                  const AC: any =
                    (window as any).AudioContext ||
                    (window as any).webkitAudioContext;
                  if (AC) {
                    const ctx = new AC();
                    if (ctx.state === "suspended") {
                      await ctx.resume();
                    }
                    await ctx.close();
                  }
                  startSpeechRecognition();
                } catch (err: any) {
                  console.error("Mic/voice start failed", err);
                  setVoiceInitError(
                    err?.message || "Microphone permission denied"
                  );
                  setVoiceStatus("start failed");
                }
              }}
            >
              Tap to enable voice
            </button>
          </div>
        )}

      {/* Voice debug status */}
      {browserSupportsSpeechRecognition && false && (
        <div className="absolute bottom-6 left-4 z-30 space-y-1 rounded-md bg-black/50 px-3 py-2 text-xs text-white/70">
          <div>Voice: {voiceStatus}</div>
          <div>Listening: {String(voiceActive)}</div>
          <div>Last: {lastDetection || "—"}</div>
          {voiceInitError && (
            <div className="text-red-300">Error: {voiceInitError}</div>
          )}
        </div>
      )}

      {/* Three.js 360 Panorama Viewer - Fullscreen */}
      {panoramicImages.length > 0 && (
        <>
          <PanoramaViewer
            key={`${stagedImageUrl || panoramicImages[currentImageIndex].url}-${currentImageIndex}`}
            imageUrl={stagedImageUrl || panoramicImages[currentImageIndex].url}
            width="100%"
            height="100%"
            useDeviceOrientation={
              isMobileDevice() && orientationPermission === "granted"
            }
            vrMode={true}
          />
          {/* Loading Indicator */}
          {(isImagesLoading || isStagedImageLoading) && (
            <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/80">
              <div className="mb-4 flex flex-col items-center gap-3">
                <div className="border-t-vista-accent h-12 w-12 animate-spin rounded-full border-4 border-white/20"></div>
                <p className="text-sm text-white">Loading 360° view...</p>
              </div>
            </div>
          )}
        </>
      )}
      {panoramicImages.length === 0 && (
        <div className="flex h-full w-full items-center justify-center text-white">
          <p>No panoramic images available</p>
        </div>
      )}

      {/* Header Overlay - Auto-hide */}
      <div
        className={`absolute top-0 right-0 left-0 z-20 bg-linear-to-b from-black/80 to-transparent transition-opacity duration-300 ${
          showUI ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4 md:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="rounded-lg p-2 transition-colors hover:bg-white/10"
            >
              <ChevronLeft size={24} className="text-white" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-white">
                {property.name} - VR Experience
              </h1>
              <p className="text-sm text-white/70">
                {panoramicImages[currentImageIndex].title || "Unlabeled Room"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Current Image Label - Upper Right Corner */}
      {panoramicImages.length > 0 && !inputMode && (
        <div className="absolute top-4 right-4 z-20">
          <div className="rounded-lg bg-black/70 px-3 py-1 backdrop-blur-sm">
            <p className="text-xs font-semibold text-white/80 md:text-sm">
              {panoramicImages[currentImageIndex].title || "Unlabeled Room"}
            </p>
          </div>
        </div>
      )}

      {/* Panoramic Views List - Bottom Overlay - Auto-hide */}
      {panoramicImages.length > 1 && !inputMode && (
        <div
          className={`absolute right-0 bottom-12 left-0 z-20 bg-linear-to-t from-black/90 to-transparent p-2 transition-opacity duration-300 md:bottom-0 md:p-6 ${
            showUI ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <div className="mx-auto max-w-7xl px-1">
            <h2 className="mb-2 text-sm font-bold text-white md:mb-4 md:text-lg">
              Other Panoramic Views
            </h2>
            <div className="flex gap-1 overflow-x-auto pb-2 md:gap-2">
              {panoramicImages.map((image: any, index: any) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentImageIndex(index);
                  }}
                  className="group hover:border-vista-accent relative shrink-0 overflow-hidden rounded-lg border-2 border-white/20 transition-all"
                >
                  <div className="h-12 w-12 overflow-hidden md:h-24 md:w-24">
                    <img
                      src={image.url}
                      alt={image.title || `Panoramic View ${index + 1}`}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <div className="absolute inset-0 flex items-end justify-center bg-black/0 pb-1 transition-colors group-hover:bg-black/40">
                    <p className="px-1 text-center text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                      {image.title || `View ${index + 1}`}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Gallery Menu - Hamburger (All modes) */}
      {inputMode !== null && panoramicImages.length > 1 && showGalleryMenu && (
        <div
          className={`absolute ${isMobile ? "top-14 right-2" : "top-14 right-2"} z-30 max-h-96 w-64 overflow-y-auto rounded-xl border border-white/10 bg-[#0f172a]/95 shadow-2xl`}
        >
          <div className="border-b border-white/10 p-3">
            <h3 className="text-sm font-semibold text-white">
              Panoramic Views
            </h3>
          </div>
          <div className="space-y-1 p-2">
            {panoramicImages.map((image: any, idx: any) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentImageIndex(idx);
                  setShowGalleryMenu(false);
                }}
                className="group flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-white/10"
              >
                <div className="h-10 w-12 flex-shrink-0 overflow-hidden rounded-lg border border-white/10">
                  <img
                    src={image.url}
                    alt={image.title || `View ${idx + 1}`}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-white">
                    {image.title || `View ${idx + 1}`}
                  </div>
                  <div className="text-xs text-white/50">
                    Say or type "{idx + 1}"
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Furniture Summary Menu */}
      {inputMode !== null && showFurnitureMenu && (
        <div
          className={`absolute ${isMobile ? "top-14 right-2 left-2" : "top-14 right-2"} z-30 max-h-[70vh] overflow-y-auto rounded-xl border border-white/10 bg-[#0f172a]/95 shadow-2xl ${isMobile ? "w-auto" : "w-[520px]"}`}
        >
          <div className="sticky top-0 flex items-center justify-between border-b border-white/10 bg-[#0f172a]/95 p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <ShoppingBag size={18} className="text-vista-accent" />
              <h3 className="text-sm font-semibold text-white">
                AI Staging - Furniture Summary
              </h3>
            </div>
            <button
              onClick={() => setShowFurnitureMenu(false)}
              className="text-white/50 transition-colors hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          <div className="space-y-4 p-3">
            {/* Show Estimate Expenses button when no data and not loading */}
            {!furnitureData && !isFurnitureLoading && (
              <div className="flex flex-col items-center justify-center gap-3 py-8">
                <button
                  onClick={async () => {
                    if (sessionId) {
                      setFurnitureLoadingStep(0);
                      setIsFurnitureLoading(true);
                      try {
                        const result = await extractFurniture(
                          sessionId,
                          currentImageIndex,
                          budget
                        );
                        setFurnitureData(result);
                      } finally {
                        setIsFurnitureLoading(false);
                      }
                    }
                  }}
                  className="bg-vista-accent hover:bg-vista-accent/80 rounded-lg px-6 py-2 text-sm font-semibold text-black transition-colors"
                >
                  Estimate Expenses
                </button>
              </div>
            )}

            {/* Loading State - Show only when loading */}
            {isFurnitureLoading && (
              <div className="flex flex-col items-center justify-center gap-4 py-12">
                {/* Animated moving circles */}
                <div className="flex h-12 items-center justify-center gap-2">
                  {[0, 1, 2].map((idx) => (
                    <motion.div
                      key={idx}
                      className="bg-vista-accent h-3 w-3 rounded-full"
                      animate={{
                        y: [0, -15, 0],
                        opacity: [0.4, 1, 0.4],
                      }}
                      transition={{
                        duration: 1.2,
                        delay: idx * 0.2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  ))}
                </div>

                {/* Loading step text */}
                <motion.div
                  key={furnitureLoadingStep}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="text-center"
                >
                  <p className="text-sm font-medium text-white">
                    {furnitureLoadingStep === 0 && "Searching furniture..."}
                    {furnitureLoadingStep === 1 && "Analyzing prices..."}
                    {furnitureLoadingStep === 2 &&
                      "Preparing your suggestions..."}
                    {furnitureLoadingStep === 3 && "Finding best deals..."}
                  </p>
                  <p className="mt-1 text-xs text-white/50">
                    This may take a moment
                  </p>
                </motion.div>
              </div>
            )}

            {/* Extracted Furniture Items */}
            {!isFurnitureLoading &&
              furnitureData &&
              furnitureData.extracted_furniture.map((item, itemIdx) => (
                <div
                  key={itemIdx}
                  className="overflow-hidden rounded-lg border border-white/10"
                >
                  {/* Item Header */}
                  <div className="border-b border-white/10 bg-white/5 px-3 py-2">
                    <h4 className="text-vista-accent text-sm font-bold tracking-wide">
                      {item.item_type.toUpperCase()}
                    </h4>
                    <p className="mt-1 text-xs text-white/60">
                      {item.description}
                    </p>
                  </div>

                  {/* Table Header */}
                  <div className="grid grid-cols-12 gap-2 border-b border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/70">
                    <div className="col-span-5">Shop</div>
                    <div className="col-span-5">Price Range</div>
                    <div className="col-span-2">Link</div>
                  </div>

                  {/* Shop Links */}
                  <div className="divide-y divide-white/5">
                    {item.top_3_search_links.map((link, linkIdx) => (
                      <div
                        key={linkIdx}
                        className="grid grid-cols-12 items-center gap-2 px-3 py-2.5 text-xs transition-colors hover:bg-white/5"
                      >
                        <div
                          className="col-span-5 truncate font-medium text-white"
                          title={link.shop}
                        >
                          {link.shop}
                        </div>
                        <div className="text-vista-accent col-span-5 font-semibold">
                          ₱{link.price_bracket.replace(" - ", " - ₱")}
                        </div>
                        <div className="col-span-2">
                          <a
                            href={link.search_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-vista-accent inline-flex items-center gap-1 transition-colors hover:text-white"
                          >
                            <ExternalLink size={12} />
                            <span className="hidden md:inline">Shop</span>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

            {/* Budget Summary */}
            {!isFurnitureLoading && furnitureData && (
              <div className="border-vista-accent/30 bg-vista-accent/5 space-y-3 rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/70">Your Budget:</span>
                  <span className="font-semibold text-white">
                    ₱{budget.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/70">AI Allocation:</span>
                  <span className="text-vista-accent font-bold">
                    ₱
                    {furnitureData?.budget_summary.total_allocation.toLocaleString()}
                  </span>
                </div>
                <div className="border-t border-white/10 pt-3">
                  {(() => {
                    const totalAllocation =
                      furnitureData?.budget_summary.total_allocation || 0;
                    const remaining = budget - totalAllocation;
                    const isOver = remaining < 0;
                    return (
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-white">
                          Remaining Budget:
                        </span>
                        <span
                          className={`text-lg font-bold ${isOver ? "text-red-400" : "text-green-400"}`}
                        >
                          {isOver ? "-" : ""}₱
                          {Math.abs(remaining).toLocaleString()}
                        </span>
                      </div>
                    );
                  })()}
                </div>

                {/* AI Strategy */}
                <div className="border-t border-white/10 pt-3">
                  <p className="text-xs leading-relaxed text-white/50">
                    <span className="font-medium text-white/70">
                      AI Strategy:
                    </span>{" "}
                    {furnitureData?.budget_summary.strategy}
                  </p>
                </div>

                <p className="text-xs text-white/40">
                  * Click shop links to browse furniture within your price
                  range.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Staging Generation Modal */}
      <AnimatePresence>
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 15, stiffness: 300 }}
              className="relative mx-4 flex w-full max-w-sm flex-col items-center justify-center"
            >
              {/* Animated Background Circles */}
              <motion.div
                className="from-vista-primary to-vista-accent absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br opacity-10"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="from-vista-accent to-vista-primary absolute inset-12 -z-10 rounded-3xl bg-gradient-to-tr opacity-5"
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              />

              {/* Main Modal Card */}
              <div className="from-vista-primary/20 to-vista-accent/20 relative rounded-3xl border border-white/10 bg-gradient-to-br p-8 shadow-2xl backdrop-blur-xl">
                {/* Animated Magic Wand */}
                <div className="mb-6 flex justify-center">
                  <motion.div
                    animate={{ rotate: [0, 20, -20, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <Wand2 size={48} className="text-vista-accent" />
                    </motion.div>
                  </motion.div>
                </div>

                {/* Text Content */}
                <h2 className="mb-2 text-center text-2xl font-bold text-white">
                  Staging Your Space
                </h2>
                <p className="mb-6 text-center text-sm text-white/80">
                  AI is transforming...
                </p>

                {/* Progress Bar */}
                <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    className="from-vista-accent to-vista-primary h-full bg-gradient-to-r"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </div>

                {/* Pulsing Dots */}
                <div className="flex items-center justify-center gap-2">
                  {[0, 1, 2].map((idx) => (
                    <motion.div
                      key={idx}
                      className="bg-vista-accent h-2 w-2 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: idx * 0.15,
                      }}
                    />
                  ))}
                </div>

                {/* Encouraging Text */}
                <p className="text-vista-accent mt-6 text-center text-xs font-medium">
                  ✨ Creating magic, please wait...
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
