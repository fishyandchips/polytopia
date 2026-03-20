"use client"

import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, MapControls, PerspectiveCamera } from '@react-three/drei';

const BOX_SIZE = 2;
const NUM_ROWS = 11;
const NUM_COLS = 11;

const TERRAIN_COLOURS = {
Desert: "#FFEE8F",
Grass: "#8FFFA2",
Water: "#8FE1FF",
Ocean: "#7B84DB",
Snow: "#F0FFFE"
};

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

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

export default function Home() {
  const [board, setBoard] = useState(
    Array.from({ length: NUM_ROWS }, () =>
      Array.from({ length: NUM_COLS }, () => "#FFFFFF")
    )
  );

  function generateTerrain() {
    const newBoard = Array.from({ length: NUM_ROWS }, () =>
      Array.from({ length: NUM_COLS }, () => TERRAIN_COLOURS.Ocean)
    );
    const terrainSizes = Object.fromEntries(
      Object.entries(TERRAIN_COLOURS).map(([terrain, _]) => [terrain, Math.floor(Math.random() * 10 + 20)])
    );
    const queue = [];
    const visited = new Set();

    Object.keys(TERRAIN_COLOURS).forEach((terrain) => {
      if (terrain == "Water" || terrain == "Ocean") {
        return;
      }

      let x = Math.floor(Math.random() * NUM_ROWS);
      let y = Math.floor(Math.random() * NUM_COLS);

      while (visited.has([x, y])) {
        x = Math.floor(Math.random() * NUM_ROWS);
        y = Math.floor(Math.random() * NUM_COLS);
      }

      visited.add(JSON.stringify([x, y]));
      queue.push([x, y, terrain]);
    });

    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

    while (queue.length > 0) {
      const [r, c, terrain] = queue.shift();
      newBoard[r][c] = TERRAIN_COLOURS[terrain];
      
      for (const [dr, dc] of shuffle(directions)) {
        const newRow = r + dr;
        const newCol = c + dc;

        if (newRow < 0 || newRow >= NUM_ROWS || newCol < 0 || newCol >= NUM_COLS) {
          continue;
        }

        if (visited.has(JSON.stringify([newRow, newCol]))) {
          continue;
        }

        if (terrainSizes[terrain] == 0) {
          continue;
        }

        visited.add(JSON.stringify([newRow, newCol]));
        queue.push([newRow, newCol, terrain]);
        terrainSizes[terrain]--;
      }
    }

    for (let r = 0; r < NUM_ROWS; r++) {
      for (let c = 0; c < NUM_COLS; c++) {
        if (newBoard[r][c] != TERRAIN_COLOURS.Ocean) {
          continue;
        }

        for (const [dr, dc] of directions) {
          const newRow = r + dr;
          const newCol = c + dc;

          if (newRow < 0 || newRow >= NUM_ROWS || newCol < 0 || newCol >= NUM_COLS) {
            continue;
          }

          if (newBoard[newRow][newCol] != TERRAIN_COLOURS.Water && newBoard[newRow][newCol] != TERRAIN_COLOURS.Ocean) {
            newBoard[r][c] = TERRAIN_COLOURS.Water;
            break;
          }
        }
      }
    }

    setBoard(newBoard);
  }

  return (
    <div className="w-[100vw] h-[100vh]">
      <Canvas
      >
        <PerspectiveCamera
          makeDefault
          position={[27, 15, 27]}
          fov={50}
        />
        <MapControls target={[0, -15, 0]} enableRotate={false} />

        {board.map((row, rowIndex) =>
          row.map((col, colIndex) => (
            <Box 
              key={`${rowIndex}, ${colIndex}`} 
              position={[BOX_SIZE * rowIndex, 0, BOX_SIZE * colIndex]} 
              color={col}
            />
          ))
        )}

        <ambientLight intensity={0.5} />
        <directionalLight color="white" position={[0, 10, 0]} />
      </Canvas >

      <button className="absolute right-10 bottom-10 cursor-pointer bg-[#000000] rounded-md p-5 text-[#FFFFFF]" onClick={generateTerrain}>
        Generate Terrain
      </button>
    </div>
  );
}

