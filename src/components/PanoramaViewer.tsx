import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Preload } from "@react-three/drei";
import * as THREE from "three";
import { useState, useEffect, useRef } from "react";

interface PanoramaViewerProps {
  imageUrl: string;
  width?: string | number;
  height?: string | number;
  onReady?: () => void;
  useDeviceOrientation?: boolean;
}

function PanoramaScene({ imageUrl, onTextureLoaded }: { imageUrl: string; onTextureLoaded?: () => void }) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const hasCalledOnLoad = useRef(false);

  useEffect(() => {
    hasCalledOnLoad.current = false;
    setLoadError(null);
    
    console.log("Loading panorama texture from:", imageUrl);
    
    // Use images.weserv.nl - reliable image proxy with CORS headers
    const proxyUrl = `https://images.weserv.nl/?url=${encodeURIComponent(imageUrl)}`;
    
    console.log("Using proxy URL:", proxyUrl);
    
    const img = new Image();
    img.crossOrigin = "anonymous";
    
    img.onload = () => {
      console.log("✅ Image loaded, creating texture. Size:", img.width, "x", img.height);
      const tex = new THREE.Texture(img);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.needsUpdate = true;
      setTexture(tex);
      setLoadError(null);
      if (!hasCalledOnLoad.current) {
        hasCalledOnLoad.current = true;
        onTextureLoaded?.();
      }
    };
    
    img.onerror = (err) => {
      console.error("❌ Image load failed:", err);
      setLoadError("Failed to load panoramic image.");
    };
    
    img.src = proxyUrl;
  }, [imageUrl, onTextureLoaded]);

  if (loadError) {
    return (
      <mesh>
        <boxGeometry args={[100, 100, 100]} />
        <meshBasicMaterial color={new THREE.Color(0x333333)} />
      </mesh>
    );
  }

  if (!texture) {
    return null;
  }

  return (
    <mesh>
      <sphereGeometry args={[500, 60, 40]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
}

function DeviceOrientationController() {
  const { camera } = useThree();
  const orientationData = useRef({ alpha: 0, beta: 0, gamma: 0 });
  const initialAlpha = useRef<number | null>(null);
  const hasReceivedEvent = useRef(false);

  useEffect(() => {
    const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
      if (event.alpha === null || event.beta === null || event.gamma === null) {
        console.log("Device orientation event received but values are null");
        return;
      }
      
      if (!hasReceivedEvent.current) {
        console.log("✅ Device orientation working! First event received:", {
          alpha: event.alpha,
          beta: event.beta,
          gamma: event.gamma
        });
        hasReceivedEvent.current = true;
      }
      
      // Store initial alpha as reference
      if (initialAlpha.current === null) {
        initialAlpha.current = event.alpha;
      }
      
      orientationData.current = {
        alpha: event.alpha - (initialAlpha.current || 0),
        beta: event.beta,
        gamma: event.gamma
      };
    };

    const setupOrientationListener = async () => {
      console.log("Setting up device orientation...");
      
      // iOS 13+ requires permission request
      if (typeof DeviceOrientationEvent !== 'undefined' && 
          typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        try {
          console.log("Requesting iOS permission...");
          const permission = await (DeviceOrientationEvent as any).requestPermission();
          console.log("iOS permission result:", permission);
          if (permission === 'granted') {
            window.addEventListener("deviceorientation", handleDeviceOrientation, true);
          }
        } catch (err) {
          console.error("iOS permission error:", err);
        }
      } else {
        // Non-iOS - just add listener directly
        console.log("Non-iOS device, adding listener directly");
        window.addEventListener("deviceorientation", handleDeviceOrientation, true);
        window.addEventListener("deviceorientationabsolute", handleDeviceOrientation as any, true);
      }
    };

    setupOrientationListener();
    
    return () => {
      window.removeEventListener("deviceorientation", handleDeviceOrientation, true);
      window.removeEventListener("deviceorientationabsolute", handleDeviceOrientation as any, true);
    };
  }, []);

  useFrame(() => {
    const { alpha, beta, gamma } = orientationData.current;
    
    // Convert to radians
    const alphaRad = THREE.MathUtils.degToRad(alpha);
    const betaRad = THREE.MathUtils.degToRad(beta);
    const gammaRad = THREE.MathUtils.degToRad(gamma);
    
    // For landscape orientation (phone held horizontally)
    const euler = new THREE.Euler();
    euler.set(betaRad - Math.PI / 2, alphaRad, -gammaRad, 'YXZ');
    camera.quaternion.setFromEuler(euler);
  });

  return null;
}

export function PanoramaViewer({
  imageUrl,
  width = "100%",
  height = "100%",
  onReady,
  useDeviceOrientation = false,
}: PanoramaViewerProps) {
  return (
    <div style={{ width, height, touchAction: "none", position: "relative" }}>
      <Canvas
        camera={{ position: [0, 0, 0.1], fov: 75 }}
        style={{ width: "100%", height: "100%", display: "block" }}
        gl={{ antialias: true }}
      >
        <PanoramaScene imageUrl={imageUrl} onTextureLoaded={onReady} />
        {useDeviceOrientation ? (
          <DeviceOrientationController />
        ) : (
          <OrbitControls
            enableZoom={true}
            enablePan={false}
            enableDamping={true}
            dampingFactor={0.05}
            autoRotate={false}
            rotateSpeed={0.4}
            zoomSpeed={1}
          />
        )}
        <Preload all />
      </Canvas>
    </div>
  );
}
