import { useState } from "react";
import { Line } from '@react-three/drei';
import { TILE_SIZE } from "~/app/constants/meta";

export const Village = ({ position }) => {
  const [row, col] = position;

  return (
    <>
      <mesh
        position={[TILE_SIZE * row + TILE_SIZE / 5, TILE_SIZE / 2 + TILE_SIZE / 8, TILE_SIZE * col + TILE_SIZE / 5]}
      >
        <boxGeometry args={[TILE_SIZE / 4, TILE_SIZE / 4, TILE_SIZE / 4]} />
        <meshStandardMaterial 
          color={"#C79973"}
        />
      </mesh>
      <mesh
        position={[TILE_SIZE * row + TILE_SIZE / 5, TILE_SIZE / 2 + TILE_SIZE / 3, TILE_SIZE * col + TILE_SIZE / 5]}
        rotation={[0, 40, 0]}
      >
        <coneGeometry args={[TILE_SIZE / 4 + TILE_SIZE / 20, TILE_SIZE / 4, 4]} />
        <meshStandardMaterial 
          color={"#C79973"}
        />
      </mesh>

      <mesh
        position={[TILE_SIZE * row - TILE_SIZE / 5, TILE_SIZE / 2 + TILE_SIZE / 8, TILE_SIZE * col]}
      >
        <boxGeometry args={[TILE_SIZE / 4, TILE_SIZE / 4, TILE_SIZE / 4]} />
        <meshStandardMaterial 
          color={"#C79973"}
        />
      </mesh>
      <mesh
        position={[TILE_SIZE * row - TILE_SIZE / 5, TILE_SIZE / 2 + TILE_SIZE / 3, TILE_SIZE * col]}
        rotation={[0, 40, 0]}
      >
        <coneGeometry args={[TILE_SIZE / 4 + TILE_SIZE / 20, TILE_SIZE / 4, 4]} />
        <meshStandardMaterial 
          color={"#C79973"}
        />
      </mesh>

      <mesh
        position={[TILE_SIZE * row + TILE_SIZE / 5, TILE_SIZE / 2 + TILE_SIZE / 8, TILE_SIZE * col - TILE_SIZE / 5]}
      >
        <boxGeometry args={[TILE_SIZE / 4, TILE_SIZE / 4, TILE_SIZE / 4]} />
        <meshStandardMaterial 
          color={"#C79973"}
        />
      </mesh>
      <mesh
        position={[TILE_SIZE * row + TILE_SIZE / 5, TILE_SIZE / 2 + TILE_SIZE / 3, TILE_SIZE * col - TILE_SIZE / 5]}
        rotation={[0, 40, 0]}
      >
        <coneGeometry args={[TILE_SIZE / 4 + TILE_SIZE / 20, TILE_SIZE / 4, 4]} />
        <meshStandardMaterial 
          color={"#C79973"}
        />
      </mesh>
      
      <Line
        points={[
          [TILE_SIZE * row - (TILE_SIZE + TILE_SIZE / 2), TILE_SIZE / 2, TILE_SIZE * col - (TILE_SIZE + TILE_SIZE / 2)],
          [TILE_SIZE * row - (TILE_SIZE + TILE_SIZE / 2), TILE_SIZE / 2, TILE_SIZE * col + (TILE_SIZE + TILE_SIZE / 2)],
          [TILE_SIZE * row + (TILE_SIZE + TILE_SIZE / 2), TILE_SIZE / 2, TILE_SIZE * col + (TILE_SIZE + TILE_SIZE / 2)],
          [TILE_SIZE * row + (TILE_SIZE + TILE_SIZE / 2), TILE_SIZE / 2, TILE_SIZE * col - (TILE_SIZE + TILE_SIZE / 2)],
          [TILE_SIZE * row - (TILE_SIZE + TILE_SIZE / 2), TILE_SIZE / 2, TILE_SIZE * col - (TILE_SIZE + TILE_SIZE / 2)],
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