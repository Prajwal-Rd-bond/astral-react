import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

import IntroScreen from "./IntroScreen";
import SolarSystem from "./SolarSystem";
import PlanetInfo from "./PlanetInfo";

// 🎥 Camera Controller (Smooth Follow)
function CameraController({ targetRef }) {
  const { camera } = useThree();

  const defaultPos = new THREE.Vector3(0, 8, 35);
  const defaultLook = new THREE.Vector3(0, 0, 0);

  useFrame(() => {
    if (targetRef?.current) {
      const target = new THREE.Vector3();
      targetRef.current.getWorldPosition(target);

      const offset = new THREE.Vector3(0, 2.5, 6);
      const desired = target.clone().add(offset);

      camera.position.lerp(desired, 0.05);
      camera.lookAt(target);
    } else {
      camera.position.lerp(defaultPos, 0.03);
      camera.lookAt(defaultLook);
    }
  });

  return null;
}

export default function App() {
  const [entered, setEntered] = useState(false);
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [targetRef, setTargetRef] = useState(null);

  const handlePlanetClick = (planet, ref) => {
    setSelectedPlanet(planet);
    setTargetRef(ref);
  };

  const resetView = () => {
    setSelectedPlanet(null);
    setTargetRef(null);
  };

  return (
    <>
      {/* 🌌 INTRO SCREEN with smooth exit */}
      <AnimatePresence mode="wait">
        {!entered && (
          <motion.div
            key="intro"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <IntroScreen onEnter={() => setEntered(true)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🌍 MAIN SOLAR SYSTEM */}
      {entered && (
        <motion.div
          key="scene"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <Canvas
            shadows
            camera={{ position: [0, 8, 35], fov: 60 }}
            style={{
              width: "100vw",
              height: "100vh",
              display: "block",
              background: "#02030a",
            }}
            onPointerMissed={resetView}
          >
            {/* 💡 Lights */}
            <ambientLight intensity={0.25} />
            <pointLight position={[0, 0, 0]} intensity={8} distance={500} decay={0} />
            <directionalLight position={[10, 10, 5]} intensity={1} />

            {/* 🌌 Solar System */}
            <SolarSystem onPlanetClick={handlePlanetClick} />

            {/* 🎥 Camera Follow */}
            <CameraController targetRef={targetRef} />

            {/* 🕹 Controls */}
            <OrbitControls
              maxDistance={150}
              minDistance={4}
              enableDamping
              dampingFactor={0.05}
            />

            {/* ✨ Effects */}
            <EffectComposer>
              <Bloom intensity={1.2} luminanceThreshold={0.25} />
            </EffectComposer>
          </Canvas>

          {/* 🪐 Planet Info Panel */}
          <PlanetInfo planet={selectedPlanet} onClose={resetView} />
        </motion.div>
      )}
    </>
  );
}