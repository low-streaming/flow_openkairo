
import { LitElement, html, css, nothing } from 'lit';
import { property, state, customElement } from 'lit/decorators.js';

// Import the editor so it registers itself BEFORE getConfigElement is called.
import './editor';

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
  invert_battery?: boolean;
  invert_grid?: boolean;
}

@customElement('flow-openkairo-card')
export class FlowOpenKairoCard extends LitElement {
  @property({ attribute: false }) public hass!: any;
  @state() private config!: FlowOpenKairoConfig;

  private defaults = {
    solar: { icon: 'mdi:solar-power', color: '#ffb74d', name: 'Solar' },
    battery: { icon: 'mdi:battery-high', color: '#64dd17', name: 'Battery' },
    grid: { icon: 'mdi:transmission-tower', color: '#29b6f6', name: 'Grid' },
    home: { icon: 'mdi:home-lightning', color: '#ab47bc', name: 'Home' },
  };

  public static getConfigElement() {
    return document.createElement('flow-openkairo-card-editor');
  }

  public static getStubConfig() {
    return {
      type: 'custom:flow-openkairo-card',
      solar: '',
      battery: '',
      grid: '',
      home: '',
      invert_battery: false,
      invert_grid: false,
    };
  }

  public setConfig(config: FlowOpenKairoConfig): void {
    if (!config) throw new Error('Invalid configuration');
    this.config = config;
  }

  private _getEntityId(node: NodeConfig | string | undefined): string | undefined {
    if (!node) return undefined;
    if (typeof node === 'string') return node;
    return node.entity;
  }

  private _getValue(node: NodeConfig | string | undefined): number {
    const eid = this._getEntityId(node);
    if (!eid || !this.hass.states[eid]) return 0;
    const val = parseFloat(this.hass.states[eid].state);
    return isNaN(val) ? 0 : val;
  }

  private _getColor(node: NodeConfig | string | undefined, defaultColor: string): string {
    if (!node) return defaultColor;
    if (typeof node === 'string') return defaultColor;
    return node.color || defaultColor;
  }

  private _getIcon(node: NodeConfig | string | undefined, defaultIcon: string): string {
    if (!node) return defaultIcon;
    if (typeof node === 'string') return defaultIcon;
    return node.icon || defaultIcon;
  }

  private _getName(node: NodeConfig | string | undefined, defaultName: string): string {
    if (!node) return defaultName;
    if (typeof node === 'string') return defaultName;
    return node.name || defaultName;
  }

  private _getAnimationDuration(watts: number): number {
    if (watts <= 0) return 0;
    const minDur = 0.5;
    const maxDur = 5;
    const maxPower = 5000;
    const factor = Math.min(watts / maxPower, 1);
    return maxDur - (factor * (maxDur - minDur));
  }

  protected render() {
    if (!this.config || !this.hass) return nothing;

    // Simplify logical flows
    const solarVal = Math.max(0, this._getValue(this.config.solar));

    // Battery logic
    let batteryVal = this._getValue(this.config.battery);
    if (this.config.invert_battery) batteryVal *= -1;
    const batteryCharging = batteryVal > 10;
    const batteryDischarging = batteryVal < -10;
    const batteryPwr = Math.abs(batteryVal);

    // Grid logic
    let gridVal = this._getValue(this.config.grid);
    if (this.config.invert_grid) gridVal *= -1;
    const gridImport = gridVal > 10;
    const gridExport = gridVal < -10;
    const gridPwr = Math.abs(gridVal);

    const homeVal = Math.max(0, this._getValue(this.config.home));

    const solarUrl = this._getColor(this.config.solar, this.defaults.solar.color);
    const homeUrl = this._getColor(this.config.home, this.defaults.home.color);

    // Construct paths if active
    // Simplification: Always center logic around solar/home usage?
    // Or assume pure power logic.

    return html`
            <ha-card>
                <div class="card-content">
                    <div class="flow-container">
                        ${this._renderNode('solar', solarVal, this.config.solar)}
                        ${this._renderNode('battery', batteryPwr, this.config.battery)}
                        ${this._renderNode('grid', gridPwr, this.config.grid)}
                        ${this._renderNode('home', homeVal, this.config.home)}
                        
                        <svg class="flow-lines" viewBox="0 0 400 300">
                             <defs>
                                <linearGradient id="grad-solar" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="100%">
                                    <stop offset="0%" stop-color="${solarUrl}" />
                                    <stop offset="100%" stop-color="${homeUrl}" />
                                </linearGradient>
                             </defs>
                             
                             ${solarVal > 10 ? this._renderFlow(200, 60, 200, 240, solarVal, solarUrl) : nothing}
                             ${batteryCharging ? this._renderFlow(200, 60, 80, 150, batteryPwr, solarUrl) : nothing}
                             ${batteryDischarging ? this._renderFlow(80, 150, 200, 240, batteryPwr, this._getColor(this.config.battery, this.defaults.battery.color)) : nothing}
                             ${gridImport ? this._renderFlow(320, 150, 200, 240, gridPwr, this._getColor(this.config.grid, this.defaults.grid.color)) : nothing}
                             ${gridExport ? this._renderFlow(200, 60, 320, 150, gridPwr, solarUrl) : nothing}
                        </svg>
                    </div>
                </div>
            </ha-card>
        `;
  }

  private _renderNode(key: 'solar' | 'battery' | 'grid' | 'home', value: number, config?: NodeConfig | string) {
    const def = this.defaults[key];
    const color = this._getColor(config, def.color);
    const icon = this._getIcon(config, def.icon);
    const name = this._getName(config, def.name);
    const active = value > 5;

    return html`
            <div class="node ${key}" ?active=${active} style="--node-color: ${color}">
                <ha-icon icon="${icon}"></ha-icon>
                <div class="info">
                    <span class="value">${Math.round(value)} W</span>
                    <span class="label">${name}</span>
                </div>
            </div>
        `;
  }

  private _renderFlow(x1: number, y1: number, x2: number, y2: number, power: number, color?: string) {
    const dur = this._getAnimationDuration(power);
    const pathId = `path-${x1}-${y1}-${x2}-${y2}`;
    const flowColor = color || '#fff';
    const pathD = `M${x1},${y1} L${x2},${y2}`;

    return html`
            <path id="${pathId}" class="flow-path" d="${pathD}" stroke="${flowColor}" stroke-opacity="0.3" stroke-width="2" fill="none" />
            <circle r="4" fill="${flowColor}">
                <animateMotion dur="${dur}s" repeatCount="indefinite" calcMode="linear">
                    <mpath href="#${pathId}" />
                </animateMotion>
            </circle>
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
        :host { display: block; }
        ha-card {
            background: var(--ha-card-background, rgba(20, 20, 20, 0.6));
            color: white;
            overflow: visible;
            border-radius: 16px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.08);
        }
        .card-content { padding: 0; position: relative; height: 320px; display: flex; justify-content: center; align-items: center; }
        .flow-container { position: relative; width: 400px; height: 300px; }
        .flow-lines { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 0; }
        .node { position: absolute; width: 90px; display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 2; transition: all 0.3s ease; text-align: center; }
        .node ha-icon { --mdc-icon-size: 36px; color: var(--node-color); background: rgba(40,40,40,0.8); padding: 12px; border-radius: 50%; box-shadow: 0 0 10px rgba(0,0,0,0.3); border: 2px solid var(--node-color); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .node[active] ha-icon { box-shadow: 0 0 20px var(--node-color); transform: scale(1.1); }
        .info { margin-top: 8px; background: rgba(0,0,0,0.6); padding: 4px 8px; border-radius: 8px; backdrop-filter: blur(4px); }
        .value { font-weight: 700; font-size: 16px; display: block; text-shadow: 0 1px 2px black; }
        .label { font-size: 11px; opacity: 0.8; text-transform: uppercase; letter-spacing: 0.5px; }
        .solar { top: 10px; left: 50%; transform: translateX(-50%); }
        .battery { top: 50%; left: 30px; transform: translateY(-50%); }
        .grid { top: 50%; right: 30px; transform: translateY(-50%); }
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
