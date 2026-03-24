export class Troop {
  constructor(player, position) {
    const [row, col] = position;
    this.player = player;
    this.row = row;
    this.col = col;
    this.health = 10;
    this.attack = 1;
    this.defense = 1;
    this.movement = 1;
    this.range = 1;
  }

  moveTo(newPosition) {
    const [newRow, newCol] = newPosition;
    this.row = newRow;
    this.col = newCol;
  }

  attackEnemy(enemyTroop, removeTroopCallback) {
    enemyTroop.health -= this.attack;
    if (enemyTroop.health <= 0) {
      this.moveTo([enemyTroop.row, enemyTroop.col])
      removeTroopCallback(enemyTroop);
    }
  }
}

export class Warrior extends Troop {
  constructor(player, position) {
    super(player, position);
    this.health = 10;
    this.attack = 5;
    this.defense = 2;
    this.movement = 1;
    this.range = 1;
  }
}
