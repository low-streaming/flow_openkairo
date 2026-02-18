# Flow OpenKairo

![Preview](https://via.placeholder.com/600x300?text=Flow+OpenKairo+Preview)

A lightweight, neon-styled visualization card for SolarFlow systems in Home Assistant.

## Features
- 🔋 **Smart animations**: Flow speed adapts to power levels.
- 🌈 **Neon Aesthetics**: Glowing/Neon design.
- ⚡ **Type-Safe**: Built with TypeScript and Lit.

## Installation

### Via HACS (Recommended)
1. Open HACS > Frontend.
2. Search for "Flow OpenKairo" and install.
   *(If not found, add `https://github.com/low-streaming/flow_openkairo` as a Custom Repository)*.

### Manual
1. Download `flow-openkairo-card.js` from the releases.
2. Copy it to your `config/www/` directory.
3. Add `/local/flow-openkairo-card.js` to your Lovelace Resources.

## Configuration

Add a card to your dashboard:

```yaml
type: custom:flow-openkairo-card
solar: 
  entity: sensor.solar_input_power
  name: Solar
battery: 
  entity: sensor.battery_power
  name: Storage
grid: 
  entity: sensor.grid_power
  name: Grid
home: 
  entity: sensor.home_consumption
  name: Home
invert_battery: false  # Optional: Flip positive/negative logic
invert_grid: false     # Optional: Flip positive/negative logic
```
