import { TERRAIN_COLOURS } from "~/app/constants/terrain";
import { NUM_ROWS, NUM_COLS, MIN_VILLAGE_RADIUS, MAX_VILLAGE_RADIUS } from "~/app/constants/meta";
import { CARDINAL_DIRECTIONS } from "~/app//constants/directions";

/** General helper function that shuffles an array using the 
 * Fisher-Yates shuffle algorithm, used to go through all the
 * elements in a random order.
 * 
 * @param {any[]} array 
 * @returns 
 */
const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    // Pick a random index from 0 to i and swap in-place
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

//////////////////////////////////////////////////////////////////
//                       VILLAGE GENERATION                     //
//////////////////////////////////////////////////////////////////

/** Helper function for generateVillage, sets the coordinates
 * for the first village.
 * 
 * @param {[Number, Number, String][]} queue 
 * @param {String[]} visited 
 */
const generateFirstVillage = (queue, visited, villagePositions) => {
  // Set village seeds to spawn either 1 or 2 tiles
  // from the border
  const [seedX, seedY] = [
    [1, 2, NUM_ROWS - 2, NUM_ROWS - 3][Math.floor(Math.random() * 4)], 
    [1, 2, NUM_COLS - 2, NUM_COLS - 3][Math.floor(Math.random() * 4)]
  ];
  villagePositions.push([seedX, seedY]);

  // Add tiles within the village's radius to visited
  // to ensure other villages aren't spawned within
  // that radius
  for (let i = seedX - (MIN_VILLAGE_RADIUS - 1); i <= seedX + (MIN_VILLAGE_RADIUS - 1); i++) {
    for (let j = seedY - (MIN_VILLAGE_RADIUS - 1); j <= seedY + (MIN_VILLAGE_RADIUS - 1); j++) {
      visited.add(JSON.stringify([i, j]));
    }
  }
  queue.push([seedX, seedY]);
}

/** Helper function for generateVillages, uses BFS to
 * set the positions for all other villages.
 * 
 * @param {[Number, Number, String][]} queue 
 * @param {String[]} visited 
 * @param {String[][]} features 
 * @param {[Number, Number][]} villagePositions 
 */
const generateOtherVillages = (queue, visited, features, villagePositions) => {
  // Villages can only spawn between 3-4 tiles away from 
  // nearby villages
  const possibleSpawns = [];
  for (let i = -MAX_VILLAGE_RADIUS; i <= MAX_VILLAGE_RADIUS; i++) {
    for (let j = -MAX_VILLAGE_RADIUS; j <= MAX_VILLAGE_RADIUS; j++) {
      if (i > -MIN_VILLAGE_RADIUS && i < MIN_VILLAGE_RADIUS && j > -MIN_VILLAGE_RADIUS && j < MIN_VILLAGE_RADIUS) {
        continue;
      }

      possibleSpawns.push([i, j]);
    }
  }

  // Runs BFS to find the next possible village location
  while (queue.length > 0) {
    const [r, c] = queue.shift();
    features[r][c] = "Village";
    villagePositions.push([r, c]);
    
    for (const [dr, dc] of shuffle(possibleSpawns)) {
      const newRow = r + dr;
      const newCol = c + dc;
      
      // Out of bounds check
      if (newRow < 1 || newRow >= NUM_ROWS - 1 || newCol < 1 || newCol >= NUM_COLS - 1) {
        continue;
      }

      if (visited.has(JSON.stringify([newRow, newCol]))) {
        continue;
      }
      
      // Add tiles within village radius to visited
      for (let i = newRow - (MIN_VILLAGE_RADIUS - 1); i <= newRow + (MIN_VILLAGE_RADIUS - 1); i++) {
        for (let j = newCol - (MIN_VILLAGE_RADIUS - 1); j <= newCol + (MIN_VILLAGE_RADIUS - 1); j++) {
          visited.add(JSON.stringify([i, j]));
        }
      }
      queue.push([newRow, newCol]);
    }
  }
}

/** Helper function for generateVillages, ensures that all villages
 * are on a land tile by setting villages currently on an ocean
 * tile to be the same as the closest land tile.
 * 
 * @param {String[][]} board 
 * @param {[Number, Number][]} villagePositions 
 */
const placeVillagesOnLand = (board, villagePositions) => {
  for (const [villageX, villageY] of villagePositions) {
    if (board[villageX][villageY] != TERRAIN_COLOURS.Ocean) {
      continue;
    }

    const queue = [];
    const visited = new Set();
    queue.push([villageX, villageY]);
    visited.add(JSON.stringify([villageX, villageY]));

    while (queue.length > 0) {
      const [r, c] = queue.shift();
      
      // Sets the land tile for a village on water to be the 
      // the same as the closest land tile
      if (board[r][c] != TERRAIN_COLOURS.Ocean) {
        board[villageX][villageY] = board[r][c];
        break;
      }
      
      for (const [dr, dc] of CARDINAL_DIRECTIONS) {
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
        queue.push([newRow, newCol]);
      }
    }
  }
}

/** Helper function for generateTerrain, sets the positions
 * for all villages.
 * 
 * @param {String[][]} features 
 */
const generateVillages = (board, features) => {
  const villagePositions = [];
  
  const queue = [];
  const visited = new Set();

  generateFirstVillage(queue, visited, villagePositions);
  generateOtherVillages(queue, visited, features, villagePositions);
  placeVillagesOnLand(board, villagePositions);
}

//////////////////////////////////////////////////////////////////
//                       TERRAIN GENERATION                     //
//////////////////////////////////////////////////////////////////

/** Helper function for generateLand, sets the initial 
 * coordinates for each land terrain type from which the rest
 * of the terrain is generated.
 * 
 * @param {[Number, Number, String][]} queue 
 * @param {String[]} visited 
 */
const generateSeeds = (queue, visited) => {
  // Start with a seed for each land terrain type
  Object.keys(TERRAIN_COLOURS).forEach((terrain) => {
    if (terrain == "Water" || terrain == "Ocean") {
      return;
    }
    
    // Choose a random cell on the grid that hasn't been
    // chosen yet
    let x = Math.floor(Math.random() * NUM_ROWS);
    let y = Math.floor(Math.random() * NUM_COLS);

    while (visited.has([x, y])) {
      x = Math.floor(Math.random() * NUM_ROWS);
      y = Math.floor(Math.random() * NUM_COLS);
    }

    visited.add(JSON.stringify([x, y]));
    queue.push([x, y, terrain]);
  });
}

/** Helper function for generateTerrain, generates the land
 * tiles, taking into account the terrain type for the map.
 * 
 * @param {String[][]} board 
 */
const generateLand = (board) => {
  const terrainSizes = Object.fromEntries(
    Object.entries(TERRAIN_COLOURS).map(([terrain, _]) => [terrain, Math.floor(Math.random() * 10 + 20)])
  );

  // Run multi-source BFS to generate the land terrain
  const queue = [];
  const visited = new Set();

  generateSeeds(queue, visited);

  while (queue.length > 0) {
    const [r, c, terrain] = queue.shift();
    board[r][c] = TERRAIN_COLOURS[terrain];
    
    for (const [dr, dc] of shuffle(CARDINAL_DIRECTIONS)) {
      const newRow = r + dr;
      const newCol = c + dc;

      // Out of bounds check
      if (newRow < 0 || newRow >= NUM_ROWS || newCol < 0 || newCol >= NUM_COLS) {
        continue;
      }

      if (visited.has(JSON.stringify([newRow, newCol]))) {
        continue;
      }

      // Each terrain has a size limit
      if (terrainSizes[terrain] == 0) {
        continue;
      }

      visited.add(JSON.stringify([newRow, newCol]));
      queue.push([newRow, newCol, terrain]);
      terrainSizes[terrain]--;
    }
  }
}

/** Helper function for generateTerrain, sets ocean tiles
 * that are adjacent to land to water tiles.
 * 
 * @param {String[][]} board 
 */
const generateWater = (board) => {
  for (let r = 0; r < NUM_ROWS; r++) {
    for (let c = 0; c < NUM_COLS; c++) {
      if (board[r][c] != TERRAIN_COLOURS.Ocean) {
        continue;
      }

      for (const [dr, dc] of CARDINAL_DIRECTIONS) {
        const newRow = r + dr;
        const newCol = c + dc;

        // Out of bounds check
        if (newRow < 0 || newRow >= NUM_ROWS || newCol < 0 || newCol >= NUM_COLS) {
          continue;
        }

        // If one of the adjacent tiles is a land tile,
        // this ocean tile becomes a water tile
        if (board[newRow][newCol] != TERRAIN_COLOURS.Water && board[newRow][newCol] != TERRAIN_COLOURS.Ocean) {
          board[r][c] = TERRAIN_COLOURS.Water;
          break;
        }
      }
    }
  }
}

export const generateTerrain = () => {
  const newBoard = Array.from({ length: NUM_ROWS }, () =>
    Array.from({ length: NUM_COLS }, () => TERRAIN_COLOURS.Ocean)
  );
  const newFeatures = Array.from({ length: NUM_ROWS }, () =>
    Array.from({ length: NUM_COLS }, () => null)
  );
  
  generateLand(newBoard);
  generateVillages(newBoard, newFeatures);
  generateWater(newBoard);

  return { newBoard, newFeatures };
}