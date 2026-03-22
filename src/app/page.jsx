"use client"

import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, MapControls, PerspectiveCamera, Edges, useCursor, Line } from '@react-three/drei';
import { generateTerrain } from './utils/init';
import { NUM_ROWS, NUM_COLS } from './constants/meta';

const Village = ({ position, size, row, col }) => {
  const [x, y, z] = position;

  return (
    <>
      <mesh
        position={position}
      >
        <boxGeometry args={[size, size, size]} />
        <meshStandardMaterial 
          color={"#C79973"}
        />
      </mesh>
      <mesh
        position={[x, y + 1, z]}
        rotation={[0, 40, 0]}
      >
        <coneGeometry args={[1.2, 1, 4]} />
        <meshStandardMaterial 
          color={"#C79973"}
        />
      </mesh>
      <Line
        points={[
          [2 * row - 3, 1, 2 * col - 3],
          [2 * row - 3, 1, 2 * col + 3],
          [2 * row + 3, 1, 2 * col + 3],
          [2 * row + 3, 1, 2 * col - 3],
          [2 * row - 3, 1, 2 * col - 3],
        ]}
        color="white"
        lineWidth={4}
        dashed={true}
        dashSize={0.3}
        gapSize={0.5}
      />
    </>
  );
}

function Box({ color, size, ...props }) { 
  const [hovered, setHovered] = useState(false); 
  useCursor(hovered);

  const startHover = (e) => {
    e.stopPropagation();
    setHovered(true);
  }

  const endHover = (e) => {
    e.stopPropagation();
    setHovered(false);
  }

  return (
    <mesh
      {...props}
      onPointerEnter={startHover}
      onPointerLeave={endHover}
    >
      <boxGeometry args={[size, size, size]} />
      <meshStandardMaterial 
        color={color}
      />
      {hovered && <Edges
        linewidth={5}
        color="white"
      />}
    </mesh>
  );
}

export default function Home() {
  const [board, setBoard] = useState(
    Array.from({ length: NUM_ROWS }, () =>
      Array.from({ length: NUM_COLS }, () => "#FFFFFF")
    )
  );
  const [features, setFeatures] = useState(
    Array.from({ length: NUM_ROWS }, () =>
      Array.from({ length: NUM_COLS }, () => null)
    )
  );

  const setBoardAndFeatures = () => {
    const { newBoard, newFeatures } = generateTerrain();
    setBoard(newBoard);
    setFeatures(newFeatures);
  }

  useEffect(() => {
    setBoardAndFeatures();
  }, [])

  return (
    <div className="w-[100vw] h-[100vh]">
      <Canvas>
        <PerspectiveCamera
          makeDefault
          position={[27, 15, 27]}
          fov={50}
        />
        <MapControls target={[0, -15, 0]} enableRotate={false} />

        <Box
          position={[20, 2, 20]} 
          color={"#FFFFFF"}
          size={1}
        />

        {features.map((row, rowIndex) =>
          row.map((col, colIndex) => {
            if (!col) return;

            if (col == "Village") {
              return (
                <Village
                  key={`${rowIndex}, ${colIndex}`}
                  position={[2 * rowIndex, 1.5, 2 * colIndex]}
                  size={1}
                  row={rowIndex}
                  col={colIndex}
                />
              );
            }
          })
        )}

        {board.map((row, rowIndex) =>
          row.map((col, colIndex) => (
            <Box 
              key={`${rowIndex}, ${colIndex}`}
              position={[2 * rowIndex, 0, 2 * colIndex]} 
              color={col}
              size={2}
            />
          ))
        )}

        <ambientLight intensity={1} />
        <directionalLight color="white" position={[0, 10, 0]} />
      </Canvas >

      <button className="absolute right-10 bottom-10 cursor-pointer bg-[#000000] rounded-md p-5 text-[#FFFFFF]" onClick={setBoardAndFeatures}>
        Generate Terrain
      </button>
    </div>
  );
}

