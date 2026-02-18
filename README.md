# Flow OpenKairo

![Vorschau](https://via.placeholder.com/600x300?text=Flow+OpenKairo+Preview)

Eine leichte, im Neon-Stil gehaltene Visualisierungskarte für SolarFlow-Systeme in Home Assistant.

**Hauptfunktionen:**
- ⚡ **Performance**: Optimiert mit Vite und Lit.
- 🔋 **Intelligente Animationen**: Die Flussgeschwindigkeit passt sich der Leistung an.
- 🌈 **Neon-Ästhetik**: Leuchtendes/Neon-Design.
- 🎨 **Visueller Editor**: Einfache Konfiguration direkt im UI.

## Installation

### Über HACS (Empfohlen)
1. Öffnen Sie HACS > Frontend.
2. Suchen Sie nach "Flow OpenKairo" und installieren Sie es.
   *(Wenn Sie lokal entwickeln, müssen Sie die Karte nach Updates in HACS möglicherweise erneut herunterladen).*

### Manuell
1. Kopieren Sie `flow-openkairo-card.js` in Ihr Verzeichnis `config/www/`.
2. Fügen Sie `/local/flow-openkairo-card.js` zu Ihren Lovelace-Ressourcen hinzu.

## Konfiguration

Fügen Sie eine Karte zu Ihrem Dashboard hinzu:

### YAML-Konfiguration

```yaml
type: custom:flow-openkairo
solar: sensor.solar_input_power
battery: sensor.battery_power   # Positiv = Laden, Negativ = Entladen
grid: sensor.grid_power         # Positiv = Import, Negativ = Export
home: sensor.home_consumption
color_solar: "#ffb74d"          # Optional
color_battery: "#00e676"        # Optional
color_grid: "#29b6f6"           # Optional
color_home: "#d500f9"           # Optional
invert_battery: false           # Optional: Batterie-Logik umkehren
```

### Visueller Editor
Sie können die Karte nun vollständig über den visuellen Editor von Home Assistant konfigurieren. Wählen Sie einfach Ihre Entitäten aus und passen Sie die Farben nach Ihren Wünschen an.
