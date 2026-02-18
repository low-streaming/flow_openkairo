# Flow OpenKairo

![Preview](https://via.placeholder.com/600x300?text=Flow+OpenKairo+Preview)

A lightweight, neon-styled visualization card for SolarFlow systems in Home Assistant.

**Main Features:**
- ⚡ **Zero Dependencies**: Pure JavaScript, no build required.
- 🔋 **Smart animations**: Flow speed adapts to power levels.
- 🌈 **Neon Aesthetics**: Glowing/Neon design.

## Installation

### Via HACS (Recommended)
1. Open HACS > Frontend.
2. Search for "Flow OpenKairo" and install.
   *(If you are developing locally, you may need to redownload the card within HACS after updates).*

### Manual
1. Copy `flow-openkairo.js` to your `config/www/` directory.
2. Add `/local/flow-openkairo.js` to your Lovelace Resources.

## Configuration

Add a card to your dashboard:

```yaml
type: custom:flow-openkairo
solar: sensor.solar_input_power
battery: sensor.battery_power   # Positive = charging, Negative = discharging
grid: sensor.grid_power         # Positive = import, Negative = export
home: sensor.home_consumption
color_solar: "#ffb74d"          # Optional
color_battery: "#00e676"        # Optional
color_grid: "#29b6f6"           # Optional
color_home: "#d500f9"           # Optional
```
