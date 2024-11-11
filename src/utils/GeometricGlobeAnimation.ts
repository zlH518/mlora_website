import { TweenLite, Circ } from 'gsap'

export function initNeuralNetworkAnimation() {
  // HTML Structure
  const container = document.getElementById('geo-globe') as HTMLElement
  const canvas = document.getElementById('canvas') as HTMLCanvasElement
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

  // Set canvas size based on the container's dimensions and center it
  canvas.width = 500
  canvas.height = 500
  container.style.display = 'flex'
  container.style.justifyContent = 'center'
  container.style.alignItems = 'center'
  container.style.height = '100vh' // Ensures full viewport height

  // Type Definitions
  interface Point {
    x: number
    originX: number
    y: number
    originY: number
    rad: number
    color: string
    jointo: Point[]
    length: number
    separation: number
    offset: number
    circle: Circle | null
    name?: string
  }

  class Circle {
    constructor(
      public pos: Point,
      public rad: number,
      public color: string,
    ) {}

    draw() {
      ctx.beginPath()
      ctx.arc(this.pos.x, this.pos.y, this.rad, 0, 2 * Math.PI, false)
      ctx.fillStyle = this.color
      ctx.shadowColor = this.color
      ctx.shadowBlur = 15 // Glow effect
      ctx.fill()
      ctx.shadowBlur = 0 // Reset shadow
    }
  }

  // Tooltip element for displaying names on node click
  const tooltip = document.createElement('div')
  tooltip.style.position = 'absolute'
  tooltip.style.padding = '10px'
  tooltip.style.background = 'rgba(65, 60, 168, 0.6)' // Semi-transparent purple effect
  tooltip.style.transition = 'opacity 0.3s'
  tooltip.style.boxShadow = '0px 4px 12px rgba(0, 0, 0, 0.2)' // Subtle shadow effect
  tooltip.style.pointerEvents = 'none'
  tooltip.style.fontSize = '14px'
  tooltip.style.display = 'none'
  tooltip.style.zIndex = '10'
  tooltip.style.transition = 'opacity 0.3s'
  tooltip.style.boxShadow = '0px 4px 12px rgba(0, 0, 0, 0.2)' // Subtle shadow for effect
  container.appendChild(tooltip)

  const dark = '#3f3cbb'
  const light = '#b84ef4'
  const names = ['Salma Filali', '叶正茂', '蔡青松', '黄泽龙', 'Supervisor/明洁']

  // Define points with positions, connections, and names
  const points: Point[] = [
    {
      x: 216,
      originX: 216,
      y: 49,
      originY: 49,
      rad: 4,
      color: dark,
      jointo: [],
      length: 0,
      separation: 0,
      offset: 0,
      circle: null,
      name: names[0],
    },
    {
      x: 125,
      originX: 125,
      y: 95,
      originY: 95,
      rad: 4,
      color: dark,
      jointo: [],
      length: 0,
      separation: 0,
      offset: 0,
      circle: null,
      name: names[1],
    },
    {
      x: 250,
      originX: 250,
      y: 100,
      originY: 100,
      rad: 10,
      color: dark,
      jointo: [],
      length: 0,
      separation: 0,
      offset: 0,
      circle: null,
      name: names[2],
    },
    {
      x: 346,
      originX: 346,
      y: 80,
      originY: 80,
      rad: 4,
      color: dark,
      jointo: [],
      length: 0,
      separation: 0,
      offset: 0,
      circle: null,
      name: names[3],
    },
    {
      x: 51,
      originX: 51,
      y: 182,
      originY: 182,
      rad: 4,
      color: dark,
      jointo: [],
      length: 0,
      separation: 0,
      offset: 0,
      circle: null,
      name: names[4],
    },
    // Additional points without names for spacing
    {
      x: 120,
      originX: 120,
      y: 205,
      originY: 205,
      rad: 6,
      color: dark,
      jointo: [],
      length: 0,
      separation: 0,
      offset: 0,
      circle: null,
    },
    {
      x: 380,
      originX: 380,
      y: 165,
      originY: 165,
      rad: 4,
      color: dark,
      jointo: [],
      length: 0,
      separation: 0,
      offset: 0,
      circle: null,
    },
    {
      x: 420,
      originX: 420,
      y: 190,
      originY: 190,
      rad: 6,
      color: dark,
      jointo: [],
      length: 0,
      separation: 0,
      offset: 0,
      circle: null,
    },
    {
      x: 50,
      originX: 50,
      y: 270,
      originY: 270,
      rad: 3,
      color: dark,
      jointo: [],
      length: 0,
      separation: 0,
      offset: 0,
      circle: null,
    },
    {
      x: 293,
      originX: 293,
      y: 260,
      originY: 260,
      rad: 12,
      color: dark,
      jointo: [],
      length: 0,
      separation: 0,
      offset: 0,
      circle: null,
    },
    {
      x: 65,
      originX: 65,
      y: 320,
      originY: 320,
      rad: 3,
      color: dark,
      jointo: [],
      length: 0,
      separation: 0,
      offset: 0,
      circle: null,
    },
    {
      x: 170,
      originX: 170,
      y: 350,
      originY: 350,
      rad: 9,
      color: dark,
      jointo: [],
      length: 0,
      separation: 0,
      offset: 0,
      circle: null,
    },
    {
      x: 400,
      originX: 400,
      y: 300,
      originY: 300,
      rad: 10,
      color: dark,
      jointo: [],
      length: 0,
      separation: 0,
      offset: 0,
      circle: null,
      name: names[0],
    },
    {
      x: 100,
      originX: 100,
      y: 370,
      originY: 370,
      rad: 6,
      color: dark,
      jointo: [],
      length: 0,
      separation: 0,
      offset: 0,
      circle: null,
    },
    {
      x: 290,
      originX: 290,
      y: 380,
      originY: 380,
      rad: 6,
      color: dark,
      jointo: [],
      length: 0,
      separation: 0,
      offset: 0,
      circle: null,
    },
    {
      x: 370,
      originX: 370,
      y: 370,
      originY: 370,
      rad: 4,
      color: dark,
      jointo: [],
      length: 0,
      separation: 0,
      offset: 0,
      circle: null,
    },
    {
      x: 175,
      originX: 175,
      y: 400,
      originY: 400,
      rad: 4,
      color: dark,
      jointo: [],
      length: 0,
      separation: 0,
      offset: 0,
      circle: null,
    },
    {
      x: 270,
      originX: 270,
      y: 415,
      originY: 415,
      rad: 4,
      color: dark,
      jointo: [],
      length: 0,
      separation: 0,
      offset: 0,
      circle: null,
    },
    {
      x: 314,
      originX: 314,
      y: 184,
      originY: 184,
      rad: 4,
      color: light,
      jointo: [],
      length: 0,
      separation: 0,
      offset: 0,
      circle: null,
    },
    {
      x: 235,
      originX: 235,
      y: 270,
      originY: 270,
      rad: 6,
      color: light,
      jointo: [],
      length: 0,
      separation: 0,
      offset: 0,
      circle: null,
    },
    {
      x: 112,
      originX: 112,
      y: 315,
      originY: 315,
      rad: 5,
      color: light,
      jointo: [],
      length: 0,
      separation: 0,
      offset: 0,
      circle: null,
    },
    {
      x: 140,
      originX: 140,
      y: 150,
      originY: 150,
      rad: 4,
      color: light,
      jointo: [],
      length: 0,
      separation: 0,
      offset: 0,
      circle: null,
    },
  ]

  // Set connections between points based on the reference structure
  points[0].jointo.push(points[1], points[2], points[3])
  points[1].jointo.push(points[4], points[2], points[5])
  points[2].jointo.push(points[3], points[5], points[6], points[9])
  points[3].jointo.push(points[6], points[7])
  points[4].jointo.push(points[5], points[8], points[10])
  points[5].jointo.push(points[9], points[10], points[11])
  points[6].jointo.push(points[7], points[9], points[12])
  points[7].jointo.push(points[12])
  points[8].jointo.push(points[10])
  points[9].jointo.push(points[11], points[12], points[14])
  points[10].jointo.push(points[11], points[13], points[16])
  points[11].jointo.push(points[14], points[16])
  points[12].jointo.push(points[14], points[15])
  points[13].jointo.push(points[16])
  points[14].jointo.push(points[15], points[16], points[17])
  points[15].jointo.push(points[17])
  points[16].jointo.push(points[17])
  points[18].jointo.push(points[2], points[7], points[19])
  points[19].jointo.push(points[12], points[17], points[4], points[20])
  points[20].jointo.push(points[8], points[16])
  points[21].jointo.push(points[18], points[4], points[0])

  // Set circle objects and additional properties for animation
  points.forEach((point) => {
    point.length = getRandomInt(10, 30)
    point.separation = getRandomInt(400, 800)
    point.offset = getRandomInt(50, 1000)
    point.circle = new Circle(point, point.rad, point.color)
  })

  function initAnimation() {
    render()
    points.forEach((point) => shiftPoint(point))

    // Click event to show tooltip with name
    canvas.addEventListener('click', (event) => {
      const rect = canvas.getBoundingClientRect()
      const mouseX = event.clientX - rect.left
      const mouseY = event.clientY - rect.top
      let found = false
      let selectedNode: Point | null = null

      for (let point of points) {
        const dist = Math.sqrt((mouseX - point.x) ** 2 + (mouseY - point.y) ** 2)
        if (dist < point.rad + 5) {
          TweenLite.to(point.circle, 0.3, {
            rad: point.rad * 1.5, // Increase size temporarily
            onComplete: () => {
              TweenLite.to(point.circle, 0.3, { rad: point.rad })
              return undefined // Explicitly return undefined to match void return type
            },
          })

          tooltip.style.left = `${point.x + rect.left - tooltip.offsetWidth / 2}px`
          tooltip.style.top = `${point.y + rect.top - tooltip.offsetHeight - 10}px`
          tooltip.style.display = 'block'
          tooltip.innerText = point.name ? point.name : 'Hard luck, try again!'
          tooltip.style.background = point.name ? 'rgba(65, 60, 168, 0.6)' : '#413ca8' // Red for incorrect, purple for correct
          found = true
          break
        }
      }

      if (!found) {
        tooltip.style.display = 'none'
      }
    })
  }

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    points.forEach((point) => {
      drawLines(point)
      drawTransit(point)
      point.circle?.draw()
    })
    requestAnimationFrame(render)
  }

  function shiftPoint(point: Point) {
    TweenLite.to(point, 1.5 + 3 * Math.random(), {
      // Increased duration for more exaggerated effect
      x: getRandomInt(point.originX - 50, point.originX + 50), // Increased range
      y: getRandomInt(point.originY - 10, point.originY + 10), // Increased range
      ease: Circ.easeInOut, // Smooth transition with bounce effect
      onComplete: () => shiftPoint(point),
    })
  }

  function drawLines(point: Point) {
    point.jointo.forEach((joint) => {
      ctx.beginPath()
      ctx.moveTo(point.x, point.y)
      ctx.lineTo(joint.x, joint.y)
      ctx.lineWidth = 1.5
      ctx.strokeStyle = `rgba(138, 43, 226, 0.5)` // Purple line with transparency
      ctx.stroke()
    })
  }

  function drawTransit(point: Point) {
    point.jointo.forEach((joint) => {
      if (point.offset != null) {
        ctx.save()
        ctx.setLineDash([point.length, point.separation])
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(point.x, point.y)
        ctx.lineTo(joint.x, joint.y)
        ctx.strokeStyle = `rgba(224, 102, 255, 0.7)` // Light purple for "firing" effect
        ctx.lineDashOffset = point.offset
        ctx.stroke()
        ctx.restore()
        point.offset += 0.3 + 0.5 * Math.random()
      }
    })
  }

  function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  // Run the animation
  initAnimation()
}
