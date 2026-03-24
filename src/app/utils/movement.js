import { CARDINAL_DIRECTIONS, DIAGONAL_DIRECTIONS } from "~/app/constants/directions";
import { NUM_ROWS, NUM_COLS } from "~/app/constants/meta";

export const getPossibleMoves = (troop, troops) => {
  const { player, movement, row, col } = troop;
  const possibleMoves = [];

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

      let type = "move";

      if (troops.some((troop) => troop.row === newRow && troop.col === newCol)) {
        type = "attack";
      }
      
      visited.add(JSON.stringify([newRow, newCol]));
      if (distance + 1 == movement) {
        possibleMoves.push({
          type,
          row: newRow,
          col: newCol
        });
        continue;
      } else if (distance + 1 < movement) {
        possibleMoves.push({
          type,
          row: newRow,
          col: newCol
        });
      } 
      queue.push([newRow, newCol, distance + 1]);
    }
  }

  return possibleMoves;
}

const moveTroop = (row, col) => {
  const newTroops = [...troops];
  newTroops[row][col] = troops[selected.row][selected.col];
  newTroops[selected.row][selected.col] = null;
  setTroops(newTroops);
  setPossibleMoves([]);
  setSelected(null);
}