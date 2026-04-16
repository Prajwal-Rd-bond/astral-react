import { motion, AnimatePresence } from "framer-motion";
import "./PlanetInfo.css";

// 🌍 Texture imports
import uranusGif from "./assets/textures/uranus.gif";
import mercury from "./assets/textures/mercury.jpg";
import venus from "./assets/textures/venus.jpg";
import earth from "./assets/textures/earth.jpg";
import mars from "./assets/textures/mars.jpg";
import jupiter from "./assets/textures/jupiter.jpg";
import saturn from "./assets/textures/saturn.jpg";
import uranus from "./assets/textures/uranus.jpg";
import neptune from "./assets/textures/neptune.jpg";

// 🗺 Mapping
const planetImages = {
  Mercury: mercury,
  Venus: venus,
  Earth: earth,
  Mars: mars,
  Jupiter: jupiter,
  Saturn: saturn,
  Uranus: uranus,
  Neptune: neptune,
};

export default function PlanetInfo({ planet, onClose }) {
  return (
    <AnimatePresence>
      {planet && (
        <>
          {/* 🌌 Overlay */}
          <motion.div
            className="planet-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* 🌌 LEFT SIDE GIF (ONLY FOR URANUS) */}
          {planet.name === "Uranus" && (
            <motion.div
              className="planet-gif-left"
              initial={{ x: -200, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -200, opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              <img src={uranusGif} alt="Uranus rotation" />
            </motion.div>
          )}

          {/* 🪐 Panel */}
          <motion.div
            className="planet-panel"
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ type: "spring", stiffness: 80 }}
          >
            <h2>{planet.name}</h2>

            {/* 🌍 Image */}
            <div className="image-wrapper">
              <motion.img
                src={planetImages[planet.name]}
                alt={planet.name}
                className="planet-image"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              />
            </div>

            <p className="desc">{planet.description}</p>

            {/* 📊 Extended Info */}
            <div className="info-grid">
              <p><span>Diameter</span>{planet.diameter}</p>
              <p><span>Distance</span>{planet.distance}</p>

              {planet.gravity && (
                <p><span>Gravity</span>{planet.gravity}</p>
              )}

              {planet.dayLength && (
                <p><span>Day Length</span>{planet.dayLength}</p>
              )}

              {planet.yearLength && (
                <p><span>Year Length</span>{planet.yearLength}</p>
              )}

              {planet.temperature && (
                <p><span>Temperature</span>{planet.temperature}</p>
              )}

              {planet.moons && (
                <p><span>Moons</span>{planet.moons}</p>
              )}

              {planet.atmosphere && (
                <p><span>Atmosphere</span>{planet.atmosphere}</p>
              )}
            </div>

            {/* ⭐ Fun Fact */}
            {planet.fact && (
              <div className="fact-box">
                <strong>Fun Fact</strong>
                <p>{planet.fact}</p>
              </div>
            )}

            <button className="close-btn" onClick={onClose}>
              Close
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}