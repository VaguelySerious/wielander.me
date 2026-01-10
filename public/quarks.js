function random(from, to) {
  return Math.floor(Math.random() * (to - from)) + from
}

function randomFloat(from, to) {
  return Math.random() * (to - from) + from
}

// TODO Use ellipse calculation
function ellipsePerimeter(x, y) {
  const a = Math.max(x, y)
  const b = Math.min(x, y)
  // TODO Better approx
  return 2 * Math.PI * Math.sqrt((a * a + b * b) / 2)
}

class QuarkAnimation {
  constructor(options) {
    // TODO ID or Element
    const ele =
      typeof options.id === 'string' ? document.getElementById(options.id) : ele
    this.canvas = ele
    this.update(options)
  }

  update(options) {
    console.log('Updating quarks.js')
    this.ctx = this.canvas.getContext('2d')
    this.bounds = Object.assign({ x: 100, y: 100 }, options.bounds || {})
    this.offset = Object.assign({ x: 0, y: 0 }, options.offset || {})
    // TODO Optionally accept function that takes intensity and returns color
    this.color = options.color || '0,0,0'
    const count = options.count || 200

    const size = Math.max(this.bounds.x, this.bounds.y)
    this.size = size
    this.maxLength = size / 8
    const points = []
    this.points = points

    // TODO Semi-random distribution around center
    for (let i = 0; i < count; i++) {
      const centerX = random(0, this.bounds.x)
      const centerY = random(0, this.bounds.y)
      const radiusX = random(6, Math.floor(size / 5))
      const radiusY = radiusX
      // const radiusY = random(0, Math.floor(size / 10));
      const speed = random(size / 100, size / 50)
      const pos = randomFloat(0, 2 * Math.PI)
      const direction = Math.random() >= 0.5 ? 1 : -1
      const perimeter = Math.PI * radiusX * 2
      // const perimeter = ellipsePerimeter(point.radiusX, point.radiusY)
      // TODO If any point of the circle outside boudns
      if (false) {
        i--
        continue
      }
      points.push({
        centerX,
        centerY,
        radiusX,
        radiusY,
        speed,
        pos,
        direction,
        perimeter,
      })
    }
  }

  tick() {
    this.points.forEach((p) => {
      p.x = Math.cos(p.pos) * p.radiusX + p.centerX
      p.y = Math.sin(p.pos) * p.radiusY + p.centerY

      const change = p.direction * p.speed
      p.pos = (p.pos + change / p.perimeter) % 360
    })
  }

  draw() {
    const ctx = this.ctx
    const offset = this.offset
    ctx.clearRect(0, 0, 1000, 1000)
    this.points.forEach(({ x, y }) => {
      ctx.fillRect(x - 1 + offset, y - 1 + offset, 3, 3)
      this.points.forEach(({ x: x2, y: y2 }) => {
        const distance = Math.sqrt(Math.pow(x - x2, 2) + Math.pow(y - y2, 2))
        const range = this.maxLength - distance
        const intensity = Math.sqrt(range * (100 / this.maxLength)) * 3
        if (intensity > 0 && intensity < 100) {
          ctx.beginPath()
          ctx.strokeStyle = `rgba(${this.color},${intensity / 100})`
          ctx.moveTo(x + offset.x, y + offset.y)
          ctx.lineTo(x2 + offset.x, y2 + offset.y)
          ctx.stroke()
        }
      })
    })

    if (this.running) {
      this.tick()
      window.requestAnimationFrame(this.draw.bind(this))
    }
  }

  start() {
    this.running = true
    window.requestAnimationFrame(this.draw.bind(this))
  }

  stop() {
    this.running = false
  }
}

window.QuarkAnimation = QuarkAnimation
