class Mm {
  static init(c: HTMLCanvasElement) {

    let bounds = c.getBoundingClientRect()

    window.addEventListener('resize', () => {
      bounds = c.getBoundingClientRect()
    })

    const ev_p = (e: MouseEvent | TouchEvent): [number, number] => {
      if (e instanceof MouseEvent) {
        return [e.clientX, e.clientY]
      } else {
        return [e.touches[0].clientX, e.touches[0].clientY]
      }
    }

    const with_b = (p: [number, number]): [number, number] => {
      return [(p[0] - bounds.left) / bounds.width * w, (p[1] - bounds.top) / bounds.height * h]
    }

    let res = new Mm()

    const on_down = (e: MouseEvent | TouchEvent) => {
      res.on_down(with_b(ev_p(e)))
    }
    const on_move = (e: MouseEvent | TouchEvent) => {
      res.on_move(with_b(ev_p(e)))
    }
    const on_up = (e: MouseEvent | TouchEvent) => {
      res.on_up(with_b(ev_p(e)))
    }

    window.addEventListener('mousedown', on_down)
    window.addEventListener('touchstart', on_down)
    window.addEventListener('mousemove', on_move)
    window.addEventListener('touchmove', on_move)
    window.addEventListener('mouseup', on_up)
    window.addEventListener('touchend', on_up)

    return res
  }

  hovering(x: number, y: number, d: number = sml_distance) {
    if (this.move_p) {
      return calc_dist(x, y, ...this.move_p) <= d
    }
    return false
  }

  move_p?: [number, number]
  down_p?: [number, number]
  last_up_p?: [number, number]
  last_down_p?: [number, number]

  on_move(e: [number, number]) {
    this.move_p = e
  }

  on_down(e: [number, number]) {
    this.down_p = e
  }

  on_up(e: [number, number]) {
    this.last_up_p = e
    this.last_down_p = this.down_p
    this.down_p = undefined
  }
}

class Gg {
  static init(e: HTMLElement): [Gg, HTMLCanvasElement] {
    let c = document.createElement('canvas');
    c.width = w
    c.height = h

    let cx = c.getContext('2d')!

    e.appendChild(c)

    return [new Gg(cx), c]
  }

  constructor(readonly cx: CanvasRenderingContext2D) {}



  sc(c: string) {
    this.cx.strokeStyle = c
  }

  fc(c: string) {
    this.cx.fillStyle = c
  }
  sml() {
    this.cx.font = '100px Courier New'
  }
  lrg() {
    this.cx.font = '148px Courier New'
  }
  str(t: string, x: number, y: number) {
    this.cx.textAlign = 'center'
    this.cx.textBaseline = 'top'
    this.cx.fillText(t, x, y)
  }

  clin(x: number, y: number, w: number) {
    this.cx.moveTo(x - w, y)
    this.cx.lineTo(x + w, y)
  }

  dot(x: number, y: number, r: number = 100) {
    this.cx.arc(x, y, r, 0, pi)
  }

  bp(w: number = 8) {
    this.cx.lineWidth = w
    this.cx.beginPath()
  }

  sbp() {
    this.cx.lineWidth = 4
    this.cx.beginPath()
  }

  ep() {
    this.cx.stroke()
  }

  m2(x: number, y: number) {
    this.cx.moveTo(x, y)
  }

  l2(x: number, y: number) {
    this.cx.lineTo(x, y)
  }


  fr(x: number, y: number, w: number, h: number) {
    this.cx.fillRect(x, y, w, h)
  }

  sr(w: number, h: number) {
    this.cx.strokeRect(-w/2, -h/2, w, h)
  }

  save() {
    this.cx.save()
  }

  rsto() {
    this.cx.restore()
  }

  rotate(r: number, w: number = 0, h: number = 0) {
    this.cx.translate(w, h)
    this.cx.rotate(r)
  }

}


const w = 1920
const h = 1080
const hw = w / 2
const hh = h / 2
const h2w = hw / 2
const h2h = hw / 2
const h3w = hw / 3
const h3h = hh / 3
const h4w = hw / 4
const h4h = hh / 4
const h8w = hw / 8
const h8h = hh / 8

const h2p8w = h2w + h8w


const bgn = '#1e1b22'
const red = '#5d1320'
const prpl = '#7431e3'
const lprpl = '#e331da'
const lyllw = '#e3cd31'
const yllw = '#dacf80'
const grn = '#60e331'
const blu = '#319ae3'


const gor = 1.61803;
const epsi = 1e-5;

const pi = Math.PI
const pi2 = pi * 2
const hp = pi / 2
const h3p = pi / 3
const hhp = pi / 4
const h8p = pi / 8
const h16p = pi / 16
const h64p = pi / 64


let life = 0
let dt = 0

function app(e: HTMLElement) {

  let [g, c] = Gg.init(e)
  let m = Mm.init(c)

  let last_t: number | undefined;
  window.requestAnimationFrame(step)
  function step(t: number) {
    loop(m, g)


    dt = t - (last_t ?? t)
    last_t = t
    life += dt
    window.requestAnimationFrame(step)
  }
}

function sm_sin(v: number, f = 0.003) {
  return Math.sin(life * f) * v
}

function sum(a: number[]) {
  return a.reduce((a, b) => a + b, 0)
}

const juicyNoise = (x: number) => {
    const sinValue = Math.sin(x * 10);
    const cosValue = Math.cos(x * 20);
    return (sinValue + cosValue) / 2;
};

function loop(m: Mm, g: Gg) {

  let x_brsh = [...Array(10).keys()].map(i => juicyNoise(i))
  let y_brsh = [...Array(10).keys()].map(i => juicyNoise(30 - i))

  let u_angle = sm_sin(h64p)
  let u_s_f40 = sm_sin(h64p, 0.02)


  g.fc(bgn)
  g.fr(0, 0, w, h)

  g.sc(red)
  g.bp()

  let a = 38, a3 = a * 3, a8 = a * 8

  g.m2(a, a)
  g.l2(w - a8, a)
  g.l2(w - a8, hh + a3)
  g.l2(a, hh + a3)
  g.l2(a, a)

  g.m2(a, hh + a3)
  g.l2(a, h - a)
  g.l2(w - a8, h - a)
  g.l2(w - a8, hh + a3)

  g.ep()



  let [btn_x, btn_y] = [hw - h2w - h4w, hh + 2 * h3h]
  let hovering2 = m.hovering(btn_x, btn_y, 320)
  let hovering = m.hovering(btn_x, btn_y, 280)
  let color = hovering ? red : yllw

  g.fc(yllw)
  g.sc(color)
  g.save()
  g.rotate(h8p + u_angle, btn_x, btn_y)
  g.sr(300, 100)
  if (hovering) {
    g.str('d', -140 + u_s_f40 * 40, -30)
    g.str('i', -50 + u_s_f40 * 40, -30)
    g.str('c', 50 + u_s_f40 * 40, -30)
    g.str('e', 140 + u_s_f40 * 40, -30)
  } else if (hovering2) {
  } else {
    g.str('dice', 0, 0)
  }
  g.rsto()

  g.fc(yllw)
  g.sc(yllw)
  g.save()
  g.rotate(-h8p + u_angle, hw + h3w + h8w, hh + 2 * h3h)
  g.sr(300, 100)
  g.str('plow', 0, 0)
  g.rsto()




  g.fc(bgn)
  g.save()
  g.rotate(0, hw - a8 - a3, hh + a)
  g.fr(0, 0, 600, 100)
  g.rsto()




  g.sc(grn)
  g.save()
  g.rotate(0, hw - a3, hh + a3)
  g.sr(513, 178)
  g.rsto()


  g.bp()

  g.fc(grn)

  g.str('5', hw - a3 * 3, hh + 30)
  g.clin(    hw - a3 * 3, hh + 30 + 150, 20)
  g.str('5', hw - a3 * 2, hh + 30)
  g.clin(    hw - a3 * 2, hh + 30 + 150, 20)
  g.str('5', hw - a3 * 1, hh + 30)
  g.clin(    hw - a3 * 1, hh + 30 + 150, 20)
  g.str('5', hw - a3 * 0, hh + 30)
  g.clin(    hw - a3 * 0, hh + 30 + 150, 20)
  g.str('5', hw - a3 * -1, hh + 30)
  g.clin(    hw - a3 * -1, hh + 30 + 150, 20)

  g.ep()

  g.fc(blu)
  g.lrg()
  g.str('belly basket', hw, 0)


  let r = 40
  g.save()
  g.sc(red)
  g.bp()
  g.rotate(u_angle * pi, hw, hh)
  for (let i = 0; i < 5; i++) {
    g.rotate(u_angle * i * pi * 2, 0, 0)
    g.m2(0, 0)
    i % 2 === 1 && g.l2(r, r)
    g.m2(0, 0)
    i % 3 === 0 && g.l2(-r, -r)
  }
  g.ep()
  g.rsto()


  g.sc(blu)
  g.bp(4)
  x_brsh.forEach(x =>
    y_brsh.forEach(y => {
      let r = 100
      g.m2(hw + x * r, hh + y * r)
      g.dot(hw + x * r, hh + y * r, 10)
    }))
  g.ep()


  


}


app(document.getElementById('app')!)


function calc_dist(x: number, y: number, x2: number, y2: number) {
  let dx = x - x2
  let dy = y - y2

  return Math.sqrt(dx * dx + dy * dy)
}

const sml_distance = 100
const lrg_distance = 300