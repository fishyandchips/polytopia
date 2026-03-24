"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { NUM_ROWS, NUM_COLS } from "~/app/constants/meta";
import { initBoard } from "~/app/utils/init";

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameContextProvider = ({ children }) => {
  const [board, setBoard] = useState(
    Array.from({ length: NUM_ROWS }, () =>
      Array.from({ length: NUM_COLS }, () => {
        return {
          terrain: null,
          feature: null,
        };
      })
    )
  );
  const [troops, setTroops] = useState([]);
  const [selected, setSelected] = useState(null);
  const [possibleMoves, setPossibleMoves] = useState([]);

  useEffect(() => {
    setBoard(initBoard());
  }, []);

  return (
    <GameContext.Provider value={{
      board,
      setBoard,
      troops,
      setTroops,
      selected,
      setSelected,
      possibleMoves,
      setPossibleMoves
    }}>
      {children}
    </GameContext.Provider>
  );
}
