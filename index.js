// Not done

class FakeMouseEvent extends MouseEvent {
  constructor(type, values) {
    const { offsetX, offsetY, ...mouseValues } = values;
    super(type, (mouseValues));
    this._offsetX = offsetX;
    this._offsetY = offsetY;
  }
  get offsetX() { return this._offsetX ?? super.offsetX; }
  get offsetY() { return this._offsetY ?? super.offsetY; }
}

// I LOVE POINTERS!!! 
const log    = (...msg) => console.log(msg);
const select = (_, el=document) => el.querySelector(_);
const wait   = (t) => new Promise(_ => setTimeout(_, t*1000));

// Gamefuncs
const isGameOver = () => select('h2', canvas.parentNode).parentNode.parentNode.parentNode.style.visibility != 'hidden';
const getDifficulty = () => { 
  let menu = select('g-menu', select('g-popup', select('canvas').parentNode));
  for (let i = 0; i < 3; i++) {
    if (menu.children[i].getAttribute('aria-checked') == 'true') return i;
  }
  return -1;
}
const getSurroudingTiles = (tile, board) => {
  // ? ? ?
  // ? x ?
  // ? ? ?  
  // tile = [x,y]
  let tileval = board[x][y];
  let tiles = [[UNKNOWN, UNKNOWN, UNKNOWN], [UNKNOWN, tileval, UNKNOWN], [UNKNOWN, UNKNOWN, UNKNOWN]]

  if(tile[1] > 0){ // if y is below top of board
    if (tile[0] > 0) tiles[1][1] = board[x-1][y-1]
    tiles[2][1] = board[x][y-1]
    if (tile[0] < board[0].length-1) tiles[3][1] = board[x+1][y-1]
  }

  if (tile[0] > 0) tiles[1][2] = board[x-1][y]
  // tiles[2][2] is tile
  if (tile[0] < board[0].length-1) tiles[3][2] = board[x+1][y]

  if(tile[1] < board[1].length-1){ // if y is above bottom of board
    if (tile[0] > 0) tiles[1][3] = board[x-1][y+1]
    tiles[2][3] = board[x][y+1]
    if (tile[0] < board[0].length-1) tiles[3][3] = board[x+1][y+1]
  }

  return tiles;
}

// Variables

const UNKNOWN = -2, FLAG = -1;
const COLOR_MAP = {
  '#aad751': UNKNOWN,
  '#a2d149': UNKNOWN,
  '#f23607': FLAG,
  '#e63307': FLAG,
  '#e5c29f': 0,
  '#d7b899': 0,
  '#1976d2': 1,
  '#388e3c': 2,
  '#d32f2f': 3,
  '#7b1fa2': 4,
  '#ff8f00': 5,
  '#0097a7': 6,
  '#424242': 7,
}

  // X-tiles, Y-tiles, Mines
const gameData = [[10, 8, 10], [18, 14, 40], [24, 20, 99]];

await (async () => {
  let canvas  = select("canvas");
  let context =  canvas.getContext('2d', {willReadFrequently: true});
  let [xTiles, yTiles, mines] = gameData[getDifficulty()];
  let size = canvas.width / xTiles;

  let board = [];
  for (let x = 0; x < xTiles; x++) {
    board[x] = [];
    for (let y = 0; y < yTiles; y++) board[x][y] = UNKNOWN;
  }

  function getTile(x,y) { // all from jwseph 
    if (board[x][y] == FLAG || board[x][y] > 0) return board[x][y];
    let relativePositions = [
      [.6, .4], [.5, .5], [.6, .6], [.5, .58], [.5, .3],
      [.45, .45], [.4, .6], [.5, .4],
    ]
    let pixelData = [];
    for (const [dx, dy] of relativePositions) {
      pixelData.push(context.getImageData((x+dx)*size, (y+dy)*size, 1, 1).data);
    }
    let hexColors = [];
    for (let i = 0; i < pixelData.length; i++) {
      let [r, g, b] = pixelData[i];
      hexColors[i] = '#'+((r<<16)+(g<<8)+b).toString(16).padStart(6, '0');
    }
    for (const hexColor of hexColors) {
      if (!(hexColor in COLOR_MAP)) continue;
      board[x][y] = Math.max(board[x][y], COLOR_MAP[hexColor]);
    }
    return board[x][y];
  }

  console.log(board);

})()







function choose(n, k) {
  const res = [];
  for (let state = 0; state < (1<<n); state++) {
    const arr = [];
    let c = 0;
    for (let i = 0; i < n && c <= k; i++) {
      let x = state>>i&1;
      arr.push(x);
      c += x;
    }
    if (c != k) continue;
    res.push(arr);
  }
  return res;
}

function getDifficultyIndex() {
  // Easy - 0, Medium - 1, Hard - 2
  // Should support different languages
  let popup = select('g-popup', select('canvas').parentNode);
  let menu = select('g-menu', popup);
  for (let i = 0; i < 3; i++) {
    if (menu.children[i].getAttribute('aria-checked') == 'true') {
      return i;
    }
  }
  return -1;
}


const UNKNOWN = -2, FLAG = -1;

class Game {
  static COLOR_MAP = {
    '#aad751': UNKNOWN,
    '#a2d149': UNKNOWN,
    '#f23607': FLAG,
    '#e63307': FLAG,
    '#e5c29f': 0,
    '#d7b899': 0,
    '#1976d2': 1,
    '#388e3c': 2,
    '#d32f2f': 3,
    '#7b1fa2': 4,
    '#ff8f00': 5,
    '#0097a7': 6,
    '#424242': 7,
  }
  constructor() {
    this.canvas = select('canvas');
    this.context = this.canvas.getContext('2d', {willReadFrequently: true});
    let gameData = [[10, 8, 10], [18, 14, 40], [24, 20, 99]];
    [this.X, this.Y, this.mines] = gameData[getDifficultyIndex()];
    this.size = this.canvas.width / this.X;
    this.board = [];
    for (let x = 0; x < this.X; x++) {
      this.board[x] = [];
      for (let y = 0; y < this.Y; y++) this.board[x][y] = UNKNOWN;
    }
  }
  getTile(x, y) {
    if (this.board[x][y] == FLAG || this.board[x][y] > 0) return this.board[x][y];
    let relativePositions = [
      [.6, .4], [.5, .5], [.6, .6], [.5, .58], [.5, .3],
      [.45, .45], [.4, .6], [.5, .4],
    ]
    let pixelData = [];
    for (const [dx, dy] of relativePositions) {
      pixelData.push(this.context.getImageData((x+dx)*this.size, (y+dy)*this.size, 1, 1).data);
    }
    let hexColors = [];
    for (let i = 0; i < pixelData.length; i++) {
      let [r, g, b] = pixelData[i];
      hexColors[i] = '#'+((r<<16)+(g<<8)+b).toString(16).padStart(6, '0');
    }
    for (const hexColor of hexColors) {
      if (!(hexColor in Game.COLOR_MAP)) continue;
      this.board[x][y] = Math.max(this.board[x][y], Game.COLOR_MAP[hexColor]);
    }
    return this.board[x][y];
  }
  clickTile(x, y, flag) {
    let values = {
      offsetX: (x+.5)*this.size,
      offsetY: (y+.5)*this.size,
      bubbles: true,
    };
    if (flag) {
      values = {...values, button: 2, which: 3};
    }
    this.canvas.dispatchEvent(new FakeMouseEvent('mousedown', values));
    this.canvas.dispatchEvent(new FakeMouseEvent('mouseup', values));
  }
  hasTile(x, y) {
    return 0 <= x && x < this.X && 0 <= y && y < this.Y;
  }
  for8(x, y, fn) {
    for (let i = x-1; i <= x+1; i++) {
      for (let j = y-1; j <= y+1; j++) {
        if (!this.hasTile(i, j) || i == x && j == y) continue;
        fn(i, j, this.getTile(i, j));
      }
    }
  }
  forAll(fn) {
    for (let y = 0; y < this.Y; y++) {
      for (let x = 0; x < this.X; x++) {
        fn(x, y, this.getTile(x, y));
      }
    }
  }
  solve() {
    // Source: https://dev.to/krlove/creating-advanced-minesweeper-solver-using-logic-programming-2ppd
    console.log('[Minesweeper] Solving...');
    const unknownMap = new Map();
    const ruleArgs = [];
    this.forAll((x, y, tile) => {
      if (tile <= 0) return;
      const unknownNeighbors = [];
      let adjFlags = 0;
      this.for8(x, y, (i, j, adjTile) => {
        adjFlags += adjTile == FLAG;
        if (adjTile == FLAG || adjTile >= 0) return;
        let key = i+','+j;
        if (!unknownMap.has(key)) {
          unknownMap.set(key, logic.lvar([i, j]));
        }
        unknownNeighbors.push(unknownMap.get(key));
      })
      if (!unknownNeighbors.length) return;
      const orArgs = [];
      for (const comb of choose(unknownNeighbors.length, tile-adjFlags)) {
        const andArgs = [];
        for (const [i, isMine] of comb.entries()) {
          andArgs.push(logic.eq(unknownNeighbors[i], isMine));
        }
        orArgs.push(logic.and(...andArgs));
      }
      ruleArgs.push(logic.or(...orArgs));
    })
    const rule = logic.and(...ruleArgs);
    const unknown = Array.from(unknownMap.values());
    
    const probabilities = logic.run(rule, unknown);
    for (let i = 0; i < unknown.length; i++) {
      let [x, y] = unknown[i].name;
      let mine = 0, total = 0;
      for (let j = 0; j < probabilities.length; j++) {
        mine += probabilities[j][i];
        total++;
      }
      if (mine == 0) {
        this.clickTile(x, y, 0)
      }
      if (mine == total) {
        this.board[x][y] = FLAG;
        this.clickTile(x, y, 1)
      }
    }
  }
  solveUntilDone() {
    if (gameOver()) return;
    this.solve();
    let flags = 0, unknown = 0;
    this.forAll((x, y, tile) => {
      flags += tile == FLAG;
      unknown += tile == UNKNOWN;
    })
    if (flags == this.mines) {
      this.forAll((x, y, tile) => {
        if (tile != UNKNOWN) return;
        this.clickTile(x, y, 0);
        unknown -= 1;
      })
    }
    if (unknown == 0) return;
    setTimeout(() => this.solveUntilDone(), 300);
  }
}

// LogicJS
let script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/gh/mcsoto/LogicJS/logic.js';
select('head').appendChild(script);
script.addEventListener('load', () => {
  new Game().solveUntilDone();
})

})();