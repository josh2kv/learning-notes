const $canvas = document.getElementById("c");
const c = $canvas.getContext("2d");

// c.beginPath(); // 새로운 path를 시작함
// c.moveTo(20, 20); // 새로운 subpath의 시작점
// c.lineTo(120, 120); // 새로운 subpath의 시작점에서 끝점으로 선을 그림
// c.lineTo(20, 120); // 또 다른 subpath의 시작점(이전 subpath의 끝점)에서 끝점으로
// c.closePath(); // 닫는 stroke를 추가

// c.moveTo(300, 100); // Begin a new subpath at (300,100)
// c.lineTo(300, 200); // Draw a vertical line to (300,200)

// c.fillStyle = "#ccc";
// c.strokeStyle = "#008";
// c.lineWidth = 2;
// c.fill();
// c.stroke();

// 중심이 (x, y), 반지름이 r인 원의 둘레에 꼭지점이 위치하는 정다각형을 그리는 함수
function polygon(c, n, x, y, r, angle = 0, counterclockwise = false) {
    // 첫 꼭지점의 위치를 계산하고 그 점에서 subpath를 시작함
    // 첫 꼭지점은 원의 12시 지점 또는 거기서 주어진 angle만큼 이동한 지점
    c.moveTo(x + r * Math.sin(angle), y - r * Math.cos(angle));

    // 꼭지점의 사잇각
    const delta = (2 * Math.PI) / n;

    for (let i = 1; i < n; i++) {
        // subpath들을 이어갈 방향을 결정
        angle += counterclockwise ? -delta : delta;

        // 다음 꼭지점 위치를 결정하고 그 위치로 선을 그음
        c.lineTo(x + r * Math.sin(angle), y - r * Math.cos(angle));
    }

    // 마지막 꼭지점에서 첫 꼭지점으로 연결
    c.closePath();
}

const degToRad = (deg = 0) => {
    return (Math.PI * deg) / 180;
};

const CENTER_X = 150;
const CENTER_Y = 100;
const RADIUS = 50;

// 중심이 되는 원을 그림
c.beginPath();
c.arc(CENTER_X, CENTER_Y, RADIUS, 0, degToRad(360), true);
c.strokeStyle = "green";
c.stroke();

// 정다각형을 그림
c.beginPath();
polygon(c, 5, CENTER_X, CENTER_Y, RADIUS, degToRad(30));
polygon(c, 5, CENTER_X, CENTER_Y, 20, degToRad(30), true);
c.fillStyle = "#ccc";
c.strokeStyle = "#008";
c.lineWidth = 2;
c.fill();
c.stroke();

// 중심에 점을 찍음
c.beginPath();
c.arc(CENTER_X, CENTER_Y, 2, 0, 2 * Math.PI, true);
c.fillStyle = "red";
c.fill();
