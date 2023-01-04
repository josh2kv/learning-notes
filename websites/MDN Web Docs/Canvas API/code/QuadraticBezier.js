class Canvas {
  constructor(id, width = 300, height = 200) {
    this.element = document.getElementById(id);
    this.ctx = this.element.getContext("2d");
    this.element.width = width;
    this.element.height = height;
  }

  putADot() {}
}

class QuadraticBezier extends Canvas {
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

  indicatePoints(coord) {
    this.ctx.beginPath();
    this.ctx.moveTo(coord.CP.x, coord.CP.y);
    this.ctx.arc(coord.CP.x, coord.CP.y, 2, 0, Math.PI * 2, true);
    this.ctx.fillStyle = "red";
    this.ctx.fill();

    this.ctx.beginPath();
    this.ctx.moveTo(coord.SP.x, coord.SP.y);
    this.ctx.arc(coord.SP.x, coord.SP.y, 2, 0, Math.PI * 2, true);
    this.ctx.moveTo(coord.EP.x, coord.EP.y);
    this.ctx.arc(coord.EP.x, coord.EP.y, 2, 0, Math.PI * 2, true);
    this.ctx.fillStyle = "blue";
    this.ctx.fill();
  }

  drawCurve(coord) {
    this.ctx.quadraticCurveTo(coord.CP.x, coord.CP.y, coord.EP.x, coord.EP.y);
  }
}

const coords = [
  {
    SP: { x: 75, y: 25 },
    EP: { x: 25, y: 62.5 },
    CP: { x: 25, y: 25 }
  },
  {
    SP: { x: 25, y: 62.5 },
    EP: { x: 50, y: 100 },
    CP: { x: 25, y: 100 }
  },
  {
    SP: { x: 50, y: 100 },
    EP: { x: 30, y: 125 },
    CP: { x: 50, y: 120 }
  },
  {
    SP: { x: 30, y: 125 },
    EP: { x: 65, y: 100 },
    CP: { x: 60, y: 120 }
  },
  {
    SP: { x: 65, y: 100 },
    EP: { x: 125, y: 62.5 },
    CP: { x: 125, y: 100 }
  },
  {
    SP: { x: 125, y: 62.5 },
    EP: { x: 75, y: 25 },
    CP: { x: 125, y: 25 }
  }
];

const speechBubble = new QuadraticBezier("c", 300, 200, coords);