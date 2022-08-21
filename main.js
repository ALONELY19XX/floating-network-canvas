document.addEventListener('DOMContentLoaded', () => {
   const canvas = document.getElementById('bg')
   const context = canvas.getContext('2d')

   canvas.width = window.innerWidth
   canvas.height = window.innerHeight
   canvas.style.opacity = 0.5

   let dots = new Array(Math.floor(canvas.width / 8)).fill(0).map(slot => {
      return new Dot(
         Math.random() * canvas.width,
         Math.random() * canvas.height
      )
   })

   function tick() {
      context.clearRect(0, 0, canvas.width, canvas.height)
      dots.forEach(dot => {
         dot.respawnIfOutOfBounds(canvas.width, canvas.height)
         dot.update(context)
         dot.connectToCloseDots(context, dots, 100)
      })
      window.requestAnimationFrame(tick)
   }

   window.requestAnimationFrame(tick)

   window.addEventListener('resize', () => {
      dots = new Array(Math.floor(canvas.width / 8)).fill(0).map(slot => {
         return new Dot(
            Math.random() * canvas.width,
            Math.random() * canvas.height
         )
      })
   })
})

function randomNumberBetween(min, max) {
   return Math.random() * (max - min + 1) + min
}

class RandomDirectionVector2D {
   constructor() {
      this.x = randomNumberBetween(-1, 1)
      this.y = randomNumberBetween(-1, 1)
   }
}

class Dot {
   constructor(x, y) {
      this.x = x
      this.y = y
      this.direction = new RandomDirectionVector2D()
      this.stepFactor = 0.2
      this.radius = 1
      this.color = 'rgba(255, 255, 255, 1)'
   }

   update(context) {
      this.x += this.direction.x * this.stepFactor
      this.y += this.direction.y * this.stepFactor

      context.beginPath()
      context.arc(this.x, this.y, 1, 0, 2 * Math.PI)
      context.fillStyle = this.color
      context.fill()
      context.stroke()
   }

   distance(dot) {
      const deltaX = this.x - dot.x
      const deltaY = this.y - dot.y
      return Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2))
   }

   respawnIfOutOfBounds(canvasWidth, canvasHeight) {
      if (
         this.x < 0 ||
         this.x > canvasWidth ||
         this.y < 0 ||
         this.y > canvasHeight
      ) {
         const shoudSpawnHorizontal = Math.random() > 0.5
         if (shoudSpawnHorizontal) {
            const shouldSpawnLeft = Math.random() > 0.5
            if (shouldSpawnLeft) {
               this.x = 0
               this.y = Math.random() * canvasHeight
            } else {
               this.x = canvasWidth
               this.y = Math.random() * canvasHeight
            }
         } else {
            const shouldSpawnTop = Math.random() > 0.5
            if (shouldSpawnTop) {
               this.x = Math.random() * canvasWidth
               this.y = 0
            } else {
               this.x = Math.random() * canvasWidth
               this.y = canvasHeight
            }
         }
      }
   }

   connectToCloseDots(context, dots, maxDistance) {
      dots.forEach(dot => {
         const distance = this.distance(dot)
         if (distance < maxDistance) {
            const distanceRatio = distance / maxDistance
            context.beginPath()
            context.lineWidth = 1
            context.strokeStyle = `rgba(255, 255, 255, ${
               distanceRatio > 1 ? 1 : 1 - distanceRatio
            })`
            context.moveTo(this.x, this.y)
            context.lineTo(dot.x, dot.y)
            context.stroke()
         }
      })
   }
}
