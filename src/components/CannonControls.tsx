import './CannonControls.css'

interface CannonControlsProps {
  angle: number
  power: number
  radius: number
  angleMin: number
  angleMax: number
  powerMin: number
  powerMax: number
  radiusMin: number
  radiusMax: number
  onAngleChange: (angle: number) => void
  onPowerChange: (power: number) => void
  onRadiusChange: (power: number) => void
  onFire: () => void
  disabled?: boolean
  projectileX?: number
  projectileY?: number
  timeInSeconds?: number,
  isFlying?: boolean
  showPath?: boolean
  onShowPathChange?: (show: boolean) => void
}

export default function CannonControls({
  angle,
  power,
  radius,
  angleMin,
  angleMax,
  powerMin,
  powerMax,
  radiusMin,
  radiusMax,
  onAngleChange,
  onPowerChange,
  onRadiusChange,
  onFire,
  disabled = false,
  projectileX,
  projectileY,
  timeInSeconds,
  isFlying = false,
  showPath = false,
  onShowPathChange,
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
          min={angleMin}
          max={angleMax}
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
          min={powerMin}
          max={powerMax}
          value={power}
          onChange={(e) => onPowerChange(Number(e.target.value))}
          disabled={disabled}
        />
      </div>

      
      <div className="control-group">
        <label htmlFor="radius">
          Radius: {radius}
        </label>
        <input
          id="radius"
          type="range"
          min={radiusMin}
          max={radiusMax}
          value={radius}
          onChange={(e) => onRadiusChange(Number(e.target.value))}
          disabled={disabled}
        />
      </div>

      <div className="control-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={showPath}
            onChange={(e) => onShowPathChange?.(e.target.checked)}
            disabled={disabled}
          />
          <span>Show Path Trace</span>
        </label>
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
          <div className="position-item">
            <span className="position-label">elapsed:</span>
            <span className="position-value">
              {timeInSeconds !== undefined ? `${timeInSeconds.toFixed(2)} s` : '—'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
