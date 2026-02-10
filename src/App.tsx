import { useState, useRef, useEffect } from 'react'
import './App.css'
import CannonControls from './components/CannonControls'
import SimulationCanvas from './components/SimulationCanvas'

function App() {
  // Canvas dimensions (matching SimulationCanvas)
  const canvasHeight = 600
  const groundY = canvasHeight - 50
  const cannonX = 50
  const barrelLength = 40

  const [angle, setAngle] = useState(45)
  const [power, setPower] = useState(50)
  
  // Initialize projectile at end of cannon barrel
  const initialAngleRad = (45 * Math.PI) / 180
  const initialX = cannonX + barrelLength * Math.cos(initialAngleRad)
  const initialY = groundY - barrelLength * Math.sin(initialAngleRad)
  
  const [projectileX, setProjectileX] = useState(initialX)
  const [projectileY, setProjectileY] = useState(initialY)
  const [isFlying, setIsFlying] = useState(false)
  
  const animationFrameRef = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const initialVelocityRef = useRef<number>(0)
  const angleRadRef = useRef<number>(0)
  const launchCannonTipXRef = useRef<number>(initialX)
  const launchCannonTipYRef = useRef<number>(initialY)

  useEffect(() => {
    if (isFlying) {
      const animate = (currentTime: number) => {
        if (startTimeRef.current === null) {
          startTimeRef.current = currentTime
        }

        const elapsed = (currentTime - startTimeRef.current) / 1000 // Convert to seconds
        const v0 = initialVelocityRef.current
        const angleRad = angleRadRef.current
        const g = 500 // Gravity in pixels/s² (scaled for visual effect)

        // Calculate cannon barrel end position (starting point)
        const startX = cannonX + barrelLength * Math.cos(angleRad)
        const startY = groundY - barrelLength * Math.sin(angleRad)

        // Projectile motion equations (relative to starting position)
        const x = startX + v0 * Math.cos(angleRad) * elapsed
        const y = startY - (v0 * Math.sin(angleRad) * elapsed - 0.5 * g * elapsed * elapsed)

        setProjectileX(x)
        setProjectileY(y)

        // Check if projectile has hit the ground (account for projectile radius)
        const projectileRadius = 6
        if (y + projectileRadius >= groundY) {
          // Projectile has landed
          setProjectileX(x)
          setProjectileY(groundY)
          setIsFlying(false)
          startTimeRef.current = null
          if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current)
            animationFrameRef.current = null
          }
        } else {
          animationFrameRef.current = requestAnimationFrame(animate)
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isFlying, cannonX, groundY, barrelLength])

  const handleFire = () => {
    if (isFlying) return // Don't fire if already flying

    // Convert angle to radians
    const angleRad = (angle * Math.PI) / 180
    angleRadRef.current = angleRad

    // Convert power (0-100) to velocity (pixels per second)
    // Scale power to a reasonable velocity range
    const velocity = power * 8 // Adjust this multiplier to change speed
    initialVelocityRef.current = velocity

    // Calculate cannon barrel end position (where projectile starts)
    const startX = cannonX + barrelLength * Math.cos(angleRad)
    const startY = groundY - barrelLength * Math.sin(angleRad)

    // Store cannon tip position at launch for coordinate transformation
    launchCannonTipXRef.current = startX
    launchCannonTipYRef.current = startY

    // Reset projectile position to end of cannon barrel
    setProjectileX(startX)
    setProjectileY(startY)
    startTimeRef.current = null
    setIsFlying(true)
  }

  // Calculate cannon tip position (for coordinate transformation)
  // Use launch position if flying, otherwise use current angle
  const angleRad = (angle * Math.PI) / 180
  const currentCannonTipX = cannonX + barrelLength * Math.cos(angleRad)
  const currentCannonTipY = groundY - barrelLength * Math.sin(angleRad)
  
  // Use launch position if projectile is flying, otherwise use current position
  const cannonTipX = isFlying ? launchCannonTipXRef.current : currentCannonTipX
  const cannonTipY = isFlying ? launchCannonTipYRef.current : currentCannonTipY

  // Transform coordinates: ground is y=0, cannon tip is x=0
  // x_scaled = x_pixel - cannonTipX
  // y_scaled = groundY - y_pixel (y increases upward in physics, downward in screen)
  const scaledX = projectileX - cannonTipX
  const scaledY = groundY - projectileY

  return (
    <div className="app">
      <h1>Projectile Motion Simulator</h1>
      <div className="app-container">
        <CannonControls
          angle={angle}
          power={power}
          onAngleChange={setAngle}
          onPowerChange={setPower}
          onFire={handleFire}
          disabled={isFlying}
          projectileX={scaledX}
          projectileY={scaledY}
          isFlying={isFlying}
        />
        <SimulationCanvas
          angle={angle}
          projectileX={projectileX}
          projectileY={projectileY}
          isFlying={isFlying}
        />
      </div>
    </div>
  )
}

export default App
