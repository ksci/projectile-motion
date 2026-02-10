import './SimulationCanvas.css'

interface SimulationCanvasProps {
  angle: number
  projectileX: number
  projectileY: number
  isFlying: boolean
}

export default function SimulationCanvas({
  angle,
  projectileX,
  projectileY,
  isFlying,
}: SimulationCanvasProps) {
  // Canvas dimensions
  const canvasWidth = 800
  const canvasHeight = 600
  const groundY = canvasHeight - 50
  const cannonX = 50
  const cannonY = groundY

  // Convert angle to radians for drawing
  const angleRad = (angle * Math.PI) / 180

  // Calculate cannon barrel end position
  const barrelLength = 40
  const barrelEndX = cannonX + barrelLength * Math.cos(angleRad)
  const barrelEndY = cannonY - barrelLength * Math.sin(angleRad)

  return (
    <div className="simulation-canvas">
      <svg
        width={canvasWidth}
        height={canvasHeight}
        viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
        className="canvas-svg"
      >
        {/* Ground */}
        <line
          x1={0}
          y1={groundY}
          x2={canvasWidth}
          y2={groundY}
          stroke="#8B4513"
          strokeWidth="4"
        />

        {/* Cannon base */}
        <rect
          x={cannonX - 20}
          y={cannonY - 15}
          width="40"
          height="15"
          fill="#555"
        />

        {/* Cannon barrel */}
        <line
          x1={cannonX}
          y1={cannonY}
          x2={barrelEndX}
          y2={barrelEndY}
          stroke="#333"
          strokeWidth="8"
          strokeLinecap="round"
        />

        {/* Projectile - always show if position is set, or when flying */}
        {(isFlying || (projectileX > 0 && projectileY > 0)) && (
          <circle
            cx={projectileX}
            cy={projectileY}
            r="6"
            fill="#ff4444"
          />
        )}
      </svg>
    </div>
  )
}
