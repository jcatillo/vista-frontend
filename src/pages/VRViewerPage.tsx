import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, RotateCcw, Mic, Menu, X } from "lucide-react";
import { type Property } from "../types/property";
import { useState, useEffect } from "react";
import { PanoramaViewer } from "../components/PanoramaViewer";
import { useRef } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

const isMobileDevice = () =>
  /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

export default function VRViewerPage() {
  const navigate = useNavigate();
  const location = useLocation();
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
  const [orientationPermission, setOrientationPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [voiceCommandActive, setVoiceCommandActive] = useState(false);
  const [voiceInitError, setVoiceInitError] = useState<string | null>(null);
  const [lastDetection, setLastDetection] = useState<string | null>(null);
  const [voiceStatus, setVoiceStatus] = useState<string>('idle');
  const [navMode, setNavMode] = useState(false);
  const [inputMode, setInputMode] = useState<'voice' | 'typing' | null>(null);
  const [typedCommand, setTypedCommand] = useState<string>('');
  const [showGalleryMenu, setShowGalleryMenu] = useState(false);
  
  // React Speech Recognition hook
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
  const recognitionRef = useRef<any>(null);
  const voiceTriggerTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const silenceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [liveTranscript, setLiveTranscript] = useState<string>('');

  // Extract panoramic images early (needed for voice commands and rendering)
  const extractedPanoramicImages = (property?.images || [])
    .filter((img: any) => img.imageType === "panoramic")
    .map((img: any) => ({
      url: img.url,
      title: img.filename || "Panoramic View",
      description: ""
    }));
  const panoramicImages = extractedPanoramicImages.length > 0 ? extractedPanoramicImages : (property?.panoramicImages || []);

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

  // Detect Web Speech API support (Chrome)
  useEffect(() => {
    if (browserSupportsSpeechRecognition) {
      // Get the actual recognition instance from react-speech-recognition
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = SpeechRecognition.getRecognition?.() || null;
      }
    }
  }, [browserSupportsSpeechRecognition]);

  // Clear interim and reset navMode when listening stops
  useEffect(() => {
    if (!listening && (navMode || liveTranscript)) {
      console.log('🎤 Listening stopped - clearing interim and resetting navMode');
      setLiveTranscript('');
      setNavMode(false);
    }
  }, [listening, navMode, liveTranscript]);

  // Process transcript from react-speech-recognition
  useEffect(() => {
    if (!transcript.trim()) return;

    const text = transcript.toLowerCase().trim();
    console.log('📝 Transcript received:', text);

    // Clear any existing silence timeout
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
    }

    if (listening) {
      const heyEchoIndex = text.indexOf('hey echo');
      
      // Only process if "hey echo" is found in the transcript
      if (heyEchoIndex !== -1) {
        // Extract only the part from "hey echo" onwards
        const capturedText = text.substring(heyEchoIndex);
        console.log('🎤 Captured from "hey echo":', capturedText);
        console.log('🎤 Storing in liveTranscript:', capturedText);
        
        // Check for exit navigate command
        if (capturedText.includes('exit navigate')) {
          setNavMode(false);
          setLiveTranscript('');
          console.log('🎤 "exit navigate" detected - closing navigation panel and clearing interim');
        } else {
          // Check if "navigate" is in the captured text
          const hasNavigate = capturedText.includes('navigate');
          if (hasNavigate && !navMode) {
            setNavMode(true);
            setLiveTranscript('');
            console.log('🎤 "navigate" detected - showing navigation panel and clearing interim');
          } else {
            // Regular "hey echo" with other text - show interim
            setLiveTranscript(capturedText);
          }
        }
        
        // Clear previous silence timeout and set new one
        if (silenceTimeoutRef.current) {
          clearTimeout(silenceTimeoutRef.current);
        }
        
        // Set timeout to clear interim and handle 5 seconds of silence
        silenceTimeoutRef.current = setTimeout(() => {
          const hasNavigate = capturedText.includes('navigate');
          const hasExitNavigate = capturedText.includes('exit navigate');
          
          setLiveTranscript('');
          setNavMode(false);
          resetTranscript();
          
          // If it's a regular "hey echo" command (not navigate/exit navigate), navigate to properties page
          if (!hasNavigate && !hasExitNavigate) {
            console.log('🎤 5s silence - navigating to properties page');
            navigate('/seller/properties');
          } else {
            console.log('🎤 5s silence timeout - clearing captions and interim');
          }
        }, 5000);
      } else {
        // "hey echo" not found, clear display and exit nav mode
        if (navMode) {
          console.log('🎤 Speech without "hey echo" - resetting');
          setLiveTranscript('');
          setNavMode(false);
        }
      }
    } else {
      // Final result when listening stops
      if (navMode) {
        const heyEchoIndex = text.indexOf('hey echo');
        if (heyEchoIndex !== -1) {
          const capturedText = text.substring(heyEchoIndex);
          const hasNavigate = capturedText.includes('navigate');
          const chosen = parseSpokenNumber(capturedText);
          
          if (hasNavigate && chosen !== null && chosen >= 1 && chosen <= panoramicImages.length) {
            // Valid navigation command
            setCurrentImageIndex(chosen - 1);
            setLastDetection(`navigate to ${chosen} @ ${new Date().toLocaleTimeString()}`);
            setNavMode(false);
            setVoiceCommandActive(false);
            setVoiceStatus('speech listening');
            setLiveTranscript('');
          } else {
            // Started with "hey echo" but no valid navigate command
            setLiveTranscript(capturedText);
            setLastDetection(`heard: ${capturedText}`);
          }
        } else {
          // Was in nav mode but final result doesn't contain "hey echo"
          setLiveTranscript('');
          setNavMode(false);
        }
      } else {
        setLiveTranscript('');
      }
      resetTranscript();
    }
  }, [transcript, listening, navMode, panoramicImages.length]);

  // Web Speech API: listen for "hey echo"
  const startSpeechRecognition = async () => {
    if (!browserSupportsSpeechRecognition) return;
    try {
      await SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
      setVoiceStatus('speech listening');
      setVoiceInitError(null);
    } catch (err: any) {
      console.error('SpeechRecognition start failed', err);
      setVoiceInitError(err?.message || 'SpeechRecognition start failed');
      setVoiceStatus('speech error');
    }
  };

  // Cleanup speech recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        try { recognitionRef.current.stop(); } catch (_) { /* noop */ }
        recognitionRef.current = null;
      }
      if (voiceTriggerTimeoutRef.current) {
        clearTimeout(voiceTriggerTimeoutRef.current);
      }
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
    };
  }, []);

  // Ensure full screen without scrolling
  useEffect(() => {
    document.documentElement.style.margin = '0';
    document.documentElement.style.padding = '0';
    document.documentElement.style.width = '100%';
    document.documentElement.style.height = '100vh';
    document.documentElement.style.overflow = 'hidden';
    
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.width = '100%';
    document.body.style.height = '100vh';
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.touchAction = 'none';

    return () => {
      document.documentElement.style.overflow = 'auto';
      document.body.style.overflow = 'auto';
      document.body.style.position = 'relative';
      document.body.style.touchAction = 'auto';
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
        if (permission === 'granted') {
          setInputMode('voice');
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

  // Debug: Log the panoramic images
  console.log("Panoramic images:", panoramicImages);
  if (panoramicImages.length > 0) {
    console.log("Current image URL:", panoramicImages[currentImageIndex].url);
  }

  const voiceActive = listening;

  return (
    <div className="bg-black w-screen h-screen overflow-hidden fixed top-0 left-0">
      {/** Combined voice active state for Porcupine or Web Speech */}
      {/** Decide active state before JSX to reduce duplication */}

      {/* Input Mode Selection - Show on first visit (desktop only) */}
      {!isMobile && inputMode === null && (
        <div className="absolute inset-0 z-50 bg-black/95 flex flex-col items-center justify-center text-white p-8">
          <h2 className="text-3xl font-bold mb-4 text-center">Choose Input Method</h2>
          <p className="text-white/70 text-center mb-8">How would you like to navigate?</p>
          <div className="flex gap-6">
            <button
              onClick={() => setInputMode('voice')}
              className="px-8 py-4 bg-vista-accent text-black rounded-lg font-semibold hover:bg-vista-accent/80 transition-colors"
            >
              🎤 Voice Commands (Echo)
            </button>
            <button
              onClick={() => setInputMode('typing')}
              className="px-8 py-4 bg-white/20 text-white rounded-lg font-semibold hover:bg-white/30 transition-colors"
            >
              ⌨️ Type Commands
            </button>
          </div>
        </div>
      )}

      {/* Desktop Input Mode Toggle - Show voice mode indicator only */}
      {!isMobile && inputMode === 'voice' && false && (
        <div className="absolute top-2 right-2 z-30">
          <button
            onClick={() => setInputMode('typing')}
            className="bg-vista-accent text-black px-3 py-1 rounded-full text-xs font-semibold hover:opacity-90"
          >
            🎤 Voice
          </button>
        </div>
      )}

      {/* Mobile/Desktop Hamburger Menu Button (All modes) */}
      {inputMode !== null && (
        <div className={`absolute ${isMobile ? 'top-2 right-2' : 'top-2 right-2'} z-30`}>
          <button
            onClick={() => setShowGalleryMenu(!showGalleryMenu)}
            className="bg-vista-accent text-black p-2 rounded-lg hover:opacity-90"
          >
            {showGalleryMenu ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      )}
      {typeof window !== 'undefined' && (!isMobile || (orientationPermission === 'granted' && !isPortrait)) && browserSupportsSpeechRecognition && !voiceActive && !(window.isSecureContext || window.location.hostname === 'localhost') && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-30 bg-amber-600/90 text-white rounded-full px-4 py-2 text-sm shadow">
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

      {/* iOS Permission Request */}
      {isMobileDevice() && orientationPermission === 'prompt' && !isPortrait && (
        <div className="absolute inset-0 z-50 bg-black/90 flex flex-col items-center justify-center text-white p-8">
          <h2 className="text-2xl font-bold mb-4 text-center">Enable Motion Controls</h2>
          <p className="text-white/70 text-center mb-6">Allow device motion to look around by moving your phone</p>
          <p className="text-white/50 text-sm text-center mb-4">✨ Say "Hey Echo" to navigate to next view hands-free</p>
          <button
            onClick={requestOrientationPermission}
            className="px-6 py-3 bg-vista-accent text-white rounded-lg font-semibold hover:bg-vista-accent/80 transition-colors"
          >
            Enable Motion Controls
          </button>
          <button
            onClick={() => {
              setOrientationPermission('denied');
              setInputMode('typing');
            }}
            className="mt-4 text-white/50 hover:text-white/70 transition-colors"
          >
            Skip (use touch instead)
          </button>
        </div>
      )}

      {/* Voice Command Indicator - Only show in voice mode */}
      {voiceActive && inputMode === 'voice' && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-30 bg-black/70 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-2">
          <Mic size={12} className={`text-vista-accent ${voiceCommandActive ? 'animate-pulse' : ''}`} />
          <span className="text-white text-xs">Voice commands active</span>
        </div>
      )}

      {/* Live Captions - Only show in voice mode */}
      {voiceActive && inputMode === 'voice' && liveTranscript && (
        <div className="absolute bottom-20 left-0 right-0 z-30 flex justify-center px-2 md:px-4">
          <div className="bg-black/90 backdrop-blur-sm text-white text-sm md:text-base px-3 md:px-4 py-2 md:py-3 rounded-lg md:rounded-xl shadow-lg max-w-2xl w-full text-center border border-white/10">
            <span className="font-medium">
              {liveTranscript}
            </span>
          </div>
        </div>
      )}

      {/* Typing Input - Show in typing mode */}
      {inputMode === 'typing' && (
        <div className="absolute bottom-20 md:bottom-8 left-0 right-0 z-30 flex justify-center px-3 md:px-4">
          <div className="w-full max-w-lg flex gap-2">
            <input
              type="text"
              value={typedCommand}
              onChange={(e) => setTypedCommand(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const cmd = typedCommand.toLowerCase().trim();
                  if (cmd.includes('navigate')) {
                    setNavMode(true);
                    setTypedCommand('');
                  } else if (cmd.includes('exit navigate')) {
                    setNavMode(false);
                    setTypedCommand('');
                  } else {
                    // Handle number navigation
                    const num = parseInt(cmd);
                    if (!isNaN(num) && num >= 1 && num <= panoramicImages.length) {
                      setCurrentImageIndex(num - 1);
                      setLastDetection(`navigate to ${num}`);
                      setTypedCommand('');
                    }
                  }
                }
              }}
              placeholder="Say 'navigate' or a number..."
              className="flex-1 bg-black/80 text-white px-3 py-2 rounded-lg border border-white/20 text-xs md:text-sm focus:outline-none focus:border-vista-accent"
            />
            <button
              onClick={() => {
                const cmd = typedCommand.toLowerCase().trim();
                if (cmd.includes('navigate')) {
                  setNavMode(true);
                  setTypedCommand('');
                } else if (cmd.includes('exit navigate')) {
                  setNavMode(false);
                  setTypedCommand('');
                }
              }}
              className="bg-vista-accent text-black px-2 md:px-3 py-2 rounded-lg font-semibold hover:opacity-90 text-xs md:text-sm whitespace-nowrap"
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* Navigation modal when in navigate mode */}
      {navMode && panoramicImages.length > 1 && (
        <div className="absolute inset-0 z-40 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f172a]/95 border border-white/10 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[70vh] overflow-hidden flex flex-col">
            <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
              <div className="text-white font-semibold">Say a number to switch views</div>
              <div className="text-white/60 text-xs">{panoramicImages.length} available</div>
            </div>
            <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-3 overflow-y-auto">
              {panoramicImages.map((image, idx) => (
                <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-3 flex gap-3 items-center">
                  <div className="w-9 h-9 rounded-full bg-vista-accent text-black text-sm font-bold flex items-center justify-center">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-semibold truncate">{image.title || `View ${idx + 1}`}</div>
                    <div className="text-white/50 text-xs truncate">Say "{idx + 1}" to jump</div>
                  </div>
                  <div className="w-16 h-12 overflow-hidden rounded-lg border border-white/10 bg-black/40">
                    <img src={image.url} alt={image.title || `View ${idx + 1}`} className="w-full h-full object-cover" />
                  </div>
                </div>
              ))}
            </div>
            <div className="px-4 py-3 border-t border-white/10 text-white/60 text-xs">
              Say "Hey Echo, Navigate" then a number (1-{panoramicImages.length}) to select
            </div>
          </div>
        </div>
      )}

      {/* CTA: Tap to enable voice (requests mic permission and starts listening) */}
      { browserSupportsSpeechRecognition && inputMode === 'voice' && !voiceActive && (!isMobile || (orientationPermission === 'granted' && !isPortrait)) && (
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
          <button
            className="bg-vista-accent text-black font-medium rounded-full px-5 py-2 shadow hover:opacity-90 active:opacity-80 cursor-pointer"
            onClick={async () => {
              try {
                if (!(window.isSecureContext || window.location.hostname === 'localhost')) {
                  setVoiceInitError('Microphone requires HTTPS or localhost');
                  return;
                }
                if (!navigator.mediaDevices?.getUserMedia) {
                  setVoiceInitError('Microphone API not available');
                  return;
                }
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                stream.getTracks().forEach(t => t.stop());
                const AC: any = (window as any).AudioContext || (window as any).webkitAudioContext;
                if (AC) {
                  const ctx = new AC();
                  if (ctx.state === 'suspended') {
                    await ctx.resume();
                  }
                  await ctx.close();
                }
                startSpeechRecognition();
              } catch (err: any) {
                console.error('Mic/voice start failed', err);
                setVoiceInitError(err?.message || 'Microphone permission denied');
                setVoiceStatus('start failed');
              }
            }}
          >
            Tap to enable voice
          </button>
        </div>
      )}

      {/* Voice debug status */}
      {browserSupportsSpeechRecognition && false && (
        <div className="absolute bottom-6 left-4 z-30 text-xs text-white/70 bg-black/50 px-3 py-2 rounded-md space-y-1">
          <div>Voice: {voiceStatus}</div>
          <div>Listening: {String(voiceActive)}</div>
          <div>Last: {lastDetection || '—'}</div>
          {voiceInitError && <div className="text-red-300">Error: {voiceInitError}</div>}
        </div>
      )}

      {/* Three.js 360 Panorama Viewer - Fullscreen */}
      {panoramicImages.length > 0 && (
        <PanoramaViewer
          imageUrl={panoramicImages[currentImageIndex].url}
          width="100%"
          height="100%"
          useDeviceOrientation={isMobileDevice() && orientationPermission === 'granted'}
          vrMode={true}
        />
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
            <p className="text-xs md:text-sm font-semibold text-white/80">
              {panoramicImages[currentImageIndex].title || "Unlabeled Room"}
            </p>
          </div>
        </div>
      )}

      {/* Panoramic Views List - Bottom Overlay - Auto-hide */}
      {panoramicImages.length > 1 && !inputMode && (
        <div
          className={`absolute bottom-12 md:bottom-0 left-0 right-0 z-20 bg-linear-to-t from-black/90 to-transparent p-2 md:p-6 transition-opacity duration-300 ${
            showUI ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="max-w-7xl mx-auto px-1">
            <h2 className="text-white text-sm md:text-lg font-bold mb-2 md:mb-4">
              Other Panoramic Views
            </h2>
            <div className="flex gap-1 md:gap-2 overflow-x-auto pb-2">
              {panoramicImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentImageIndex(index);
                  }}
                  className="group hover:border-vista-accent relative shrink-0 overflow-hidden rounded-lg border-2 border-white/20 transition-all"
                >
                  <div className="w-12 h-12 md:w-24 md:h-24 overflow-hidden">
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
        <div className={`absolute ${isMobile ? 'top-14 right-2' : 'top-14 right-2'} z-30 bg-[#0f172a]/95 border border-white/10 rounded-xl shadow-2xl max-h-96 overflow-y-auto w-64`}>
          <div className="p-3 border-b border-white/10">
            <h3 className="text-white font-semibold text-sm">Panoramic Views</h3>
          </div>
          <div className="p-2 space-y-1">
            {panoramicImages.map((image, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentImageIndex(idx);
                  setShowGalleryMenu(false);
                }}
                className="w-full text-left flex gap-3 items-center p-2 hover:bg-white/10 rounded-lg transition-colors group"
              >
                <div className="w-12 h-10 rounded-lg overflow-hidden border border-white/10 flex-shrink-0">
                  <img
                    src={image.url}
                    alt={image.title || `View ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm font-medium truncate">{image.title || `View ${idx + 1}`}</div>
                  <div className="text-white/50 text-xs">Say or type "{idx + 1}"</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
