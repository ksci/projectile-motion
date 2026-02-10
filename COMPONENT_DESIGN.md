# Projectile Motion Simulator - Component Design

## Component Architecture

### 1. **App.tsx** (Main Component)
- Manages all application state:
  - Cannon angle (degrees)
  - Cannon power/velocity
  - Projectile position (x, y)
  - Whether projectile is in flight
  - Animation frame reference
- Handles the physics calculations
- Coordinates between controls and visualization
- Contains the main layout

### 2. **CannonControls.tsx**
- Displays controls for:
  - Angle slider/input (0-90 degrees)
  - Power slider/input (0-100 or similar scale)
  - Fire button
- Receives props: angle, power, onAngleChange, onPowerChange, onFire
- Simple form-like component

### 3. **SimulationCanvas.tsx** (or could be part of App)
- Renders the visual representation:
  - Ground/terrain
  - Cannon (positioned on left side)
  - Projectile (when in flight)
- Uses SVG or Canvas for rendering
- Receives props: angle, power, projectilePosition, isFlying

## State Management

```
App State:
- angle: number (0-90 degrees)
- power: number (0-100)
- projectileX: number
- projectileY: number
- isFlying: boolean
- animationId: number | null
```

## Physics (Simple)
- Use basic projectile motion equations:
  - x = v₀ * cos(θ) * t
  - y = v₀ * sin(θ) * t - 0.5 * g * t²
- Where:
  - v₀ = initial velocity (based on power)
  - θ = angle in radians
  - g = gravity (9.8 m/s² or scaled for pixels)
  - t = time

## Layout
```
┌─────────────────────────────────────┐
│  Controls Panel    │  Canvas Area  │
│  - Angle Slider    │  [Cannon]     │
│  - Power Slider    │      ⚫        │
│  - Fire Button     │     (trajectory)│
└─────────────────────────────────────┘
```

## Future Expansions (not now)
- Trajectory path visualization
- Multiple projectiles
- Wind resistance
- Different projectile types
- Reset button
- Speed controls
