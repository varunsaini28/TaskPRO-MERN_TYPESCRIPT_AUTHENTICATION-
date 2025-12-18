import React, { useRef, useState } from 'react';
import { FaCirclePlus } from "react-icons/fa6";
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface TaskaddProps {
  onClick: () => void;
}

// Three.js Particle System
function FloatingParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const [points] = useState(() => {
    const positions = new Float32Array(1500);
    for (let i = 0; i < 1500; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return new THREE.BufferAttribute(positions, 3);
  });

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.x = state.clock.getElapsedTime() * 0.05;
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
      pointsRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.2;
    }
  });

  return (
    <Points ref={pointsRef} positions={points}>
      <PointMaterial
        transparent
        color="#4F46E5"
        size={0.05}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.6}
      />
    </Points>
  );
}

function AnimatedLines() {
  const linesRef = useRef<THREE.LineSegments>(null);
  const [geometry] = useState(() => {
    const points = [];
    for (let i = 0; i < 50; i++) {
      points.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 8
        )
      );
    }
    return new THREE.BufferGeometry().setFromPoints(points);
  });

  useFrame((state) => {
    if (linesRef.current) {
      linesRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.1;
      linesRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
    }
  });

  return (
    <lineSegments ref={linesRef} geometry={geometry}>
      <lineBasicMaterial color="#818CF8" linewidth={1} />
    </lineSegments>
  );
}

const Taskadd: React.FC<TaskaddProps> = ({ onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="w-full relative overflow-hidden rounded-2xl">
      {/* Three.js Canvas Background */}
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 75 }}
          style={{ background: 'transparent' }}
        >
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <FloatingParticles />
          <AnimatedLines />
        </Canvas>
      </div>

      {/* Content */}
      <div
        className={`
          bg-gradient-to-br from-white/90 to-gray-50/90 backdrop-blur-sm
          min-h-[350px] w-full
          border-2 border-dashed border-gray-400 rounded-2xl
          flex items-center justify-center
          hover:border-purple-500 hover:from-white/95 hover:to-purple-50/80
          transition-all duration-500 cursor-pointer
          relative z-10
        `}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative group inline-block">
          <div className="relative">
            {/* Pulsing ring effect */}
            {isHovered && (
              <>
                <div className="absolute inset-0 animate-ping bg-purple-300 rounded-full opacity-20"></div>
                <div className="absolute inset-0 animate-pulse bg-purple-200 rounded-full opacity-30"></div>
              </>
            )}
            
            <FaCirclePlus
              className={`
                relative text-purple-400 text-5xl
                p-2 rounded-full
                group-hover:text-purple-600
                transition-all duration-300
                ${isHovered ? 'scale-110' : 'scale-100'}
              `}
            />
          </div>

          <span
            className="
              absolute bottom-full left-1/2 -translate-x-1/2 mb-3
              whitespace-nowrap
              bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm px-4 py-2 rounded-lg
              opacity-0 group-hover:opacity-100
              transition-all duration-300 ease-out
              pointer-events-none
              shadow-lg
            "
          >
            <span className="flex items-center gap-2">
              <FaCirclePlus className="text-sm" />
              Click to Add Task
            </span>
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-purple-600"></div>
          </span>
        </div>
      </div>

      {/* Floating text animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {isHovered && (
          <div className="absolute inset-0">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute text-purple-300/20 text-lg font-bold animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${i * 0.5}s`,
                }}
              >
                +
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Taskadd;