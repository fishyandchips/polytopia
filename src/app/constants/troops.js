import { OrbitControls, MapControls, PerspectiveCamera, Edges, useCursor, Line } from '@react-three/drei';
import { useState } from 'react';

const Warrior = ({ hovered, ...props }) => {
  return (
    <mesh
      {...props}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial 
        color={"#FFFFFF"}
      />
      {hovered && <Edges
        linewidth={5}
        color="white"
      />}
    </mesh>
  );
}

export const Troop = ({ type, ...props }) => {
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
  
  const Asset = TROOP_ASSETS[type];
  const health = TROOP_STATS[type].health;

  return (
    <Asset 
      {...props} 
      hovered={hovered}
      onPointerEnter={startHover}
      onPointerLeave={endHover}
    />
  );
}

const TROOP_ASSETS = {
  Warrior: Warrior,
}

export const TROOP_STATS = {
  Warrior: {
    health: 10,
    attack: 5,
    defense: 2,
    movement: 1,
    range: 1,
  },
}