class CubicBeizer extends Canvas {
  constructor(id, width, height, coords) {
    super(id, width, height);
    this.coords = coords;
    this.draw();
  }

  draw() {
    this.ctx.beginPath();
    this.coords.forEach((coord, i) => {
      if (i === 0) this.ctx.moveTo(coord.SP.x, coord.SP.y);
      this.drawCurve(coord);
    });
    this.ctx.strokeStyle = "#a3a3a3";
    this.ctx.stroke();

    this.coords.forEach((coord) => {
      this.indicatePoints(coord);
    });
  }

  drawCurve(coord) {
    this.ctx.bezierCurveTo(
      coord.CP1.x,
      coord.CP1.y,
      coord.CP2.x,
      coord.CP2.y,
      coord.EP.x,
      coord.EP.y
    );
  }

  indicatePoints(coord) {
    this.ctx.beginPath();
    this.ctx.moveTo(coord.CP1.x, coord.CP1.y);
    this.ctx.arc(coord.CP1.x, coord.CP1.y, 2, 0, Math.PI * 2, true);
    this.ctx.moveTo(coord.CP2.x, coord.CP2.y);
    this.ctx.arc(coord.CP2.x, coord.CP2.y, 2, 0, Math.PI * 2, true);
    this.ctx.fillStyle = "rgba(255, 0, 0, 0.7)";
    this.ctx.fill();

    this.ctx.beginPath();
    this.ctx.moveTo(coord.SP.x, coord.SP.y);
    this.ctx.arc(coord.SP.x, coord.SP.y, 2, 0, Math.PI * 2, true);
    this.ctx.moveTo(coord.EP.x, coord.EP.y);
    this.ctx.arc(coord.EP.x, coord.EP.y, 2, 0, Math.PI * 2, true);
    this.ctx.fillStyle = "rgba(0, 0, 255, 0.7)";
    this.ctx.fill();
  }
}

const coords = [
  {
    SP: { x: 75, y: 40 },
    EP: { x: 50, y: 25 },
    CP1: { x: 75, y: 37 },
    CP2: { x: 70, y: 25 }
  },
  {
    SP: { x: 50, y: 25 },
    EP: { x: 20, y: 62.5 },
    CP1: { x: 20, y: 25 },
    CP2: { x: 20, y: 62.5 }
  },
  {
    SP: { x: 20, y: 62.5 },
    EP: { x: 75, y: 120 },
    CP1: { x: 20, y: 80 },
    CP2: { x: 40, y: 102 }
  },
  {
    SP: { x: 75, y: 120 },
    EP: { x: 130, y: 62.5 },
    CP1: { x: 110, y: 102 },
    CP2: { x: 130, y: 80 }
  },
  {
    SP: { x: 130, y: 62.5 },
    EP: { x: 100, y: 25 },
    CP1: { x: 130, y: 62.5 },
    CP2: { x: 130, y: 25 }
  },
  {
    SP: { x: 100, y: 25 },
    EP: { x: 75, y: 40 },
    CP1: { x: 85, y: 25 },
    CP2: { x: 75, y: 37 }
  }
];
const heart = new CubicBeizer("c", 300, 200, coords);