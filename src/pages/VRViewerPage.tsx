import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, RotateCcw } from "lucide-react";
import { type Property } from "../types/property";
import { useState, useEffect } from "react";
import { PanoramaViewer } from "../components/PanoramaViewer";

const isMobileDevice = () => /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

export default function VRViewerPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [property] = useState<Property | null>(
    location.state?.property || null
  );
  const [showUI, setShowUI] = useState(true);
  const [uiTimeout, setUiTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPortrait, setIsPortrait] = useState(false);
  const [orientationPermission, setOrientationPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');

  // Lock to landscape on mobile and detect orientation
  useEffect(() => {
    if (isMobileDevice()) {
      // Try to lock screen orientation to landscape
      const lockOrientation = async () => {
        try {
          const orientation = screen.orientation as any;
          if (orientation && orientation.lock) {
            await orientation.lock('landscape');
            console.log('Screen locked to landscape');
          }
        } catch (err) {
          console.log('Could not lock orientation:', err);
        }
      };
      lockOrientation();

      // Check current orientation
      const checkOrientation = () => {
        setIsPortrait(window.innerHeight > window.innerWidth);
      };
      checkOrientation();
      window.addEventListener('resize', checkOrientation);
      window.addEventListener('orientationchange', checkOrientation);

      return () => {
        // Unlock orientation when leaving
        const orientation = screen.orientation as any;
        if (orientation && orientation.unlock) {
          orientation.unlock();
        }
        window.removeEventListener('resize', checkOrientation);
        window.removeEventListener('orientationchange', checkOrientation);
      };
    }
  }, []);

  // Request device orientation permission (iOS 13+)
  const requestOrientationPermission = async () => {
    console.log("Requesting orientation permission...");
    
    if (typeof DeviceOrientationEvent !== 'undefined' && 
        typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        console.log("iOS detected, requesting permission...");
        const permission = await (DeviceOrientationEvent as any).requestPermission();
        console.log("Permission result:", permission);
        setOrientationPermission(permission);
      } catch (err) {
        console.error('Orientation permission error:', err);
        setOrientationPermission('denied');
      }
    } else {
      // Non-iOS devices (Android) don't need permission
      console.log("Non-iOS device, granting permission automatically");
      setOrientationPermission('granted');
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
      <div className="bg-vista-bg min-h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-vista-primary text-2xl font-bold mb-2">
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

  // Extract panoramic images from the images array (API)
  const extractedPanoramicImages = (property.images || [])
    .filter((img: any) => img.imageType === "panoramic")
    .map((img: any) => ({
      url: img.url,
      title: img.filename || "Panoramic View",
      description: ""
    }));

  // Use extracted panoramic images if available, otherwise use the panoramicImages array (backward compatibility)
  const panoramicImages = extractedPanoramicImages.length > 0 ? extractedPanoramicImages : (property.panoramicImages || []);

  // Debug: Log the panoramic images
  console.log("Panoramic images:", panoramicImages);
  if (panoramicImages.length > 0) {
    console.log("Current image URL:", panoramicImages[currentImageIndex].url);
  }

  return (
    <div className="bg-black w-screen h-screen overflow-hidden fixed top-0 left-0">
      {/* Portrait Mode Warning for Mobile */}
      {isMobileDevice() && isPortrait && (
        <div className="absolute inset-0 z-50 bg-black/95 flex flex-col items-center justify-center text-white p-8">
          <RotateCcw size={64} className="mb-6 animate-pulse" />
          <h2 className="text-2xl font-bold mb-2 text-center">Rotate Your Device</h2>
          <p className="text-white/70 text-center mb-6">Please rotate your phone to landscape mode for the best VR experience</p>
        </div>
      )}

      {/* iOS Permission Request */}
      {isMobileDevice() && orientationPermission === 'prompt' && !isPortrait && (
        <div className="absolute inset-0 z-50 bg-black/90 flex flex-col items-center justify-center text-white p-8">
          <h2 className="text-2xl font-bold mb-4 text-center">Enable Motion Controls</h2>
          <p className="text-white/70 text-center mb-6">Allow device motion to look around by moving your phone</p>
          <button
            onClick={requestOrientationPermission}
            className="px-6 py-3 bg-vista-accent text-white rounded-lg font-semibold hover:bg-vista-accent/80 transition-colors"
          >
            Enable Motion Controls
          </button>
          <button
            onClick={() => setOrientationPermission('denied')}
            className="mt-4 text-white/50 hover:text-white/70 transition-colors"
          >
            Skip (use touch instead)
          </button>
        </div>
      )}

      {/* Three.js 360 Panorama Viewer - Fullscreen */}
      {panoramicImages.length > 0 && (
        <PanoramaViewer 
          imageUrl={panoramicImages[currentImageIndex].url}
          width="100%"
          height="100%"
          useDeviceOrientation={isMobileDevice() && orientationPermission === 'granted'}
        />
      )}
      {panoramicImages.length === 0 && (
        <div className="flex items-center justify-center w-full h-full text-white">
          <p>No panoramic images available</p>
        </div>
      )}

      {/* Header Overlay - Auto-hide */}
      <div
        className={`absolute top-0 left-0 right-0 z-20 bg-linear-to-b from-black/80 to-transparent transition-opacity duration-300 ${
          showUI ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ChevronLeft size={24} className="text-white" />
            </button>
            <div>
              <h1 className="text-white text-xl font-bold">
                {property.name} - VR Experience
              </h1>
              <p className="text-white/70 text-sm">
                {panoramicImages.length} panoramic view
                {panoramicImages.length !== 1 ? "s" : ""} available
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Panoramic Views List - Bottom Overlay - Auto-hide */}
      {panoramicImages.length > 1 && (
        <div
          className={`absolute bottom-0 left-0 right-0 z-20 bg-linear-to-t from-black/90 to-transparent p-6 transition-opacity duration-300 ${
            showUI ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="max-w-7xl mx-auto">
            <h2 className="text-white text-lg font-bold mb-4">
              Other Panoramic Views
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {panoramicImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentImageIndex(index);
                  }}
                  className="group relative rounded-lg overflow-hidden border-2 border-white/20 hover:border-vista-accent transition-all shrink-0"
                >
                  <div className="w-24 h-24 overflow-hidden">
                    <img
                      src={image.url}
                      alt={image.title || `Panoramic View ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end justify-center pb-1">
                    <p className="text-white text-xs font-medium text-center px-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {image.title || `View ${index + 1}`}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
