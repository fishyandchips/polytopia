"use client"

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

const BOX_SIZE = 2;
const BOARD_SIZE = 11;

function Box({ color, ...props }) {  
  return (
    <mesh
      {...props}
    >
      <boxGeometry args={[BOX_SIZE, BOX_SIZE, BOX_SIZE]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

export default function Home() {
  const grid = Array(BOARD_SIZE).fill(null);

  return (
    <div className="w-[100vw] h-[100vh]">
      <Canvas>
        <OrbitControls />

        {grid.map((_, rowIndex) => 
          grid.map((_, colIndex) => (
            <Box 
              key={`${rowIndex}, ${colIndex}`} 
              position={[BOX_SIZE * rowIndex, 0, BOX_SIZE * colIndex]} 
              color={rowIndex % 2 || colIndex % 2 ? "blue" : "red"}
            />
          ))
        )}

        <ambientLight intensity={0.1} />
        <directionalLight color="white" position={[0, 5, 0]} />
      </Canvas >
    </div>
  );
}

