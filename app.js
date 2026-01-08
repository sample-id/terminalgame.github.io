/*================  GLOBALS  ================*/
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');
const cursor = document.getElementById('cursorGlow');
let ww = innerWidth, wh = innerHeight;
const particles = [];
const maxParticles = 70;

/*================  UTILS  ================*/
const rand = (min, max) => Math.random() * (max - min) + min;
const resize = () => {
  ww = canvas.width = innerWidth;
  wh = canvas.height = innerHeight;
};
window.addEventListener('resize', resize);
resize();

/*================  PARTICLE CLASS  ================*/
class Particle {
  constructor() {
    this.x = rand(0, ww);
    this.y = rand(0, wh);
    this.z = rand(0, 2000); // depth
    this.vz = rand(.5, 2);
    this.opacity = rand(.3, .8);
    this.size = rand(1, 2);
  }
  update() {
    this.z -= this.vz;
    if (this.z <= 0) {
      this.z = 2000;
      this.x = rand(0, ww);
      this.y = rand(0, wh);
    }
  }
  draw() {
    const sx = (this.x - ww / 2) * (ww / this.z) + ww / 2;
    const sy = (this.y - wh / 2) * (ww / this.z) + wh / 2;
    const r = (ww / this.z) * this.size;
    ctx.beginPath();
    ctx.arc(sx, sy, r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0, 240, 255, ${this.opacity})`;
    ctx.fill();
  }
}
for (let i = 0; i < maxParticles; i++) particles.push(new Particle());

/*================  ANIMATION LOOP  ================*/
function animate() {
  ctx.clearRect(0, 0, ww, wh);
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animate);
}
animate();

/*================  CURSOR GLOW  ================*/
addEventListener('mousemove', e => {
  cursor.style.transform = `translate(${e.clientX - 200}px, ${e.clientY - 200}px)`;
});

/*================  3-D CARD TILT  ================*/
document.querySelectorAll('[data-tilt]').forEach(card => {
  card.addEventListener('mousemove', e => {
    const { left, top, width, height } = card.getBoundingClientRect();
    const x = (e.clientX - left) / width - .5;
    const y = (e.clientY - top) / height - .5;
    card.style.transform = `perspective(1000px) rotateY(${x * 20}deg) rotateX(${-y * 20}deg) scale3d(1.05,1.05,1.05)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) scale3d(1,1,1)';
  });
});

/*================  YEAR AUTO-UPDATE  ================*/
document.getElementById('year').textContent = new Date().getFullYear();
