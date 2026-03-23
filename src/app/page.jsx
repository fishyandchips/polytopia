"use client"

import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, MapControls, PerspectiveCamera, Edges, useCursor, Line } from '@react-three/drei';
import { generateTerrain } from './utils/init';
import { NUM_ROWS, NUM_COLS } from './constants/meta';
import { Troop, TROOP_STATS } from './constants/troops';
import { CARDINAL_DIRECTIONS, DIAGONAL_DIRECTIONS } from './constants/directions';

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

const PossibleMoveIndicator = ({ ...props }) => {
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
    <>
      <mesh
        {...props}
        rotation={[30, 0, 0]}
      >
        <circleGeometry args={[0.2]} />
        <meshStandardMaterial 
          color={"#505050"}
        />
      </mesh>

      <mesh
        {...props}
        onPointerEnter={startHover}
        onPointerLeave={endHover}
        rotation={[30, 0, 0]}
      >
        <circleGeometry args={[0.8]} />
        <meshStandardMaterial 
          color={"#505050"}
          transparent={true}
          opacity={hovered ? 0.2 : 0}
        />
      </mesh>
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
  const [troops, setTroops] = useState([]);
  const [possibleMoves, setPossibleMoves] = useState([]);
  const [selected, setSelected] = useState(null);

  const setBoardAndFeatures = () => {
    const { newBoard, newFeatures } = generateTerrain();
    setBoard(newBoard);
    setFeatures(newFeatures);
  }

  const placeTroop = () => {
    setTroops([
      ...troops,
      {
        type: "Warrior",
        row: Math.floor(Math.random() * NUM_ROWS),
        col: Math.floor(Math.random() * NUM_COLS),
      },
    ]);
  };

  const togglePossibleMoves = (type, row, col) => {
    if (possibleMoves.length > 0) {
      setPossibleMoves([]);
      return;
    }
  
    const newPossibleMoves = [];

    const movement = TROOP_STATS[type].movement;
    const queue = []
    const visited = new Set();

    queue.push([row, col, 0]);
    visited.add(JSON.stringify([row, col]));

    while (queue.length > 0) {
      const [r, c, distance] = queue.shift();
      
      for (const [dr, dc] of [...CARDINAL_DIRECTIONS, ...DIAGONAL_DIRECTIONS]) {
        const newRow = r + dr;
        const newCol = c + dc;

        // Out of bounds check
        if (newRow < 0 || newRow >= NUM_ROWS || newCol < 0 || newCol >= NUM_COLS) {
          continue;
        }

        if (visited.has(JSON.stringify([newRow, newCol]))) {
          continue;
        }
        
        visited.add(JSON.stringify([newRow, newCol]));
        if (distance + 1 == movement) {
          newPossibleMoves.push([newRow, newCol]);
          continue;
        } else if (distance + 1 < movement) {
          newPossibleMoves.push([newRow, newCol]);
        } 
        queue.push([newRow, newCol, distance + 1]);
      }
    }

    setPossibleMoves(newPossibleMoves);
  }

  const moveTroop = (row, col) => {
    const newTroops = troops.map((troop) => {
      if (troop.type === selected.type && troop.row === selected.row && troop.col === selected.col) {
        return { ...troop, row: row, col: col };
      }
      return troop;
    })
    setTroops(newTroops);
    setPossibleMoves([]);
    setSelected(null);
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

        {troops.map((troop, i) => {
          const { type, row, col } = troop;
          return (
            <Troop 
              key={i} 
              type={type} 
              position={[2 * row, 2, 2 * col]} 
              onClick={() => { togglePossibleMoves(type, row, col); setSelected(troop); }}
            />
          );
        })}

        {possibleMoves.map(([row, col], i) => {
          return (
            <PossibleMoveIndicator
              key={i}
              position={[2 * row, 1.2, 2 * col]} 
              onClick={() => moveTroop(row, col)}
            />
          );
        })}

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

      <button className="absolute right-10 bottom-30 cursor-pointer bg-[#000000] rounded-md p-5 text-[#FFFFFF]" onClick={placeTroop}>
        Place Troop
      </button>

      <button className="absolute right-10 bottom-10 cursor-pointer bg-[#000000] rounded-md p-5 text-[#FFFFFF]" onClick={setBoardAndFeatures}>
        Generate Terrain
      </button>
    </div>
  );
}

