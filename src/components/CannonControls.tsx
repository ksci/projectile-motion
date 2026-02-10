import './CannonControls.css'

interface CannonControlsProps {
  angle: number
  power: number
  onAngleChange: (angle: number) => void
  onPowerChange: (power: number) => void
  onFire: () => void
  disabled?: boolean
}

export default function CannonControls({
  angle,
  power,
  onAngleChange,
  onPowerChange,
  onFire,
  disabled = false,
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
    </div>
  )
}
