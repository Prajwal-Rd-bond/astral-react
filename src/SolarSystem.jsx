import { useRef, useMemo } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader, DoubleSide } from "three";
import { Stars } from "@react-three/drei";

// TEXTURES
import mercury from "./assets/textures/mercury.jpg";
import venus from "./assets/textures/venus.jpg";
import earth from "./assets/textures/earth.jpg";
import mars from "./assets/textures/mars.jpg";
import jupiter from "./assets/textures/jupiter.jpg";
import saturn from "./assets/textures/saturn.jpg";
import uranus from "./assets/textures/uranus.jpg";
import neptune from "./assets/textures/neptune.jpg";

import moon from "./assets/textures/moon.jpg";
import sun from "./assets/textures/sun.jpg";
import milkyway from "./assets/textures/milkyway.jpg";

// 🌌 Galaxy Background
function GalaxySky() {
  const galaxyTexture = useLoader(TextureLoader, milkyway);

  return (
    <mesh>
      <sphereGeometry args={[200, 64, 64]} />
      <meshBasicMaterial
        map={galaxyTexture}
        side={DoubleSide}
        toneMapped={false}
      />
    </mesh>
  );
}


// 🪐 Orbit Ring
function OrbitRing({ radius }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius - 0.02, radius + 0.02, 128]} />
      <meshBasicMaterial
        color="#555"
        transparent
        opacity={0.25}
        side={DoubleSide}
      />
    </mesh>
  );
}

// 🌍 Earth + Moon System
function EarthSystem({ distance, size, speed, onPlanetClick, paused }) {
  const orbit = useRef();
  const earthRef = useRef();
  const moonOrbit = useRef();

  const [earthMap, moonMap] = useLoader(TextureLoader, [earth, moon]);

  useFrame((_, delta) => {
    if (paused) return;

    orbit.current.rotation.y += speed * delta;
    earthRef.current.rotation.y += 0.5 * delta;
    moonOrbit.current.rotation.y += 1.2 * delta;
  });

  return (
    <>
      <OrbitRing radius={distance} />

      <group ref={orbit}>
        {/* 🌍 Earth */}
        <group position={[distance, 0, 0]}>
          <mesh
            ref={earthRef}
            onClick={() =>
              onPlanetClick(
                {
                  name: "Earth",
                  description: "The only known planet supporting life.",
                  diameter: "12,742 km",
                  distance: "149.6 million km",
                  fact: "Earth is the third planet from the Sun and the only astronomical object known to harbor life. 70% of its surface is covered in water.Earth, like most other bodies in the Solar System, formed about 4.5 billion years ago from gas and dust in the early Solar System.",
                },
                earthRef
              )
            }
          >
            <sphereGeometry args={[size, 64, 64]} />
            <meshStandardMaterial map={earthMap} />
          </mesh>
        </group>

        {/* 🌙 Moon */}
        <group ref={moonOrbit} position={[distance, 0, 0]}>
          <mesh position={[2, 0, 0]}>
            <sphereGeometry args={[0.27, 32, 32]} />
            <meshStandardMaterial map={moonMap} />
          </mesh>
        </group>
      </group>
    </>
  );
}

// 🌍 Generic Planet
function Planet({
  distance,
  size,
  texture,
  speed,
  onPlanetClick,
  data,
  paused,
}) {
  const orbit = useRef();
  const planetRef = useRef();
  const map = useLoader(TextureLoader, texture);

  useFrame((_, delta) => {
    if (paused) return;

    orbit.current.rotation.y += speed * delta;
    planetRef.current.rotation.y += 0.4 * delta;
  });

  return (
    <>
      <OrbitRing radius={distance} />

      <group ref={orbit}>
        <group position={[distance, 0, 0]}>
          <mesh
            ref={planetRef}
            onClick={() => onPlanetClick(data, planetRef)}
          >
            <sphereGeometry args={[size, 64, 64]} />
            <meshStandardMaterial map={map} />
          </mesh>
        </group>
      </group>
    </>
  );
}

// 🪐 Saturn with realistic rings
function Saturn({ distance, size, speed, onPlanetClick, paused }) {
  const orbit = useRef();
  const planetRef = useRef();
  const map = useLoader(TextureLoader, saturn);

  useFrame((_, delta) => {
    if (paused) return;
    orbit.current.rotation.y += speed * delta;
    planetRef.current.rotation.y += 0.3 * delta;
  });

  return (
    <>
      <OrbitRing radius={distance} />

      <group ref={orbit}>
        <group position={[distance, 0, 0]}>
          <mesh
            ref={planetRef}
            onClick={() =>
              onPlanetClick(
                {
                  name: "Saturn",
                  description: "Famous for its rings.",
                  diameter: "116,460 km",
                  distance: "1.4 billion km",
                  fact: "Saturn is the sixth planet from the Sun and the second largest in the Solar System.It is Less dense than water.The planet has a bright and extensive system of rings, composed mainly of ice particles, with a smaller amount of rocky debris and dust. At least 292 moons orbit the planet, of which 63 are officially named",
                },
                planetRef
              )
            }
          >
            <sphereGeometry args={[size, 64, 64]} />
            <meshStandardMaterial map={map} />
          </mesh>

          {/* Rings */}
          <mesh rotation={[Math.PI / 2.4, 0, 0]}>
            <ringGeometry args={[size + 0.5, size + 1.8, 256]} />
            <meshStandardMaterial
              color="#d2b48c"
              side={DoubleSide}
              transparent
              opacity={0.7}
            />
          </mesh>
        </group>
      </group>
    </>
  );
}

// ☀️ MAIN SYSTEM
export default function SolarSystem({ onPlanetClick, paused }) {
  const sunTexture = useLoader(TextureLoader, sun);

  return (
    <>
      {/* 🌌 Background */}
      <GalaxySky />

      {/* ✨ Optimized Stars */}
      <Stars
        radius={150}
        depth={60}
        count={4000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />

      {/* ☀️ Sun */}
      <mesh>
        <sphereGeometry args={[2.8, 64, 64]} />
        <meshStandardMaterial
          map={sunTexture}
          emissive="#ffaa00"
          emissiveIntensity={2.5}
        />
      </mesh>

      {/* 🪐 PLANETS */}

      <Planet
        distance={4}
        size={0.4}
        texture={mercury}
        speed={1.2}
        paused={paused}
        onPlanetClick={onPlanetClick}
        data={{
          name: "Mercury",
          description: "Closest to the Sun.",
          diameter: "4,879 km",
          distance: "57.9 million km",
          fact: "Mercury is the first planet from the Sun and the smallest in the Solar System. A year on Mercury lasts 88 Earth days.Its largest crater, Caloris Planitia, has a diameter of 1,550 km (960 mi), which is about one-third the diameter of the planet (4,880 km or 3,030 mi).",
        }}
      />

      <Planet
        distance={5.5}
        size={0.7}
        texture={venus}
        speed={0.8}
        paused={paused}
        onPlanetClick={onPlanetClick}
        data={{
          name: "Venus",
          description: "Hottest planet.",
          diameter: "12,104 km",
          distance: "108.2 million km",
          fact: "Venus has no liquid water, and its atmosphere is far thicker and denser than that of any other rocky body in the Solar System.Spins backward.a Venusian day is 116.75 Earth days long, about half a Venusian solar year, which is 224.7 Earth days long.",
        }}
      />

      <EarthSystem
        distance={7}
        size={1}
        speed={0.6}
        paused={paused}
        onPlanetClick={onPlanetClick}
      />

      <Planet
        distance={10}
        size={0.8}
        texture={mars}
        speed={0.32}
        paused={paused}
        onPlanetClick={onPlanetClick}
        data={{
          name: "Mars",
          description: "The Red Planet.",
          diameter: "6,779 km",
          distance: "227.9 million km",
          fact: "Mars is a desert-like rocky planet with a tenuous atmosphere that is primarily carbon dioxide (CO2). It has the largest volcano in the Solar System, Olympus Mons.",
        }}
      />

      <Planet
        distance={14}
        size={1.8}
        texture={jupiter}
        speed={0.05}
        paused={paused}
        onPlanetClick={onPlanetClick}
        data={{
          name: "Jupiter",
          description: "Largest planet.",
          diameter: "139,820 km",
          distance: "778.5 million km",
          fact: "Jupiter is the fifth planet from the Sun, and the largest in the Solar System.It is a gas giant with a mass nearly 2.5 times that of all the other planets in the Solar System combined and slightly less than one-thousandth the mass of the Sun.Great Red Spot storm.The outer atmosphere is divided into a series of latitudinal bands, with turbulence and storms along their interacting boundaries; the most obvious result of this is the Great Red Spot, a giant storm that has been recorded since 1831.",
        }}
      />

      <Saturn
        distance={19}
        size={1.5}
        speed={0.02}
        paused={paused}
        onPlanetClick={onPlanetClick}
      />

      <Planet
        distance={23}
        size={1.2}
        texture={uranus}
        speed={0.01}
        paused={paused}
        onPlanetClick={onPlanetClick}
        data={{
          name: "Uranus",
          description: "Tilted planet.",
          diameter: "50,724 km",
          distance: "2.9 billion km",
          fact: "Uranus is the seventh planet from the Sun. It is a gaseous cyan-coloured ice giant.Rotates sideways.Most of the planet is made of water, ammonia, and methane in a supercritical phase of matter, which astronomy calls ice or volatiles",
        }}
      />

      <Planet
        distance={27}
        size={1.2}
        texture={neptune}
        speed={0.006}
        paused={paused}
        onPlanetClick={onPlanetClick}
        data={{
          name: "Neptune",
          description: "Farthest planet.",
          diameter: "49,244 km",
          distance: "4.5 billion km",
          fact: "Neptune is the eighth and farthest known planet orbiting the Sun. It has the fastest winds in the Solar System, reaching speeds of up to 2,100 km/h. It is 17 times the mass of Earth. It is named after the Roman god of the sea and has the astronomical symbol ♆, representing Neptune's trident.",
        }}
      />
    </>
  );
}