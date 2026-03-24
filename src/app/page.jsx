"use client"

import { useState, useEffect, Fragment } from 'react';
import { useGame } from "./contexts/useGame";
import { Canvas } from '@react-three/fiber';
import { OrbitControls, MapControls, PerspectiveCamera, Edges, useCursor, Line } from '@react-three/drei';
import { generateTerrain } from './utils/init';
import { NUM_ROWS, NUM_COLS } from './constants/meta';
import { TERRAIN_COLOURS } from './constants/terrain';
import { Warrior } from './utils/troops';
import { WarriorMesh } from './assets/troops';
import { CARDINAL_DIRECTIONS, DIAGONAL_DIRECTIONS } from './constants/directions';
import { Tile, PossibleMoveIndicator } from './assets/ui'; 
import { Village } from './assets/buildings'; 
import { initBoard } from "./utils/init";

export default function Home() {
  const { board, setBoard, troops, setTroops, possibleMoves } = useGame();

  const placeTroop = () => {
    const player = ["A", "B"][Math.floor(Math.random() * 2)];
    const row = Math.floor(Math.random() * NUM_ROWS)
    const col = Math.floor(Math.random() * NUM_COLS);
    const newTroop = new Warrior(player, [row, col]);

    setTroops(prev => [ ...prev, newTroop ]);
  };

  const getTile = (terrain, row, col) => {
    if (!terrain) {
      return;
    }

    return (
      <Tile
        position={[row, col]} 
        terrain={terrain}
      />
    );
  }

  const getFeature = (feature, row, col) => {
    if (!feature) {
      return;
    }

    switch (feature) {
      case "Village":
        return (
          <Village
            position={[row, col]}
          />
        );
        break;
    }
  }

  const getTroop = (troop) => {
    if (!troop) {
      return;
    }

    if (troop instanceof Warrior) {
      return <WarriorMesh troop={troop} />;
    }
  }

  return (
    <div className="w-[100vw] h-[100vh]">
      <Canvas>
        <PerspectiveCamera
          makeDefault
          position={[27, 15, 27]}
          fov={50}
        />
        <MapControls target={[0, -15, 0]} enableRotate={false} />

        {board.map((boardRow, row) => 
          boardRow.map(({ terrain, feature, troop }, col) => {
            return (
              <Fragment key={`${row}, ${col}`}>
                {getTile(terrain, row, col)}
                {getFeature(feature, row, col)}
              </Fragment>
            );
          })
        )}

        {troops.map((troop, i) => {
          return (
            <Fragment key={i}>
              {getTroop(troop)}
            </Fragment>
          );
        })}

        {possibleMoves.map(({ type, row, col }, i) => {
          return (
            <PossibleMoveIndicator
              key={i}
              type={type}
              position={[row, col]}
            />
          );
        })}

        <ambientLight intensity={1} />
        <directionalLight color="white" position={[0, 10, 0]} />
      </Canvas >

      <button className="absolute right-10 bottom-30 cursor-pointer bg-[#000000] rounded-md p-5 text-[#FFFFFF]" onClick={placeTroop}>
        Place Troop
      </button>

      <button className="absolute right-10 bottom-10 cursor-pointer bg-[#000000] rounded-md p-5 text-[#FFFFFF]" onClick={() => setBoard(initBoard)}>
        Generate Terrain
      </button>
    </div>
  );
}

