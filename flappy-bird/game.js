const cvs = document.getElementById("bird");
const ctx = cvs.getContext("2d");
//game vars
let frames = 0;
var img = new Image(); // Create new img element
img.src = "sprite.png";
const degree = Math.PI / 180;
// game state
const state = {
  current: 0,
  getready: 0,
  ingame: 1,
  over: 2,
};
const startbtn = {
  x: 120,
  y: 263,
  w: 83,
  h: 29,
};
const die_s = new Audio();
die_s.src = "audio/sfx_die.wav";
const flap_s = new Audio();
flap_s.src = "audio/sfx_flap.wav";
const score_s = new Audio();
score_s.src = "audio/sfx_point.wav";
const hit_s = new Audio();
hit_s.src = "audio/sfx_hit.wav";
const swooshing_s = new Audio();
swooshing_s.src = "audio/sfx_swooshing.wav";
//control the game
cvs.addEventListener("click", function (evt) {
  switch (state.current) {
    case state.getready:
      state.current = state.ingame;
      swooshing_s.play();
      break;
    case state.ingame:
      bird.flap();
      flap_s.play();
      break;
    case state.over:
      let rect = cvs.getBoundingClientRect();
      let clickX = evt.clientX - rect.left;
      let clickY = evt.clientY - rect.top;
      if (
        clickX >= startbtn.x &&
        clickX <= startbtn.x + startbtn.w &&
        clickY >= startbtn.y &&
        clickY <= startbtn.y + startbtn.h
      ) {
        pipes.reset();
        bird.speedreset();
        score.reset();
        state.current = state.getready;
      }

      break;
  }
});
const bg = {
  sx: 0,
  sy: 0,
  w: 275,
  h: 226,
  x: 0,
  y: cvs.height - 226,
  draw: function () {
    ctx.drawImage(
      img,
      this.sx,
      this.sy,
      this.w,
      this.h,
      this.x,
      this.y,
      this.w,
      this.h
    );
    ctx.drawImage(
      img,
      this.sx,
      this.sy,
      this.w,
      this.h,
      this.x + this.w,
      this.y,
      this.w,
      this.h
    );
  },
};
const fg = {
  sx: 276,
  sy: 0,
  w: 224,
  h: 112,
  x: 0,
  y: cvs.height - 112,
  dx: 2,
  draw: function () {
    ctx.drawImage(
      img,
      this.sx,
      this.sy,
      this.w,
      this.h,
      this.x,
      this.y,
      this.w,
      this.h
    );
    ctx.drawImage(
      img,
      this.sx,
      this.sy,
      this.w,
      this.h,
      this.x + this.w,
      this.y,
      this.w,
      this.h
    );
  },
  update: function () {
    if (state.current == state.ingame) {
      this.x = (this.x - this.dx) % (this.w / 2);
    }
  },
};
// bird
const bird = {
  animation: [
    { sx: 276, sy: 112 },
    { sx: 276, sy: 139 },
    { sx: 276, sy: 164 },
    { sx: 276, sy: 139 },
  ],
  x: 50,
  y: 150,
  w: 34,
  h: 26,
  frame: 0,
  gravity: 0.25,
  jump: 4.6,
  speed: 0,
  rotation: 0,
  radius: 20,
  draw: function () {
    let bird = this.animation[this.frame];
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.drawImage(
      img,
      bird.sx,
      bird.sy,
      this.w,
      this.h,
      -this.w / 2,
      -this.h / 2,
      this.w,
      this.h
    );
    ctx.restore();
  },
  flap: function () {
    this.speed = -this.jump;
  },
  update: function () {
    this.period = state.current == state.getready ? 10 : 5;
    this.frame += frames % this.period == 0 ? 1 : 0;
    this.frame = this.frame % this.animation.length;
    if (state.current == state.getready) {
      this.y = 150; //reset
      this.rotation = 0 * degree;
    } else {
      this.speed += this.gravity;
      this.y += this.speed;
      if (this.y + this.h / 2 >= cvs.height - fg.h) {
        this.y = cvs.height - fg.h - this.h / 2;
        if (state.current == state.ingame) {
          state.current = state.over;
          die_s.play();
        }
      }
      if (this.speed >= this.jump) {
        this.rotation = 90 * degree;
        this.frame = 1;
      } else {
        this.rotation = -25 * degree;
      }
    }
  },
  speedreset: function () {
    this.speed = 0;
  },
};
//get ready
const getready = {
  sx: 0,
  sy: 228,
  w: 173,
  h: 152,
  x: cvs.width / 2 - 173 / 2,
  y: 80,
  draw: function () {
    if (state.current == state.getready) {
      ctx.drawImage(
        img,
        this.sx,
        this.sy,
        this.w,
        this.h,
        this.x,
        this.y,
        this.w,
        this.h
      );
    }
  },
};
//gameover
const gameover = {
  sx: 175,
  sy: 228,
  w: 225,
  h: 202,
  x: cvs.width / 2 - 225 / 2,
  y: 90,
  draw: function () {
    if (state.current == state.over) {
      ctx.drawImage(
        img,
        this.sx,
        this.sy,
        this.w,
        this.h,
        this.x,
        this.y,
        this.w,
        this.h
      );
    }
  },
};
const pipes = {
  position: [],
  top: {
    sx: 553,
    sy: 0,
  },
  bottom: {
    sx: 502,
    sy: 0,
  },
  w: 53,
  h: 400,
  gap: 85,
  maxYpos: -150,
  dx: 2,
  draw: function () {
    for (let i = 0; i < this.position.length; i++) {
      let p = this.position[i];
      let topYpos = p.y;
      let bottomYpos = p.y + this.h + this.gap;
      ctx.drawImage(
        img,
        this.top.sx,
        this.top.sy,
        this.w,
        this.h,
        p.x,
        topYpos,
        this.w,
        this.h
      );
      ctx.drawImage(
        img,
        this.bottom.sx,
        this.bottom.sy,
        this.w,
        this.h,
        p.x,
        bottomYpos,
        this.w,
        this.h
      );
    }
  },
  update: function () {
    if (state.current !== state.ingame) return;
    if (frames % 100 == 0) {
      this.position.push({
        x: cvs.width,
        y: this.maxYpos * (Math.random() + 1),
      });
    }
    for (let i = 0; i < this.position.length; i++) {
      let p = this.position[i];
      let bottomPipeypos = p.y + this.h + this.gap;
      if (
        bird.x + bird.radius > p.x &&
        bird.x - bird.radius < p.x + this.w &&
        bird.y + bird.radius > p.y &&
        bird.y - bird.radius < p.y + this.h
      ) {
        state.current = state.over;
        hit_s.play();
      }
      //botttom pipes
      if (
        bird.x + bird.radius > p.x &&
        bird.x - bird.radius < p.x + this.w &&
        bird.y + bird.radius > bottomPipeypos &&
        bird.y - bird.radius < bottomPipeypos + this.h
      ) {
        state.current = state.over;
        hit_s.play();
      }

      p.x -= this.dx;
      if (p.x + this.w <= 0) {
        this.position.shift();
        score.value += 1;
        score_s.play();
        score.best = Math.max(score.value, score.best);
        localStorage.setItem("best", score.best);
      }
    }
  },
  reset: function () {
    this.position = [];
  },
};
const score = {
  best: parseInt(localStorage.getItem("best")) || 0,
  value: 0,
  draw: function () {
    ctx.fillStyle = "#fff";
    ctx.strokestyle = "#000";
    if (state.current == state.ingame) {
      ctx.lineWidth = 2;
      ctx.font = "35px poppins";
      ctx.fillText(this.value, cvs.width / 2, 50);
      ctx.strokeText(this.value, cvs.width / 2, 50);
    } else if (state.current == state.over) {
      ctx.font = "25px poppins";
      ctx.fillText(this.value, 225, 186);
      ctx.strokeText(this.value, 225, 186);
      ctx.fillText(this.best, 225, 228);
      ctx.strokeText(this.best, 225, 228);
    }
  },
  reset: function () {
    this.value = 0;
  },
};
//draw
const draw = () => {
  ctx.fillStyle = "#70c5ce";
  ctx.fillRect(0, 0, cvs.width, cvs.height);
  bg.draw();
  pipes.draw();
  fg.draw();
  bird.draw();
  getready.draw();
  gameover.draw();
  score.draw();
};
const update = () => {
  fg.update();
  bird.update();
  pipes.update();
};

const loop = () => {
  update();
  draw();
  frames++;
  requestAnimationFrame(loop);
};
loop();
