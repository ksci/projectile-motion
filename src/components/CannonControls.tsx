import './CannonControls.css'

interface CannonControlsProps {
  angle: number
  power: number
  onAngleChange: (angle: number) => void
  onPowerChange: (power: number) => void
  onFire: () => void
  disabled?: boolean
  projectileX?: number
  projectileY?: number
  isFlying?: boolean
}

export default function CannonControls({
  angle,
  power,
  onAngleChange,
  onPowerChange,
  onFire,
  disabled = false,
  projectileX,
  projectileY,
  isFlying = false,
}: CannonControlsProps) {
  return (
    <div className="cannon-controls">
      <h2>Cannon Controls</h2>
      
      <div className="control-group">
        <label htmlFor="angle">
          Angle: {angle}°
        </label>
        <input
          id="angle"
          type="range"
          min="0"
          max="90"
          value={angle}
          onChange={(e) => onAngleChange(Number(e.target.value))}
          disabled={disabled}
        />
      </div>

      <div className="control-group">
        <label htmlFor="power">
          Power: {power}
        </label>
        <input
          id="power"
          type="range"
          min="0"
          max="100"
          value={power}
          onChange={(e) => onPowerChange(Number(e.target.value))}
          disabled={disabled}
        />
      </div>

      <button 
        onClick={onFire} 
        disabled={disabled}
        className="fire-button"
      >
        Fire!
      </button>

      <div className={`position-display ${isFlying ? 'active' : ''}`}>
        <h3>Projectile Position</h3>
        <div className="position-values">
          <div className="position-item">
            <span className="position-label">X:</span>
            <span className="position-value">
              {projectileX !== undefined ? projectileX.toFixed(1) : '—'}
            </span>
          </div>
          <div className="position-item">
            <span className="position-label">Y:</span>
            <span className="position-value">
              {projectileY !== undefined ? projectileY.toFixed(1) : '—'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
