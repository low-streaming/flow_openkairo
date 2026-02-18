import { LitElement, html, css, nothing, PropertyValues } from 'lit';
import { property, state, customElement } from 'lit/decorators.js';


import './editor';

// --- Typings ---
interface HomeAssistant {
  states: Record<string, { state: string; attributes: Record<string, any> }>;
}

interface NodeConfig {
  entity?: string;
  name?: string;
  icon?: string;
  color?: string;
}

interface FlowOpenKairoConfig {
  type: string;
  solar?: NodeConfig | string;
  battery?: NodeConfig | string;
  grid?: NodeConfig | string;
  home?: NodeConfig | string;
  // Optional: inverted logic for battery/grid if needed
  invert_battery?: boolean;
  invert_grid?: boolean;
}

@customElement('flow-openkairo-card')
export class FlowOpenKairoCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private config!: FlowOpenKairoConfig;

  // Configuration defaults
  private defaults = {
    solar: { icon: 'mdi:solar-power', color: '#ffb74d', name: 'Solar' },
    battery: { icon: 'mdi:battery-high', color: '#64dd17', name: 'Battery' },
    grid: { icon: 'mdi:transmission-tower', color: '#29b6f6', name: 'Grid' },
    home: { icon: 'mdi:home-lightning', color: '#ab47bc', name: 'Home' },
  };

  // --- Editor Configuration ---
  public static getConfigElement() {
    return document.createElement('flow-openkairo-card-editor');
  }

  public static getStubConfig() {
    return {
      type: 'custom:flow-openkairo-card',
      solar: { entity: '', name: 'Solar' },
      battery: { entity: '', name: 'Battery' },
      grid: { entity: '', name: 'Grid' },
      home: { entity: '', name: 'Home' },
      invert_battery: false,
      invert_grid: false,
    };
  }

  public setConfig(config: FlowOpenKairoConfig): void {
    if (!config) throw new Error('Invalid configuration');
    this.config = config;
  }

  // --- Helpers ---

  private getEntityId(config: NodeConfig | string | undefined): string | undefined {
    if (!config) return undefined;
    if (typeof config === 'string') return config;
    return config.entity;
  }

  // Get numeric value from entity
  private getValue(config: NodeConfig | string | undefined): number {
    const entityId = this.getEntityId(config);
    if (!entityId || !this.hass.states[entityId]) return 0;
    const val = parseFloat(this.hass.states[entityId].state);
    return isNaN(val) ? 0 : val;
  }

  // Calculate flow duration (speed) based on power
  // Higher power = faster animation (lower duration)
  private getAnimationDuration(watts: number): number {
    if (watts <= 0) return 0;
    // Map 0-5000W to roughly 5s-0.5s
    const minDur = 0.5;
    const maxDur = 5;
    const maxPower = 5000;

    // Logarithmic scale often looks better
    // duration = maxDur - (log(watts)/log(maxPower) * (maxDur-minDur))
    // Simple linear inverse for now:
    const factor = Math.min(watts / maxPower, 1);
    return maxDur - (factor * (maxDur - minDur));
  }

  protected render() {
    if (!this.config || !this.hass) return nothing;

    // 1. Get Values
    const solarVal = this.getValue(this.config.solar);

    let batteryVal = this.getValue(this.config.battery);
    if (this.config.invert_battery) batteryVal *= -1;

    let gridVal = this.getValue(this.config.grid);
    if (this.config.invert_grid) gridVal *= -1;

    const homeVal = this.getValue(this.config.home);

    // 2. Determine Flow Directions
    // Solar is always source
    const solarActive = solarVal > 10; // Threshold 10W

    // Battery: Positive = Charging (Sink), Negative = Discharging (Source)
    const batteryCharging = batteryVal > 10;
    const batteryDischarging = batteryVal < -10;
    const batteryPwr = Math.abs(batteryVal);

    // Grid: Positive = Import (Source), Negative = Export (Sink)
    const gridImport = gridVal > 10;
    const gridExport = gridVal < -10;
    const gridPwr = Math.abs(gridVal);

    // Home is always sink
    const homeActive = homeVal > 10;


    // 3. Render
    return html`
      <ha-card>
        <div class="card-content">
          <div class="flow-container">
            
            <!-- Nodes -->
            ${this.renderNode('solar', solarVal, this.config.solar)}
            ${this.renderNode('battery', batteryPwr, this.config.battery)}
            ${this.renderNode('grid', gridPwr, this.config.grid)}
            ${this.renderNode('home', homeVal, this.config.home)}

            <!-- SVG Flows -->
            <svg class="flow-lines" viewBox="0 0 400 300">
               <defs>
                 <linearGradient id="grad-solar" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="100%">
                   <stop offset="0%" style="stop-color:${this.getColor(this.config.solar, this.defaults.solar.color)}" />
                   <stop offset="100%" style="stop-color:${this.getColor(this.config.home, this.defaults.home.color)}" />
                 </linearGradient>
               </defs>

               <!-- Solar -> Home (Direct) -->
               ${solarActive ? this.renderFlow(200, 60, 200, 240, solarVal, this.getColor(this.config.solar, this.defaults.solar.color)) : nothing}

               <!-- Solar -> Battery (Charging) -->
               ${batteryCharging ? this.renderFlow(200, 60, 80, 150, batteryPwr, this.getColor(this.config.solar, this.defaults.solar.color)) : nothing}

               <!-- Battery -> Home (Discharging) -->
               ${batteryDischarging ? this.renderFlow(80, 150, 200, 240, batteryPwr, this.getColor(this.config.battery, this.defaults.battery.color)) : nothing}
               
               <!-- Grid -> Home (Import) -->
               ${gridImport ? this.renderFlow(320, 150, 200, 240, gridPwr, this.getColor(this.config.grid, this.defaults.grid.color)) : nothing}

               <!-- Solar -> Grid (Export) - Complex path? Or simple? -->
               ${gridExport && solarActive ? this.renderFlow(200, 60, 320, 150, gridPwr, this.getColor(this.config.solar, this.defaults.solar.color)) : nothing}
            </svg>
          </div>
        </div>
      </ha-card>
    `;
  }

  private getColor(config: NodeConfig | string | undefined, defaultColor: string): string {
    if (!config || typeof config === 'string') return defaultColor;
    return config.color || defaultColor;
  }

  private renderNode(type: 'solar' | 'battery' | 'grid' | 'home', value: number, config?: NodeConfig | string) {
    const def = this.defaults[type];
    const isObj = config && typeof config !== 'string';
    const color = (isObj ? (config as NodeConfig).color : undefined) || def.color;
    const icon = (isObj ? (config as NodeConfig).icon : undefined) || def.icon;
    const name = (isObj ? (config as NodeConfig).name : undefined) || def.name;
    const active = value > 5;

    return html`
      <div class="node ${type}" ?active=${active} style="--node-color: ${color}">
        <ha-icon icon="${icon}"></ha-icon>
        <div class="info">
          <span class="value">${Math.round(value)} W</span>
          <span class="label">${name}</span>
        </div>
      </div>
    `;
  }

  // Renders a curved line with animated dots
  private renderFlow(x1: number, y1: number, x2: number, y2: number, power: number, color?: string) {
    const dur = this.getAnimationDuration(power);
    const pathId = `path-${x1}-${y1}-${x2}-${y2}`;
    const flowColor = color || '#fff';

    // Simple Quadratic Bezier for curve
    // Control point (cp) logic: pull towards center (200, 150) slightly to make it curve?
    // Or just straight lines for now to be safe, Lumina uses straight or slight curves.
    const pathD = `M${x1},${y1} L${x2},${y2}`;

    return html`
      <path id="${pathId}" class="flow-path" d="${pathD}" stroke="${flowColor}" stroke-opacity="0.3" stroke-width="2" fill="none" />
      <circle r="4" fill="${flowColor}">
        <animateMotion dur="${dur}s" repeatCount="indefinite" calcMode="linear">
          <mpath href="#${pathId}" />
        </animateMotion>
      </circle>
      <!-- Optional: Second dot for heavy flow -->
      ${power > 1000 ? html`
        <circle r="3" fill="${flowColor}">
          <animateMotion dur="${dur}s" begin="${dur / 2}s" repeatCount="indefinite" calcMode="linear">
            <mpath href="#${pathId}" />
          </animateMotion>
        </circle>
      ` : nothing}
    `;
  }

  static styles = css`
    :host {
      display: block;
    }
    ha-card {
      background: var(--ha-card-background, rgba(20, 20, 20, 0.6));
      color: white;
      overflow: visible;
      border-radius: 16px;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255,255,255,0.08);
    }
    .card-content {
      padding: 0;
      position: relative;
      height: 320px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .flow-container {
      position: relative;
      width: 400px;
      height: 300px;
      /* background: rgba(0,0,0,0.1); Debug */
    }
    .flow-lines {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 0;
    }
    
    /* Nodes */
    .node {
      position: absolute;
      width: 90px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 2;
      transition: all 0.3s ease;
      text-align: center;
    }
    
    .node ha-icon {
      --mdc-icon-size: 36px;
      color: var(--node-color);
      background: rgba(40,40,40,0.8);
      padding: 12px;
      border-radius: 50%;
      box-shadow: 0 0 10px rgba(0,0,0,0.3);
      border: 2px solid var(--node-color);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .node[active] ha-icon {
      box-shadow: 0 0 20px var(--node-color);
      transform: scale(1.1);
    }

    .info {
      margin-top: 8px;
      background: rgba(0,0,0,0.6);
      padding: 4px 8px;
      border-radius: 8px;
      backdrop-filter: blur(4px);
    }
    .value { font-weight: 700; font-size: 16px; display: block; text-shadow: 0 1px 2px black; }
    .label { font-size: 11px; opacity: 0.8; text-transform: uppercase; letter-spacing: 0.5px; }

    /* Positioning */
    /* Solar Top Center */
    .solar { top: 10px; left: 50%; transform: translateX(-50%); }
    
    /* Battery Left Middle */
    .battery { top: 50%; left: 30px; transform: translateY(-50%); }
    
    /* Grid Right Middle */
    .grid { top: 50%; right: 30px; transform: translateY(-50%); }
    
    /* Home Bottom Center */
    .home { bottom: 20px; left: 50%; transform: translateX(-50%); }

  `;

  // Card Layout Config
  getCardSize() { return 6; }
}

// Register
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: 'flow-openkairo-card',
  name: 'Flow OpenKairo Card',
  preview: true,
  description: 'Custom SolarFlow visualization',
});
