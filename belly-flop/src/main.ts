const m2f = (midi_note: number) => 440.0 * Math.pow(2, (midi_note - 69) / 12.0)

const [C4, G4] = [60, 67]
const [E4, B4] = [64, 71]
const [D4, A4] = [62, 69]

const A3 = 57
const F3 = 53


class Aa {

  enable = false

  static init() {
    let cx = new AudioContext()

    const sfx = () => {
      let ct = cx.currentTime
      let at = 0.1
      let dcy = 0.15
      let sus = 0.2
      let rels = 0.25
      let sst_lvl = 2
      let dcy_lvl = 1.6

      let slp = 0.2

      let note = A4

      let pttn = '12021'.split('')

      let last_index = pttn.length - 1

      let osc1 = cx.createOscillator()
      osc1.type = 'sawtooth'
      let osc2 = cx.createOscillator()
      osc2.type = 'sawtooth'

      osc1.frequency.setValueAtTime(m2f(note), ct)
      osc2.frequency.setValueAtTime(m2f(note + 12), ct)
      //osc1.detune.setValueAtTime(-0.3, ct)
      //osc2.detune.setValueAtTime(0.3, ct)


      let lpf = cx.createBiquadFilter()
      lpf.type = 'lowpass'

      let hpf = cx.createBiquadFilter()
      hpf.type = 'highpass'
 

      //let panner = cx.createStereoPanner()
      //panner.pan.setValueAtTime(0, ct)

      let cmprsr = cx.createDynamicsCompressor()
      cmprsr.threshold.setValueAtTime(0, ct)
      cmprsr.ratio.setValueAtTime(6, ct)
      cmprsr.attack.setValueAtTime(0.003, ct)
      cmprsr.release.setValueAtTime(0.25, ct)


      let gain1 = cx.createGain()
      let gain2 = cx.createGain()

      osc1.connect(gain1)
      osc2.connect(gain2)

      gain1.connect(lpf)
      gain2.connect(lpf)

      gain1.connect(hpf)
      gain2.connect(hpf)

      lpf.connect(cmprsr)
      hpf.connect(cmprsr)

      let gain = cx.createGain()
      cmprsr.connect(gain)
      gain.connect(cx.destination)

      osc1.start()
      osc2.start()


      let arryhtm = 0.6

      const loop = (et: number) => {
        pttn.forEach((note, index) => {

          let t = et + index * (at + dcy + rels + slp)

          lpf.frequency.setValueAtTime(10, t)
          lpf.frequency.exponentialRampToValueAtTime(130, t + dcy)
 
          hpf.frequency.setValueAtTime(10, t)
          hpf.frequency.exponentialRampToValueAtTime(130, t + dcy)

          if (note === '1') {

            gain2.gain.setValueAtTime(0, t)
            gain1.gain.setValueAtTime(0, t)
            gain1.gain.linearRampToValueAtTime(sst_lvl * 1.5, t + at)
            gain1.gain.exponentialRampToValueAtTime(dcy_lvl, t + at + dcy)
            gain1.gain.exponentialRampToValueAtTime(sst_lvl, t + at + dcy + sus)
            gain1.gain.linearRampToValueAtTime(epsi, t + at + dcy + sus + rels)
          } else if (note === '2') {
            gain1.gain.setValueAtTime(0, t)
            gain2.gain.setValueAtTime(0, t)
            gain2.gain.linearRampToValueAtTime(sst_lvl * 1.5, t + at)
            gain2.gain.exponentialRampToValueAtTime(dcy_lvl, t + at + dcy)
            gain2.gain.exponentialRampToValueAtTime(sst_lvl, t + at + dcy + sus)
            gain2.gain.linearRampToValueAtTime(epsi, t + at + dcy + sus + rels)
          }
        })

        let n_et = et + (last_index + 1) * (at + dcy + rels + slp)

        //let ct = cx.currentTime
        //n_et -= (n_et - ct) * Math.sin((n_et - ct) * arryhtm) * 0.01

        setTimeout(() => loop(n_et), 0)

      }
      loop(ct)

      /*
      setTimeout(() => {
        osc1.stop()
        osc2.stop()
        gain.disconnect()
      }, dur_sec * 1000)
      */
    }

    let res = new Aa(sfx)

    return res
  }

  constructor(readonly sfx: () => void) {}


  psfx() {
    if (!this.enable) {
      return
    }

    this.sfx()
  }


}


/* https://chat.openai.com/share/1fcd05cf-4e17-47ed-9143-8380d46b818b */
// Create a Proxy around the Graphics instance
const _gProxy = (g: Gg) => new Proxy(g, {
    // @ts-ignore
    drawEnabled: true,
    
    get(target, prop) {
        if (prop === 'if') {
            return (condition: boolean) => {

                // @ts-ignore
                this.drawEnabled = condition;
            };

          } else if (prop === 'else') {

            return () => {
              // @ts-ignore
              this.drawEnabled = !this.drawEnabled
            }
                // @ts-ignore
        } else if (typeof target[prop] === 'function') {
            return (...args: any[]) => {
                // @ts-ignore
                if (this.drawEnabled) {
                    // @ts-ignore
                    return target[prop](...args);
                }
            };
        } else {
            // @ts-ignore
            return target[prop];
        }
    }
});



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
  else() {
  //  throw new Error("Method not implemented.");
  }

  if(_scn1: boolean) {
  //  throw new Error("Method not implemented.");
  }

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
  sml2() {
    this.cx.font = '72px Courier New'
  }
  sml() {
    this.cx.font = '96px Courier New'
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
    this.cx.arc(x, y, r, 0, pi2)
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

  fr_c(x: number, y: number, w: number, h: number) {
    this.cx.fillRect(x - w/2, y - h/2, w, h)
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
const lght = '#d7d9db'
const plp = '#942890'

/* https://chat.openai.com/share/f4ff1e1b-f9e4-468f-8b7d-1c05ddd20dde */
function adjustSaturation(originalColorHex: string, saturationChange: number) {
    // Convert the original color to an RGBA format
    const r = parseInt(originalColorHex.substring(1, 3), 16);
    const g = parseInt(originalColorHex.substring(3, 5), 16);
    const b = parseInt(originalColorHex.substring(5, 7), 16);
    const a = 1; // Alpha channel (fully opaque)

    // Calculate the adjusted color by shifting the RGB values
    const adjustedR = Math.min(255, Math.max(0, Math.round(r + (r * saturationChange))));
    const adjustedG = Math.min(255, Math.max(0, Math.round(g + (g * saturationChange))));
    const adjustedB = Math.min(255, Math.max(0, Math.round(b + (b * saturationChange))));

    // Create the adjusted color in RGBA format
    const adjustedColor = `rgba(${adjustedR}, ${adjustedG}, ${adjustedB}, ${a})`;

    return adjustedColor;
}

const _sat = (c: string) => adjustSaturation(c, 0.8)
const _l_sat = (c: string) => adjustSaturation(c, -0.8)

const l_bgn = _l_sat(bgn)
const l_red = _l_sat(red)
const l_prpl = _l_sat(prpl)
const l_lprpl = _l_sat(lprpl)
const l_lyllw = _l_sat(lyllw)
const l_yllw = _l_sat(yllw)
const l_grn = _l_sat(grn)
const l_blu = _l_sat(blu)
const l_lght = _l_sat(lght)
const l_plp = _l_sat(plp)

const m_bgn = _sat(bgn)
const m_red = _sat(red)
const m_prpl = _sat(prpl)
const m_lprpl = _sat(lprpl)
const m_lyllw = _sat(lyllw)
const m_yllw = _sat(yllw)
const m_grn = _sat(grn)
const m_blu = _sat(blu)
const m_lght = _sat(lght)
const m_plp = _sat(plp)



const gor = 1.61803;
const epsi = 1e-4;

const pi = Math.PI
const pi2 = pi * 2
const hp = pi / 2
const h3p = pi / 3
const hhp = pi / 4
const h8p = pi / 8
const h16p = pi / 16
const h64p = pi / 64


let dt = 16 
let life = dt

function app(e: HTMLElement) {

  let [_g, c] = Gg.init(e)
  let m = Mm.init(c)
  let g = _gProxy(_g)
  let adio = Aa.init()

  let last_t: number | undefined;
  window.requestAnimationFrame(step)
  function step(t: number) {
    loop(m, g, adio)


    dt = t - (last_t ?? (t - 16))
    last_t = t
    life += dt
    window.requestAnimationFrame(step)
  }
}

function sum(a: number[]) {
  return a.reduce((a, b) => a + b, 0)
}

const juicyNoise = (x: number) => {
    const sinValue = Math.sin(x * 10);
    const cosValue = Math.cos(x * 20);
    return (sinValue + cosValue) / 2;
};


const lin = (x: number) => x
const sin = (x: number) => Math.sin(x)
const cos = (x: number) => Math.cos(x)
const sqr = (x: number) => x < 0.5 ? 0 : 1
const saw = (x: number) => x % 0.5

const _mod_13 = (f: (x: number) => number) => (x: number) => f(x % 13 / 13)

const e_lin = _mod_13((x: number) => x)
const e_sin = _mod_13((x: number) => sin(x * pi2))
const e_cos = _mod_13((x: number) => cos(x * pi2))
const e_sqr = _mod_13((x: number) => sqr(x))
const e_saw = _mod_13((x: number) => saw(x))


const hi = false
const lo = false
const hi_lo = <A>(h: A, m: A, l: A) => hi ? h : lo ? l : m

const rnd19 = () => Math.random() * 19

const _rnd_13 = <A>(f: (v: number) => A) => f(rnd19() % 13 / 13)

const fls = <A>(h: A, l: A) => _rnd_13((v: number) => (life * 0.000003 % v) / (v * 1.2) < 0.5 ? h : l)


const e_sex = _mod_13((x: number) => fls(x, x * 2) * 0.1 + e_sin(x) * 0.3 + 0.7 * e_sin(x * x * pi2 * pi2))

const e_nine = _mod_13((x: number) => fls(x, x * 2) * 0.1 + e_sin(x) * 0.3 + 0.7 * e_sin(x * x * pi2 * pi2))


const _one = () => {
  let on = true
  return (x: number) => {
    if (x <= epsi) {
      on = false
    }

    return on
  }
}

const _cap1 = () => {
  let capped = false
  return (x: number) => {
    if (x > 1 - epsi) {
      capped = true
    }

    return (capped && 1) || x
  }
}

const caps_1 = [...Array(20).keys()].map(_ => _cap1())

const p_nt_lod = _one()

const _tr = (dur: number = 1000) => {
  let e = 0
  return (b: number) => {
    e += dt

    let t = Math.min(1, e / dur)
    return lerp(b, t)
  }
}


const lerp = (b: number, t: number) => {
  return b * t
}


const tr_ = _tr()

let scn = 'ply'

let first_update = false
let first_interaction = false

function loop(m: Mm, g: Gg, adio: Aa) {

  let a = 38, a3 = a * 3, a8 = a * 8


  let u_angle = sin(life * 0.003) * h64p
  let u_s_f40 = sin(life * 0.02) * h64p


  if (!first_update) {
    first_update = true





  }

  if (!first_interaction) {
    if (m.down_p) {
      first_interaction = true
      adio.enable = true

      adio.psfx()
    }
  }


  /* Background */

 g.if(true) /* bg always */

  g.fc(bgn)
  g.fr(0, 0, w, h)

  let r = 40


  g.sc(l_lyllw)
  g.bp(4)
  for (let i = 0; i < 14; i++) {
    g.dot(500 + e_sin(i+u_angle * u_angle * 3000) * r, 600 + e_cos(-i/2) * r * 2, 10)
  }
  g.ep()



  g.sc(l_blu)
  g.bp(4)
  for (let i = 0; i < 14; i++) {
    g.dot(hw + e_cos(i) * e_cos(u_angle * 10) * r, hh + e_sin(i) * u_angle * 10 * r * 2, 10)
  }
  g.ep()

 g.if(scn == 'ntr' || scn == 'trs') /* intro */


  let ld = e_lin(life * 0.007)
  g.sc(bgn)
  g.bp(2)
  g.fc(l_bgn)
  g.fr_c(hw, hh, 100 + ld * 1920, 30)
  g.m2(hw, hh)
  g.l2(hw + 100, hh)
  g.ep()
     

 g.if(scn == 'trs') /* transition */



 g.if(scn == 'ply') /* play */

  g.sc(_l_sat('#cdcddc'))
  g.bp(3)
  for (let i = 1; i < 13; i++) {
    g.dot(100 + e_sqr(i + life * 0.003) * 100, 0 + e_lin(i) * 1080, 8)
  }
  g.ep()

  g.sc(_l_sat('#cdcddc'))
  g.bp(3)
  for (let i = 1; i < 13; i++) {
    g.dot(w - a8 - a3 + e_sex(i + life * 0.003) * 100, 0 + e_lin(i) * 1080, 8)
  }
  g.ep()

  g.sc(_l_sat('#cdcddc'))
  g.bp(3)
  for (let i = 1; i < 13; i++) {
    g.dot(hw - a3 + e_nine(- i + life * 0.003) * 100, 0 + e_lin(i) * 1080, 8)
  }
  g.ep()




  /* Foreground */

  const hi_lo_red = hi_lo(m_red, red, l_red)

  g.sc(hi_lo_red)
  g.bp()


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
  let hovering2 = m.hovering(btn_x, btn_y, 360)
  let hovering = m.hovering(btn_x, btn_y, 120)
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
    g.fc(m_yllw)
    g.str('dice', 0, 0)
  } else {
    g.str('dice', 0, -30)
  }
  g.rsto()

  g.fc(l_yllw)
  g.sc(fls(l_yllw, yllw))
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


  g.sc(l_grn)
  g.save()
  g.rotate(0, hw - a3, hh + a3)
  g.sr(513, 178)
  g.rsto()


  g.bp()

  g.fc(l_grn)

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


  g.sc(yllw)
  g.bp()
  g.dot(hw + a8 - a3, a3, 60)

  g.m2(hw + a8 - a3, a3)

  g.ep()


  g.save()
  g.bp()
  g.sc(lght)
  g.rotate(-hp * 0.5, a + 100, a)
  g.m2(0, 0)
  for (let i = 0; i < e_lin(life * 0.03) * 13; i++) {
    g.l2(e_saw(i * 250) * 130, e_sin(i * 0.3) * 540)
  }
  g.ep()
  g.rsto()


  g.if(true) /* always */

  g.fc(m_blu)
  g.lrg()
  g.str('belly basket', hw, 0)

  let tm = 0.5
  let lm = 1.2
  let sp = 1.3

  g.fc(blu)
  g.sml()
  g.str('wind', w - a3 * lm, a3 * sp - a3 * tm)
  g.fc(l_prpl)
  g.fr(w - a8 + 5, a3 * sp - a3 * tm - 20, a8 - 15, 5)
  g.fr(w - a8 + 5, a3 * sp - a3 * tm + a3, a8 - 15, 5)

  g.fr(w - a8 + 5 + a8 - 15, a3 * sp - a3 * tm - 20, 5, a3 * 8 - 32)


  g.fc(yllw)
  g.sml()
  g.str('sun', w - a3 * lm, a3 * sp * 2 - a3 * tm)

  g.fc(l_prpl)
  g.fr(w - a8 + 5, a3 * sp * 2 - a3 * tm + a3, a8 - 15, 5)

  g.fc(grn)
  g.sml2()
  g.str('plant', w - a3 * lm, a3 * sp * 3 - a3 * tm)


  g.fc(l_prpl)
  g.fr(w - a8 + 5, a3 * sp * 3 - a3 * tm + a3, a8 - 15, 5)

  g.fc(plp)
  g.sml()
  g.str('seed', w - a3 * lm, a3 * sp * 4 - a3 * tm)


  g.fc(l_prpl)
  g.fr(w - a8 + 5, a3 * sp * 4 - a3 * tm + a3, a8 - 15, 5)

  g.fc(prpl)
  g.str('root', w - a3 * lm, a3 * sp * 5 - a3 * tm)


  g.fc(l_prpl)
  g.fr(w - a8 + 5, a3 * sp * 5 - a3 * tm + a3, a8 - 15, 5)

  g.fc(lght)
  g.str('ch4', w - a3 * lm, a3 * sp * 6 - a3 * tm)


  g.fc(l_prpl)
  g.fr(w - a8 + 5, a3 * sp * 6 - a3 * tm + a3, a8 - 15, 5)


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
  
}


app(document.getElementById('app')!)


function calc_dist(x: number, y: number, x2: number, y2: number) {
  let dx = x - x2
  let dy = y - y2

  return Math.sqrt(dx * dx + dy * dy)
}

const sml_distance = 100
const lrg_distance = 300
