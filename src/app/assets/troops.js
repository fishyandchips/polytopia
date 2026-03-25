import { useState } from "react";
import { useHover } from "~/app/hooks/useHover";
import { Edges, Text3D } from '@react-three/drei';
import { TILE_SIZE } from "~/app/constants/meta";
import { getPossibleMoves } from "~/app/utils/movement";
import { useGame } from "~/app/contexts/useGame";

export const WarriorMesh = ({ troop }) => {
  const { hovered, hoverProps } = useHover();
  const { troops, selected, setSelected, setPossibleMoves } = useGame();
  const { player, row, col, health } = troop;

  const togglePossibleMoves = (e) => {
    e.stopPropagation();

    if (selected) {
      setSelected(null);
      setPossibleMoves([]);
      return;
    }

    setSelected({ type: "Troop", row, col });
    setPossibleMoves(getPossibleMoves(troop, troops));
  }

  return (
    <>
      <mesh
        {...hoverProps}
        position={[TILE_SIZE * row, TILE_SIZE, TILE_SIZE * col]}
        onClick={togglePossibleMoves}
      >
        <boxGeometry args={[TILE_SIZE / 2, TILE_SIZE / 2, TILE_SIZE / 2]} />
        <meshStandardMaterial 
          color={player === "A" ? "#F54242" : "#42ADF5"}
        />
        {hovered && <Edges
          linewidth={5}
          color={"#FFFFFF"}
        />}
      </mesh>

      <Text3D 
        rotation={([0, 45, 0])}
        position={[TILE_SIZE * row, TILE_SIZE * 1.4, TILE_SIZE * col]}
        font="/fonts/helvetiker_regular.typeface.json" 
        height={0.25} 
        size={0.4}
      >
        {health}
        <meshStandardMaterial color="white" />
      </Text3D>
    </>
  );
}