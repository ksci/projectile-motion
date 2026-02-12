import { useState, useRef, useEffect, useCallback } from 'react'
import './App.css'
import CannonControls from './components/CannonControls'
import SimulationCanvas from './components/SimulationCanvas'

function App() {
  // Control limits
  const ANGLE_MIN = 0
  const ANGLE_MAX = 90
  const POWER_MIN = 0
  const POWER_MAX = 100
  const RADIUS_MIN = 2
  const RADIUS_MAX = 50

  // Canvas dimensions (matching SimulationCanvas)
  const canvasHeight = 600
  const groundY = canvasHeight - 50
  const cannonX = 50
  const barrelLength = 40

  const [angle, setAngle] = useState(45)
  const [power, setPower] = useState(50)
  const [projectileRadius, setRadius] = useState(6)
  const [timeElapsed, setElapsed] = useState(0)
  const [showPath, setShowPath] = useState(false)
  const [pathPoints, setPathPoints] = useState<Array<{ x: number; y: number; xVelocity: number; yVelocity: number; time: number }>>([])
  
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

  const handleFire = useCallback(() => {
    if (isFlying) return // Don't fire if already flying

    // Convert angle to radians
    const angleRad = (angle * Math.PI) / 180
    angleRadRef.current = angleRad

    // Convert power to velocity (pixels per second)
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
    // Calculate initial velocities
    const initialXVelocity = velocity * Math.cos(angleRad)
    const initialYVelocity = velocity * Math.sin(angleRad)
    // Reset path points when firing (initial point at t=0)
    setPathPoints([{ x: startX, y: startY, xVelocity: initialXVelocity, yVelocity: initialYVelocity, time: 0 }])
    startTimeRef.current = null
    setIsFlying(true)
  }, [isFlying, angle, power, cannonX, groundY, barrelLength])

  // Keyboard controls for angle adjustment
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const angleStep = 2 // Adjust angle by step per keypress
      const powerStep = 2 // Adjust power by step per keypress
      const radiusStep = 1 // Adjust radius by step per keypress

      // Handle spacebar for firing (can fire even when flying is false, handleFire checks this)
      if (event.code === 'Space' || event.key === ' ' || event.key === "Spacebar") {
        handleFire()
        event.preventDefault()
        return
      }

      // Only adjust angle/power when not flying
      if (isFlying) return

      switch (event.key) {
        case '.':
        case '>':
          // Increase radius
          setRadius(prevRadius => Math.min(RADIUS_MAX, prevRadius + radiusStep))
          event.preventDefault()
          break
        case ',':
        case '<':
          // Decrease radius
          setRadius(prevRadius => Math.max(RADIUS_MIN, prevRadius - radiusStep))
          event.preventDefault()
          break
        case 'ArrowLeft':
          // Increase angle
          setAngle(prevAngle => Math.min(ANGLE_MAX, prevAngle + angleStep))
          event.preventDefault()
          break
        case 'ArrowUp':
          // Increase power
          setPower(prevPower => Math.min(POWER_MAX, prevPower + powerStep))
          event.preventDefault()
          break
        case 'ArrowRight':
          // Decrease angle
          setAngle(prevAngle => Math.max(ANGLE_MIN, prevAngle - angleStep))
          event.preventDefault()
          break
        case 'ArrowDown':
          // Decrease power
          setPower(prevPower => Math.max(POWER_MIN, prevPower - powerStep))
          event.preventDefault()
          break
        case 'Enter':
          // Toggle show path
          setShowPath(prevShowPath => !prevShowPath)
          event.preventDefault()
          break
        case 'Escape':
          // Hide path
          setShowPath(false)
          event.preventDefault()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isFlying, handleFire])

  useEffect(() => {
    if (isFlying) {
      const animate = (currentTime: number) => {
        if (startTimeRef.current === null) {
          startTimeRef.current = currentTime
        }

        const elapsed = (currentTime - startTimeRef.current) / 1000 // Convert to seconds
        setElapsed(elapsed)
        const v0 = initialVelocityRef.current
        const angleRad = angleRadRef.current
        const g = 500 // Gravity in pixels/s² (scaled for visual effect)

        // Calculate cannon barrel end position (starting point)
        const startX = cannonX + barrelLength * Math.cos(angleRad)
        const startY = groundY - barrelLength * Math.sin(angleRad)

        // Projectile motion equations (relative to starting position)
        const x = startX + v0 * Math.cos(angleRad) * elapsed
        const y = startY - (v0 * Math.sin(angleRad) * elapsed - 0.5 * g * elapsed * elapsed)

        // Calculate velocities at this point
        const xVelocity = v0 * Math.cos(angleRad) // Horizontal velocity is constant
        const yVelocity = v0 * Math.sin(angleRad) - g * elapsed // Vertical velocity changes due to gravity

        setProjectileX(x)
        setProjectileY(y)
        
        // Always add point to path regardless of showPath setting, users can enable it after the fact to see the path
        setPathPoints(prev => [...prev, { x, y, xVelocity, yVelocity, time: elapsed }])

        // Check if projectile has hit the ground (account for projectile radius)
        if (y + projectileRadius >= groundY) {
          // Projectile has landed
          setProjectileX(x)
          setProjectileY(groundY)
          // Calculate final velocities at landing
          const finalXVelocity = v0 * Math.cos(angleRad)
          const finalYVelocity = v0 * Math.sin(angleRad) - g * elapsed
          // Always add final point to path regardless of showPath setting
          setPathPoints(prev => [...prev, { x, y: groundY, xVelocity: finalXVelocity, yVelocity: finalYVelocity, time: elapsed }])
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

  // Calculate cannon tip position (for coordinate transformation)
  // Use launch position if flying, otherwise use current angle
  const angleRad = (angle * Math.PI) / 180
  const currentCannonTipX = cannonX + barrelLength * Math.cos(angleRad)
  
  // Use launch position if projectile is flying, otherwise use current position
  const cannonTipX = isFlying ? launchCannonTipXRef.current : currentCannonTipX

  // Utility function to transform coordinates: ground is y=0, cannon tip is x=0
  // x_scaled = x_pixel - cannonTipX
  // y_scaled = groundY - y_pixel (y increases upward in physics, downward in screen)
  const transformCoordinates = (x: number, y: number, tipX: number, ground: number) => ({
    scaledX: x - tipX,
    scaledY: ground - y
  })

  // Transform current projectile position
  const { scaledX, scaledY } = transformCoordinates(projectileX, projectileY, cannonTipX, groundY)

  return (
    <div className="app">
      <h1>Projectile Motion Simulator</h1>
      <div className="app-container">
        <CannonControls
          angle={angle}
          power={power}
          radius={projectileRadius}
          angleMin={ANGLE_MIN}
          angleMax={ANGLE_MAX}
          powerMin={POWER_MIN}
          powerMax={POWER_MAX}
          radiusMin={RADIUS_MIN}
          radiusMax={RADIUS_MAX}
          onAngleChange={setAngle}
          onPowerChange={setPower}
          onRadiusChange={setRadius}
          onFire={handleFire}
          disabled={isFlying}
          projectileX={scaledX}
          projectileY={scaledY}
          timeInSeconds={timeElapsed}
          isFlying={isFlying}
          showPath={showPath}
          onShowPathChange={setShowPath}
        />
        <SimulationCanvas
          angle={angle}
          projectileX={projectileX}
          projectileY={projectileY}
          isFlying={isFlying}
          radius={projectileRadius}
          showPath={showPath}
          pathPoints={pathPoints}
          cannonTipX={cannonTipX}
          groundY={groundY}
          transformCoordinates={transformCoordinates}
        />
      </div>
    </div>
  )
}

export default App
