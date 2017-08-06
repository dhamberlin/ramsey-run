import P5Behavior from 'p5beh';
import * as Sensor from 'sensors';
const pb = new P5Behavior();

const BLACK = '#090909';
const WHITE = '#fdfdfd';
const RED = '#cc0000';
const BLUE = '#0000cc';

const vertexCoordinates = [
    [
        [40, 128],
        [216, 128],
        [84, 52],
        [84, 204],
        [172, 52],
        [172, 204]
    ],
    [
        [360, 448],
        [536, 448],
        [404, 372],
        [404, 524],
        [492, 372],
        [492, 524]
    ],
    [
        [128, 360],
        [212, 421],
        [44, 421],
        [76, 519],
        [180, 519]
    ],
    [
        [448, 40],
        [532, 101],
        [364, 101],
        [396, 199],
        [500, 199]
    ],
];

const dist = (x1, y1, x2, y2) => {
    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
}
const dim = (color) => {
    return color + (255 - color) * .625;
}
class Board {
    constructor(coords) {
        if (coords[0][0] ===  40) this.bg = [dim(140), dim(36), dim(41)];
        else if (coords[0][0] === 360) this.bg = [dim(54), dim(118), dim(54)];
        else if (coords[0][0] === 128) this.bg = [dim(212), dim(154), dim(50)];
        else this.bg = [dim(22), dim(72), dim(133)];

        this.vertices = coords.map(c => new Vertex(c, this.bg));
        // Initialize empty adjacency matrix
        this.adjacency = Array(coords.length).fill(0).map(row => Array(coords.length).fill(0)));
    this.currentColor = RED;
    this.active = null; // Holds current active vertex
    this.triangle = []; // Holds vertices of a triangle if present
    this.flash = false; // Toggles flashing
    this.flashCount = 0; // Counts frames for slower flashing
}
draw(activeSensors) {
    if (this.gameOver) {
      this.flash = this.toggleFlash();
    }
    // draw edges
    for (let i = 0; i < this.vertices.length - 1; i++) {
        for (let j = i + 1; j < this.vertices.length; j++) {
            if (this.adjacency[i][j]) {
                pb.p5.strokeWeight(2.75)
                pb.p5.stroke(this.adjacency[i][j])
                if (this.triangle.includes(i) && this.triangle.includes(j)) {
                  if (this.flash) {
                    pb.p5.strokeWeight(0)
                  }
                }
                pb.p5.line(this.vertices[i].x, this.vertices[i].y, this.vertices[j].x, this.vertices[j].y)
                pb.p5.strokeWeight(1)
              }
          }
      }

      this.vertices.forEach(vertex => {
          // check for collisions
          const canActivate = vertex.degree < (this.vertices.length - 1);
          const notSelf = vertex !== this.active;
          const currentlySteppedOn = vertex.checkCollisions(activeSensors)
          if (canActivate && notSelf && currentlySteppedOn) {
              this.activate(vertex);
          };

        // draw
        const strokeColor = vertex === this.active ? this.currentColor : WHITE;
        const outlineWeight = vertex === this.active ? 6 : 0
        const fillColor = currentlySteppedOn ? this.currentColor : vertex.color;
        const radii = currentlySteppedOn ? 52 : 32;

        pb.p5.noStroke();
        pb.p5.fill(fillColor);
        pb.p5.ellipse(vertex.x, vertex.y, radii);

        pb.p5.strokeWeight(outlineWeight);
        pb.p5.stroke(strokeColor);
        pb.p5.ellipse(vertex.x, vertex.y, radii);

        // fill triangle if needed
        if (this.triangle.length > 0 && !this.flash) {
          const x1 = this.vertices[this.triangle[0]].x;
          const y1 = this.vertices[this.triangle[0]].y
          const x2 = this.vertices[this.triangle[1]].x;
          const y2 = this.vertices[this.triangle[1]].y
          const x3 = this.vertices[this.triangle[2]].x;
          const y3 = this.vertices[this.triangle[2]].y
          pb.p5.noStroke();
          pb.p5.fill(this.adjacency[this.triangle[0]][this.triangle[1]]);
          pb.p5.triangle(x1, y1, x2, y2, x3, y3);
        }

        this.shouldGameEnd();
    });
}
shouldGameEnd() {
  if (this.gameOver) return;
  const triangleExists = this.checkForTriangle();
  const noEdgesLeft = this.noEdgesLeft();
  if (triangleExists || noEdgesLeft) {
    this.gameOver = true;
    setTimeout((() => {
        this.reset()
    }).bind(this), 3000)
  }
}

  connect(v1, v2) {
      const a = this.vertices.indexOf(v1);
      const b = this.vertices.indexOf(v2);
      this.adjacency[a][b] = this.currentColor;
      this.adjacency[b][a] = this.currentColor;
  }
  checkForTriangle() {
      const l = this.vertices.length;
      for (let i = 0; i < l - 2; i++) {
          for (let j = i + 1; j < l - 1; j++) {
              for (let k = j + 1; k < l; k++) {
                  const edges = [this.adjacency[i][j], this.adjacency[j][k], this.adjacency[i][k]]
                  const triangleExists = edges.reduce((acc, edge) => edge === acc ? acc : null);
                  if (triangleExists) {
                      this.triangle = [i, j, k];
                      return true;
                  }
              }
          }
      }
      return false;
  }
  noEdgesLeft() {
      return this.vertices.every(v => v.degree === this.vertices.length - 1);
  }
  activate(vertex) {
      if (!this.cooldown) {
          this.cooldown = true;
          if (this.active) {
              const a = this.vertices.indexOf(this.active);
              const b = this.vertices.indexOf(vertex);
              const moveAllowed = !this.adjacency[a][b];
              if (moveAllowed) {
                  vertex.degree++;
                  this.active.degree++;
                  this.connect(this.active, vertex);
                  this.active = null;

                  this.currentColor = this.currentColor === BLUE ? RED : BLUE;
              }
          } else {
              this.active = vertex;
          }
      }
      setTimeout(() => {
          this.cooldown = false
      }, 2000);
  }

  toggleFlash() {
    this.flashCount = (this.flashCount + 1) % 20;
    return this.flashCount > 4;
  }

  reset() {
    resetBoard(this);
  }
}
class Vertex {
    constructor([x, y], bg = BLACK) {
        this.x = x;
        this.y = y;
        this.color = WHITE;
        this.bg = bg;
        this.degree = 0;
    }
    checkCollisions(collisionsArray) {
        let collision = false;
        collisionsArray.forEach(collisionObject => {
            if (dist(collisionObject.x, collisionObject.y, this.x, this.y) < 32) {
                collision = true;
            }
        });
        return collision;
    }
}
const boards = vertexCoordinates.map(v => new Board(v));
const drawBoards = (activeSensors) => {
    boards.forEach(b => b.draw(activeSensors))
}
const resetBoard = (board) => {
    const index = boards.indexOf(board);
    boards[index] = new Board(vertexCoordinates[index]);
}

pb.preload = function(p) {

}

pb.setup = function(p) {

};

pb.draw = function(floor, p) {
    this.background(BLACK);
    this.noStroke();
    this.fill(dim(140), dim(36), dim(41));
    this.rect(0, 0, 256, 256);
    this.fill(dim(22), dim(72), dim(133));
    this.rect(320, 0, 256, 256);
    this.fill(dim(212), dim(154), dim(50));
    this.rect(0, 320, 256, 256);
    this.fill(dim(54), dim(118), dim(54));
    this.rect(320, 320, 256, 256);
    // TEXT
    this.fill('#999999');
    this.strokeWeight(1);
    this.noStroke();
    this.textSize(22);
    this.text("Try to make (or avoid making) a triangle in", 30, 295)
    this.fill(RED);
    this.strokeWeight(2);
    this.stroke(RED)
    this.text("your", 448, 295)
    this.fill(8, 123, 255);
    this.stroke(8, 123, 255);
    this.text("color", 496, 295)
    this.noFill();
    this.noStroke();
    this.strokeWeight(1);
    this.stroke('#000000');

    const activeSensors = [];
    for (var i = new Sensor.Index(); i; i = i.incr()) {
        if (floor.sensors.get(i)) {
            this.ellipse(i.x * 8, i.y * 8, 20);
            activeSensors.push({
                x: i.x * 8,
                y: i.y * 8
            });
        }
    }
    drawBoards(activeSensors);
};
export const behavior = {
  title: "ALFA LOBO DINAMITA",
  init: pb.init.bind(pb),
  frameRate: 'animate',
  render: pb.render.bind(pb),
  numGhosts: 0,
};
export default behavior
