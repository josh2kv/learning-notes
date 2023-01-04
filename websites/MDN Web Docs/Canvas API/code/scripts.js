const $canvas = document.getElementById('c');
const ctx = $canvas.getContext('2d');

/**
 *
 */
// if (ctx) {
//   ctx.beginPath();
//   // ctx.moveTo(125, 75);
//   ctx.arc(75, 75, 50, 0, Math.PI * 2, true); // Outer circle
//   // ctx.moveTo(110, 75);
//   ctx.arc(75, 75, 35, 0, Math.PI, false); // Mouth (clockwise)
//   // ctx.moveTo(65, 65);
//   ctx.arc(60, 65, 5, 0, Math.PI * 2, true); // Left eye
//   // ctx.moveTo(95, 65);
//   ctx.arc(90, 65, 5, 0, Math.PI * 2, true); // Right eye
//   ctx.stroke();
// }

/**
 *
 */
// if (ctx) {
//   for (let row = 0; row < 4; row++) {
//     for (let col = 0; col < 3; col++) {
//       ctx.beginPath();
//       const x = 25 + col * 50; // x coordinate
//       const y = 25 + row * 50; // y coordinate
//       const radius = 20; // Arc radius
//       const startAngle = 0; // Starting point on circle

//       // 0: 180, 1: 270, 2: 360
//       const endAngle = Math.PI + (Math.PI * col) / 2; // End point on circle

//       // 0, 2: 시계방향, 1, 3: 반시계방향
//       const counterclockwise = row % 2 !== 0; // clockwise or counterclockwise

//       ctx.arc(x, y, radius, startAngle, endAngle, counterclockwise);

//       if (row > 1) {
//         ctx.fill();
//       } else {
//         ctx.stroke();
//       }
//     }
//   }
// }

/**
 *
 */
if (ctx) {
  function roundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x, y + radius);
    ctx.arcTo(x, y + height, x + radius, y + height, radius);
    ctx.arcTo(x + width, y + height, x + width, y + height - radius, radius);
    ctx.arcTo(x + width, y, x + width - radius, y, radius);
    ctx.arcTo(x, y, x, y + radius, radius);
    ctx.stroke();
  }

  // 바깥 테두리
  roundedRect(ctx, 12, 12, 150, 150, 15);
  // 안 테두리
  roundedRect(ctx, 19, 19, 150, 150, 9);
  // 2사분면 사각형
  roundedRect(ctx, 53, 53, 49, 33, 10);
  // 3사분면 사각형
  roundedRect(ctx, 53, 119, 49, 16, 6);
  // 1사분면 사각형
  roundedRect(ctx, 135, 53, 49, 33, 10);
  // 4사분면 사각형
  roundedRect(ctx, 135, 119, 25, 49, 10);

  // 주인공
  ctx.beginPath();
  ctx.arc(37, 37, 13, Math.PI / 7, -Math.PI / 7, false);
  ctx.lineTo(31, 37);
  ctx.fill();

  // 점 row 1
  for (let i = 0; i < 8; i++) {
    ctx.fillRect(51 + i * 16, 35, 4, 4);
  }

  // 점 col 1
  for (let i = 0; i < 6; i++) {
    ctx.fillRect(115, 51 + i * 16, 4, 4);
  }

  // 점 row 2
  for (let i = 0; i < 8; i++) {
    ctx.fillRect(51 + i * 16, 99, 4, 4);
  }

  // 적 shape
  ctx.beginPath();
  ctx.moveTo(83, 116);
  ctx.lineTo(83, 102);
  ctx.bezierCurveTo(83, 94, 89, 88, 97, 88);
  ctx.bezierCurveTo(105, 88, 111, 94, 111, 102);
  ctx.lineTo(111, 116);
  ctx.lineTo(106.333, 111.333);
  ctx.lineTo(101.666, 116);
  ctx.lineTo(97, 111.333);
  ctx.lineTo(92.333, 116);
  ctx.lineTo(87.666, 111.333);
  ctx.lineTo(83, 116);
  ctx.fill();

  // 적 눈 흰자위
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.moveTo(91, 96);
  ctx.bezierCurveTo(88, 96, 87, 99, 87, 101);
  ctx.bezierCurveTo(87, 103, 88, 106, 91, 106);
  ctx.bezierCurveTo(94, 106, 95, 103, 95, 101);
  ctx.bezierCurveTo(95, 99, 94, 96, 91, 96);
  ctx.moveTo(103, 96);
  ctx.bezierCurveTo(100, 96, 99, 99, 99, 101);
  ctx.bezierCurveTo(99, 103, 100, 106, 103, 106);
  ctx.bezierCurveTo(106, 106, 107, 103, 107, 101);
  ctx.bezierCurveTo(107, 99, 106, 96, 103, 96);
  ctx.fill();

  // 적 눈동자
  ctx.fillStyle = 'black';
  ctx.beginPath();
  ctx.arc(101, 102, 2, 0, Math.PI * 2, true);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(89, 102, 2, 0, Math.PI * 2, true);
  ctx.fill();
}
