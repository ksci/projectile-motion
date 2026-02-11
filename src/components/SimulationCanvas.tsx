import { useState } from 'react'
import './SimulationCanvas.css'

interface SimulationCanvasProps {
  angle: number
  projectileX: number
  projectileY: number
  isFlying: boolean
  radius: number
  showPath?: boolean
  pathPoints?: Array<{ x: number; y: number; xVelocity: number; yVelocity: number; time: number }>
}

export default function SimulationCanvas({
  angle,
  projectileX,
  projectileY,
  isFlying,
  radius,
  showPath = false,
  pathPoints = [],
}: SimulationCanvasProps) {
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null)
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

        {/* Path trace */}
        {showPath && pathPoints.length > 1 && (
          <g>
            {/* Visible path line */}
            <polyline
              points={pathPoints.map(p => `${p.x},${p.y}`).join(' ')}
              fill="none"
              stroke="#888"
              strokeWidth="2"
              strokeDasharray="4,4"
              opacity="0.6"
            />
            {/* Interactive hover areas for each path segment */}
            {pathPoints.map((point, index) => {
              if (index === 0) return null
              const prevPoint = pathPoints[index - 1]
              const midX = (prevPoint.x + point.x) / 2
              const midY = (prevPoint.y + point.y) / 2
              
              return (
                <line
                  key={index}
                  x1={prevPoint.x}
                  y1={prevPoint.y}
                  x2={point.x}
                  y2={point.y}
                  stroke="transparent"
                  strokeWidth="100"
                  onMouseEnter={(e) => {
                    setHoveredPointIndex(index)
                    const svg = e.currentTarget.ownerSVGElement
                    if (svg) {
                      const point = svg.createSVGPoint()
                      point.x = midX
                      point.y = midY
                      const screenCTM = svg.getScreenCTM()
                      if (screenCTM) {
                        const screenPoint = point.matrixTransform(screenCTM)
                        setTooltipPosition({
                          x: screenPoint.x,
                          y: screenPoint.y
                        })
                      }
                    }
                  }}
                  onMouseMove={(e) => {
                    const svg = e.currentTarget.ownerSVGElement
                    if (svg) {
                      const point = svg.createSVGPoint()
                      point.x = midX
                      point.y = midY
                      const screenCTM = svg.getScreenCTM()
                      if (screenCTM) {
                        const screenPoint = point.matrixTransform(screenCTM)
                        setTooltipPosition({
                          x: screenPoint.x,
                          y: screenPoint.y
                        })
                      }
                    }
                  }}
                  onMouseLeave={() => {
                    setHoveredPointIndex(null)
                    setTooltipPosition(null)
                  }}
                  style={{ cursor: 'pointer' }}
                />
              )
            })}
          </g>
        )}

        {/* Projectile - always show if position is set, or when flying */}
        {(isFlying || (projectileX > 0 && projectileY > 0)) && (
          <circle
            cx={projectileX}
            cy={projectileY}
            r={radius}
            fill="#ff4444"
          />
        )}
      </svg>
      
      {/* Tooltip */}
      {showPath && hoveredPointIndex !== null && tooltipPosition && pathPoints[hoveredPointIndex] && (
        <div
          className="path-tooltip"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
          }}
        >
          <div className="tooltip-content">
            <div className="tooltip-header">Path Point Data</div>
            <div className="tooltip-row">
              <span className="tooltip-label">X:</span>
              <span className="tooltip-value">{pathPoints[hoveredPointIndex].x.toFixed(1)}</span>
            </div>
            <div className="tooltip-row">
              <span className="tooltip-label">Y:</span>
              <span className="tooltip-value">{pathPoints[hoveredPointIndex].y.toFixed(1)}</span>
            </div>
            <div className="tooltip-row">
              <span className="tooltip-label">Vx:</span>
              <span className="tooltip-value">{pathPoints[hoveredPointIndex].xVelocity.toFixed(1)}</span>
            </div>
            <div className="tooltip-row">
              <span className="tooltip-label">Vy:</span>
              <span className="tooltip-value">{pathPoints[hoveredPointIndex].yVelocity.toFixed(1)}</span>
            </div>
            <div className="tooltip-row">
              <span className="tooltip-label">Time:</span>
              <span className="tooltip-value">{pathPoints[hoveredPointIndex].time.toFixed(2)}s</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
