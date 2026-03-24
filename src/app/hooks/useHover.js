import { useState } from "react";
import { useCursor } from "@react-three/drei";

export const useHover = () => {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  const hoverProps = {
    onPointerEnter: (e) => { e.stopPropagation(); setHovered(true); },
    onPointerLeave: (e) => { e.stopPropagation(); setHovered(false); }
  };

  return { hovered, hoverProps };
};
