import { useState } from "react";
import { useHover } from "~/app/hooks/useHover";
import { Edges } from '@react-three/drei';
import { TILE_SIZE } from "~/app/constants/meta";
import { getPossibleMoves } from "~/app/utils/movement";
import { useGame } from "~/app/contexts/useGame";

export const WarriorMesh = ({ troop }) => {
  const { hovered, hoverProps } = useHover();
  const { troops, selected, setSelected, setPossibleMoves } = useGame();
  const { player, row, col } = troop;

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
  );
}