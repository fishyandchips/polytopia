import { useState } from "react";
import { useHover } from "~/app/hooks/useHover";
import { Edges } from '@react-three/drei';
import { TILE_SIZE } from "~/app/constants/meta";
import { TERRAIN_COLOURS } from "~/app/constants/terrain";
import { useGame } from "~/app/contexts/useGame";

export const PossibleMoveIndicator = ({ type, position }) => {
  const { troops, setTroops, setPossibleMoves, selected, setSelected } = useGame();
  const { hovered, hoverProps } = useHover();
  const [row, col] = position;

  const moveTroop = () => {
    const troop = troops.find((troop) => troop.row === selected.row && troop.col === selected.col);
    troop.moveTo(position);

    setPossibleMoves([]);
    setSelected(null);
  }

  const attackTroop = () => {
    const troop = troops.find((troop) => troop.row === selected.row && troop.col === selected.col);
    const enemyTroop = troops.find((troop) => troop.row === row && troop.col === col);

    troop.attackEnemy(enemyTroop, (deadTroop) => {
      setTroops(troops.filter(troop => troop !== deadTroop));
    });

    setPossibleMoves([]);
    setSelected(null);
  }

  if (type === "move") {
    return (
      <>
        <mesh
          position={[TILE_SIZE * row, TILE_SIZE / 2 + 0.1, TILE_SIZE * col]}
          rotation={[29.8, 0, 0]}
        >
          <circleGeometry args={[0.2]} />
          <meshStandardMaterial 
            color={"#676767"}
          />
        </mesh>

        <mesh
          {...hoverProps}
          onClick={moveTroop}
          position={[TILE_SIZE * row, TILE_SIZE / 2 + 0.1, TILE_SIZE * col]}
          rotation={[29.8, 0, 0]}
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
  } else if (type === "attack") {
    return (
      <>
        <mesh
          position={[TILE_SIZE * row, TILE_SIZE / 2 + 0.1, TILE_SIZE * col]}
          rotation={[29.8, 0, 0]}
        >
          <circleGeometry args={[0.2]} />
          <meshStandardMaterial 
            color={"#FF0000"}
          />
        </mesh>

        <mesh
          {...hoverProps}
          onClick={attackTroop}
          position={[TILE_SIZE * row, TILE_SIZE / 2 + 0.1, TILE_SIZE * col]}
          rotation={[29.8, 0, 0]}
        >
          <circleGeometry args={[0.8]} />
          <meshStandardMaterial 
            color={"#FF0000"}
            transparent={true}
            opacity={hovered ? 0.2 : 0}
          />
        </mesh>
      </>
    );
  }
}

export const Tile = ({ terrain, position }) => { 
  const { hovered, hoverProps } = useHover();
  const [row, col] = position;

  return (
    <mesh
      {...hoverProps}
      position={[TILE_SIZE * row, 0, TILE_SIZE * col]}
    >
      <boxGeometry args={[TILE_SIZE, TILE_SIZE, TILE_SIZE]} />
      <meshStandardMaterial 
        color={TERRAIN_COLOURS[terrain]}
      />
      {hovered && <Edges
        linewidth={5}
        color="white"
      />}
    </mesh>
  );
}