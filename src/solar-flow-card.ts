
import { LitElement, html, css, nothing } from 'lit';
import { property, state, customElement } from 'lit/decorators.js';
import './editor';

// --- Types ---
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

  // Premium Colors similar to OpenKairo style
  private defaults = {
    solar: { icon: 'mdi:solar-power', color: '#ffb300', name: 'Produktion' },   // Amber/Gold
    battery: { icon: 'mdi:battery-high', color: '#00e676', name: 'Speicher' }, // Bright Green
    grid: { icon: 'mdi:transmission-tower', color: '#2979ff', name: 'Netz' },  // Bright Blue
    home: { icon: 'mdi:home-lightning', color: '#d500f9', name: 'Verbrauch' }, // Vivid Purple
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

  // --- Helpers ---
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
    if (typeof node === 'object' && node?.color) return node.color;
    return defaultColor;
  }

  private _getIcon(node: NodeConfig | string | undefined, defaultIcon: string): string {
    if (typeof node === 'object' && node?.icon) return node.icon;
    return defaultIcon;
  }

  private _getName(node: NodeConfig | string | undefined, defaultName: string): string {
    if (typeof node === 'object' && node?.name) return node.name;
    return defaultName;
  }

  // Dynamic easing duration
  private _getAnimationDuration(watts: number): number {
    if (watts <= 10) return 0;
    // 5s at low power, down to 0.8s at high power
    return Math.max(0.8, 5 - (Math.log10(watts + 1) * 1.5));
  }

  protected render() {
    if (!this.config || !this.hass) return nothing;

    // --- Data Fetching ---
    const solarVal = Math.max(0, this._getValue(this.config.solar));
    const homeVal = Math.max(0, this._getValue(this.config.home));

    // Battery Logic
    let batRaw = this._getValue(this.config.battery);
    if (this.config.invert_battery) batRaw *= -1;
    const batCharge = batRaw > 0 ? batRaw : 0;
    const batDischarge = batRaw < 0 ? Math.abs(batRaw) : 0;

    // Grid Logic
    let gridRaw = this._getValue(this.config.grid);
    if (this.config.invert_grid) gridRaw *= -1;
    const gridImport = gridRaw > 0 ? gridRaw : 0;
    const gridExport = gridRaw < 0 ? Math.abs(gridRaw) : 0;

    // Colors
    const cSolar = this._getColor(this.config.solar, this.defaults.solar.color);
    const cBat = this._getColor(this.config.battery, this.defaults.battery.color);
    const cGrid = this._getColor(this.config.grid, this.defaults.grid.color);
    const cHome = this._getColor(this.config.home, this.defaults.home.color);

    // Layout Constants
    // Center: 200, 150
    // Solar: Top (200, 50)
    // Battery: Left (80, 150)
    // Grid: Right (320, 150)
    // Home: Bottom (200, 250)
    // Middle Hub: (200, 150)

    // Flows
    // Solar -> Battery (Charge)
    // Solar -> Home (Direct)
    // Solar -> Grid (Export)
    // Battery -> Home (Discharge)
    // Grid -> Home (Import)
    // Battery -> Grid (Edge case, usually not visualized or handled via discharge)

    return html`
            <ha-card>
                <div class="card-content">
                    
                    <!-- SVG Layer -->
                    <svg class="flow-svg" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet">
                        <defs>
                            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                <feGaussianBlur stdDeviation="2" result="blur" />
                                <feComposite in="SourceGraphic" in2="blur" operator="over" />
                            </filter>
                        </defs>

                        <!-- Static Lines (Background) -->
                        <path d="M200,80 L200,150" class="line-bg" /> <!-- Solar -> Mid -->
                        <path d="M200,150 L80,150" class="line-bg" /> <!-- Mid -> Bat -->
                        <path d="M200,150 L320,150" class="line-bg" /> <!-- Mid -> Grid -->
                        <path d="M200,150 L200,220" class="line-bg" /> <!-- Mid -> Home -->

                        <!-- Active Flows -->
                        
                        <!-- 1. Solar Production (To Middle) -->
                        ${solarVal > 10 ? this._renderPath(200, 80, 200, 150, solarVal, cSolar) : nothing}

                        <!-- 2. Battery Charge (from Mid) -->
                        ${batCharge > 10 ? this._renderPath(200, 150, 80, 150, batCharge, cSolar) : nothing}

                        <!-- 3. Battery Discharge (to Mid) -->
                        ${batDischarge > 10 ? this._renderPath(80, 150, 200, 150, batDischarge, cBat) : nothing}

                        <!-- 4. Grid Import (to Mid) -->
                        ${gridImport > 10 ? this._renderPath(320, 150, 200, 150, gridImport, cGrid) : nothing}

                        <!-- 5. Grid Export (from Mid) -->
                        ${gridExport > 10 ? this._renderPath(200, 150, 320, 150, gridExport, cSolar) : nothing}

                        <!-- 6. Home Consumption (from Mid) -->
                        ${homeVal > 10 ? this._renderPath(200, 150, 200, 220, homeVal, cHome) : nothing}

                    </svg>

                    <!-- Nodes Layer (HTML) -->
                    <div class="nodes-container">
                        <!-- Solar -->
                        <div class="node-wrapper" style="top: 10px; left: 50%; transform: translateX(-50%);">
                            ${this._renderNode('solar', solarVal, this.config.solar, cSolar)}
                        </div>

                        <!-- Battery -->
                        <div class="node-wrapper" style="top: 50%; left: 10px; transform: translateY(-50%);">
                            ${this._renderNode('battery', Math.abs(batRaw), this.config.battery, cBat)}
                            ${batCharge > 0 ? html`<div class="sub-label">Charge</div>` : nothing}
                            ${batDischarge > 0 ? html`<div class="sub-label">Discharge</div>` : nothing}
                        </div>

                        <!-- Grid -->
                        <div class="node-wrapper" style="top: 50%; right: 10px; transform: translateY(-50%);">
                            ${this._renderNode('grid', Math.abs(gridRaw), this.config.grid, cGrid)}
                            ${gridImport > 0 ? html`<div class="sub-label">Import</div>` : nothing}
                            ${gridExport > 0 ? html`<div class="sub-label">Export</div>` : nothing}
                        </div>

                        <!-- Home -->
                        <div class="node-wrapper" style="bottom: 10px; left: 50%; transform: translateX(-50%);">
                            ${this._renderNode('home', homeVal, this.config.home, cHome)}
                        </div>

                         <!-- Center Hub (Visual Decoration) -->
                        <div class="hub" style="top: 50%; left: 50%; transform: translate(-50%, -50%);">
                            <div class="hub-dot"></div>
                        </div>
                    </div>

                </div>
            </ha-card>
        `;
  }

  private _renderPath(x1: number, y1: number, x2: number, y2: number, power: number, color: string) {
    const dur = this._getAnimationDuration(power);
    const pathId = `p-${x1}-${y1}-${x2}-${y2}`;
    const pathD = `M${x1},${y1} L${x2},${y2}`;

    // Width based on power?
    const strokeWidth = Math.min(6, 2 + (power / 2000));

    return html`
            <path id="${pathId}" d="${pathD}" fill="none" stroke="${color}" stroke-width="2" stroke-opacity="0.2" />
            <circle r="${strokeWidth}" fill="${color}" filter="url(#glow)">
                <animateMotion dur="${dur}s" repeatCount="indefinite" keyPoints="0;1" keyTimes="0;1" calcMode="linear">
                    <mpath href="#${pathId}" />
                </animateMotion>
            </circle>
        `;
  }

  private _renderNode(key: 'solar' | 'battery' | 'grid' | 'home', value: number, config: NodeConfig | string | undefined, color: string) {
    const def = this.defaults[key];
    const icon = this._getIcon(config, def.icon);
    const name = this._getName(config, def.name);
    const isActive = value > 5;

    return html`
            <div class="node" ?active=${isActive} style="--color: ${color}">
                <div class="icon-circle">
                    <ha-icon icon="${icon}"></ha-icon>
                </div>
                <div class="text">
                    <span class="value">${Math.round(value)}<small>W</small></span>
                    <span class="name">${name}</span>
                </div>
            </div>
        `;
  }

  static styles = css`
        :host { --mdc-icon-size: 24px; }
        ha-card {
            background: #111111; /* Fast schwarz */
            color: #eeeeee;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            border: 1px solid rgba(255,255,255,0.05); /* Subtiler Rahmen */
            overflow: hidden;
            font-family: 'Roboto', sans-serif;
        }
        .card-content {
            position: relative;
            height: 340px;
            padding: 0;
        }
        .flow-svg {
            position: absolute;
            top: 0; 
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        }
        .line-bg {
            stroke: #333;
            stroke-width: 2;
            fill: none;
        }

        .nodes-container {
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            z-index: 2;
            pointer-events: none; /* Klicks gehen durch */
        }

        .node-wrapper {
            position: absolute;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 120px;
        }

        .node {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
            pointer-events: auto; /* Interaktiv machen falls nötig */
            opacity: 0.6;
            transition: all 0.5s ease;
        }
        .node[active] {
            opacity: 1;
            transform: scale(1.05);
        }

        .icon-circle {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: rgba(30,30,30, 0.8);
            border: 2px solid var(--color);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 0 15px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
        }
        .node[active] .icon-circle {
            background: rgba(var(--color), 0.1); 
            box-shadow: 0 0 25px var(--color);
            border-width: 3px;
        }

        ha-icon {
            color: var(--color);
            filter: drop-shadow(0 0 2px var(--color));
        }

        .text {
            text-align: center;
            display: flex;
            flex-direction: column;
        }
        .value {
            font-size: 1.4rem;
            font-weight: 700;
            line-height: 1.2;
            color: #fff;
            text-shadow: 0 2px 4px rgba(0,0,0,0.8);
        }
        .value small {
            font-size: 0.8rem;
            opacity: 0.7;
            font-weight: 400;
            margin-left: 2px;
        }
        .name {
            font-size: 0.85rem;
            color: #aaa;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-top: 2px;
        }

        .hub {
            width: 20px;
            height: 20px;
            background: #222;
            border-radius: 50%;
            border: 2px solid #444;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
        }
        .hub-dot {
            width: 6px;
            height: 6px;
            background: #666;
            border-radius: 50%;
        }

        .sub-label {
            font-size: 0.7rem;
            color: #888;
            margin-top: 4px;
            text-transform: uppercase;
        }
    `;

  getCardSize() { return 8; }
}
