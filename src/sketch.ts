import p5 from "p5";
import { PLAYER_1 as SP1, PLAYER_2 as SP2 } from "@rcade/plugin-input-spinners";

// Rcade game dimensions
const WIDTH = 336;
const HEIGHT = 262;

const SPIN1 = SP1.SPINNER;
const SPIN2 = SP2.SPINNER;

const CLOCK_R = 150;
const CLOCK_NUM_R = 63;
const HAND_MIN_R = 55;
const HAND_HOUR_R = 35;

const MODERN_ERA = new Date(2000, 0, 1);

const sketch = (p: p5) => {
  let origin: p5.Vector;
  let ancient_bg: p5.Image;
  let offset_millis: number;
  let noon_angle: number;

  p.preload = () => {
    ancient_bg = p.loadImage("public/ancient.jpg");
  };

  p.setup = () => {
    p.createCanvas(WIDTH, HEIGHT);
    origin = p.createVector(WIDTH / 2, HEIGHT / 2);
    offset_millis = 0;
    noon_angle = (p.TAU * 3) / 4;
  };

  p.draw = () => {
    // time
    offset_millis += SPIN1.consume_step_delta() * 100000;
    offset_millis += SPIN2.consume_step_delta() * 1000000000;
    const time = new Date(Date.now() + offset_millis);

    // draw setup
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(14);

    // bg
    if (time > MODERN_ERA) {
      p.background(26, 26, 46);
      p.fill("white");
      p.text(time.toLocaleString(), origin.x, origin.y - 110);
      p.text("P1 spin: age", origin.x - 60, origin.y + 100);
      p.text("P2 spin: warp", origin.x + 60, origin.y + 100);
    } else {
      p.image(ancient_bg, 0, 0, WIDTH, HEIGHT);
      p.fill("black");
      p.text(time.toLocaleString(), origin.x, origin.y - 110);
      p.fill("white");
      p.text("Ancient History", origin.x, origin.y + 100);
      p.fill(255, 255, 255, 128);
    }

    // face
    p.circle(origin.x, origin.y, CLOCK_R);

    // numbers
    p.textSize(12);
    p.fill("black");
    let angle = noon_angle;
    for (let hour_num = 1; hour_num <= 12; hour_num++) {
      angle += p.TAU / 12;
      p.text(
        String(hour_num),
        origin.x + CLOCK_NUM_R * p.cos(angle),
        origin.y + CLOCK_NUM_R * p.sin(angle),
      );
    }

    // hands
    let millis = time.getTime() + time.getTimezoneOffset() * -60 * 1000;

    let hour = (millis / (1000 * 60 * 60)) % 12;
    let hour_offset_angle = (p.TAU / 12) * hour;
    let hour_angle = noon_angle + hour_offset_angle;
    p.line(
      origin.x,
      origin.y,
      origin.x + HAND_HOUR_R * p.cos(hour_angle),
      origin.y + HAND_HOUR_R * p.sin(hour_angle),
    );

    let minute = (millis / (1000 * 60)) % 60;
    let minute_offset_angle = (p.TAU / 60) * minute;
    let minute_angle = noon_angle + minute_offset_angle;
    p.line(
      origin.x,
      origin.y,
      origin.x + HAND_MIN_R * p.cos(minute_angle),
      origin.y + HAND_MIN_R * p.sin(minute_angle),
    );
  };
};

new p5(sketch, document.getElementById("sketch")!);
