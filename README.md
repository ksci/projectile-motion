# Projectile Motion Simulator

An interactive web application that simulates projectile motion physics. Adjust the cannon angle and power, then fire projectiles to observe realistic parabolic trajectories.

## Features

- **Interactive Cannon Controls**
  - Adjust launch angle (0-90 degrees)
  - Adjust launch power/velocity (0-100)
  - Fire button to launch projectiles

- **Real-time Physics Simulation**
  - Accurate projectile motion calculations using kinematic equations
  - Visual representation of the cannon, projectile, and ground
  - Smooth animation using requestAnimationFrame

- **Visual Feedback**
  - SVG-based canvas rendering
  - Real-time projectile position updates
  - Cannon barrel rotates to match selected angle

## How to Use

1. Adjust the **Angle** slider to set the launch angle (0-90 degrees)
2. Adjust the **Power** slider to set the launch velocity (0-100)
3. Click the **Fire!** button to launch the projectile
4. Watch the projectile follow its parabolic trajectory
5. Controls are disabled while a projectile is in flight

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173` (or the port shown in the terminal).

### Build

```bash
# Build for production
npm run build
```

### Preview Production Build

```bash
# Preview the production build
npm run preview
```

## Technology Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **SVG** - Canvas rendering

## Physics

The simulator uses standard projectile motion equations:

- **Horizontal position**: `x = x₀ + v₀ * cos(θ) * t`
- **Vertical position**: `y = y₀ + v₀ * sin(θ) * t - 0.5 * g * t²`

Where:
- `v₀` = initial velocity (derived from power setting)
- `θ` = launch angle in radians
- `g` = gravity (500 pixels/s², scaled for visual effect)
- `t` = elapsed time

## Project Structure

```
src/
├── App.tsx                 # Main component with physics logic
├── components/
│   ├── CannonControls.tsx  # Angle, power controls, and fire button
│   └── SimulationCanvas.tsx # SVG canvas rendering
└── ...
```

## License

This project is private and not licensed for public use.
