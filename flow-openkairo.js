class FlowOpenKairo extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    setConfig(config) {
        if (!config.solar && !config.battery && !config.grid) {
            // throw new Error('Please define at least one entity (solar, battery, grid)');
            // Relaxed check for editor preview
        }
        this.config = config;
    }

    set hass(hass) {
        this._hass = hass;
        this.render();
    }

    // Define stub config for new cards
    static getStubConfig() {
        return {
            solar: "sensor.solar_power",
            battery: "sensor.battery_power",
            grid: "sensor.grid_power",
            home: "sensor.home_consumption",
            color_solar: "#ffcc00",
            color_battery: "#00ff66",
            color_grid: "#00ccff",
            color_home: "#ff00ff"
        };
    }

    // Define the editor custom element
    static getConfigElement() {
        return document.createElement("flow-openkairo-editor");
    }

    getVal(entityId) {
        if (!entityId || !this._hass || !this._hass.states[entityId]) return 0;
        const val = parseFloat(this._hass.states[entityId].state);
        return isNaN(val) ? 0 : val;
    }

    render() {
        if (!this.config || !this._hass) return;

        const solar = this.getVal(this.config.solar);
        const battery = this.getVal(this.config.battery);
        const grid = this.getVal(this.config.grid);
        const home = this.getVal(this.config.home);

        // Neon Palette
        const cSolar = this.config.color_solar || '#ffcc00'; // Bright Yellow-Orange
        const cBat = this.config.color_battery || '#00ff66'; // Matrix Green
        const cGrid = this.config.color_grid || '#00ccff';   // Cyan
        const cHome = this.config.color_home || '#ff00ff';   // Magenta

        // Logic
        const isSolar = solar > 2;
        const isBatCharge = battery > 2;
        const isBatDischarge = battery < -2;
        const isGridImport = grid > 2;
        const isGridExport = grid < -2;
        const isHome = home > 2;

        const vBat = Math.abs(battery);
        const vGrid = Math.abs(grid);

        this.shadowRoot.innerHTML = `
            <style>
                :host { display: block; }
                .card {
                    background: radial-gradient(circle at center, #1a1a2e 0%, #0d0d14 100%);
                    border-radius: 20px;
                    padding: 16px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.8), inset 0 0 20px rgba(255,255,255,0.03);
                    color: white;
                    font-family: 'Segoe UI', Roboto, Helvetica, sans-serif;
                    position: relative;
                    height: 340px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border: 1px solid rgba(255,255,255,0.08);
                    overflow: hidden;
                }
                
                /* Grid Background Effect */
                .grid-bg {
                    position: absolute;
                    top: 0; left: 0; width: 100%; height: 100%;
                    background-image: 
                        linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
                    background-size: 20px 20px;
                    z-index: 0;
                    opacity: 0.5;
                }

                .canvas {
                    position: absolute;
                    top: 0; left: 0; width: 100%; height: 100%;
                    pointer-events: none;
                    z-index: 1;
                }

                .node {
                    position: absolute;
                    width: 90px;
                    text-align: center;
                    z-index: 2;
                    transition: all 0.3s ease;
                }

                .icon-box {
                    width: 56px; height: 56px;
                    margin: 0 auto;
                    border-radius: 50%;
                    border: 2px solid rgba(255,255,255,0.1);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(20,20,30, 0.8);
                    font-size: 28px;
                    box-shadow: 0 0 15px rgba(0,0,0,0.5);
                    backdrop-filter: blur(5px);
                    transition: all 0.3s ease;
                    position: relative;
                }

                /* Active Glow Effect */
                .node[active="true"] .icon-box {
                    border-color: var(--glow-color);
                    box-shadow: 0 0 25px var(--glow-color), inset 0 0 10px var(--glow-color);
                    color: white;
                    animation: pulse 2s infinite;
                }

                .node[active="true"] .icon-box::after {
                    content: '';
                    position: absolute;
                    top: -5px; left: -5px; right: -5px; bottom: -5px;
                    border-radius: 50%;
                    border: 2px solid var(--glow-color);
                    opacity: 0;
                    animation: ripple 1.5s infinite;
                }

                @keyframes pulse {
                    0% { box-shadow: 0 0 15px var(--glow-color); }
                    50% { box-shadow: 0 0 30px var(--glow-color); }
                    100% { box-shadow: 0 0 15px var(--glow-color); }
                }

                @keyframes ripple {
                    0% { transform: scale(0.9); opacity: 1; }
                    100% { transform: scale(1.5); opacity: 0; }
                }

                .text { margin-top: 8px; text-shadow: 0 2px 4px rgba(0,0,0,0.8); }
                .val { font-weight: 800; font-size: 16px; letter-spacing: 0.5px; }
                .lbl { font-size: 11px; opacity: 0.6; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; }

                /* Positions */
                .pos-solar { top: 25px; left: 50%; transform: translateX(-50%); }
                .pos-bat   { top: 50%; left: 25px; transform: translateY(-50%); }
                .pos-grid  { top: 50%; right: 25px; transform: translateY(-50%); }
                .pos-home  { bottom: 25px; left: 50%; transform: translateX(-50%); }

                /* Flow Path Styling */
                path {
                    filter: drop-shadow(0 0 3px currentColor);
                }
            </style>

            <div class="card">
                <div class="grid-bg"></div>
                
                <!-- SVG Canvas for flows -->
                <svg class="canvas" viewBox="0 0 320 340">
                    <defs>
                        <!-- Gradients for lines -->
                        <linearGradient id="grad-solar" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="100%">
                            <stop offset="0%" stop-color="${cSolar}" stop-opacity="0.8"/>
                            <stop offset="100%" stop-color="${cSolar}" stop-opacity="0.1"/>
                        </linearGradient>
                    </defs>

                    ${isSolar ? this.makeFlow(160, 80, 160, 260, solar, cSolar) : ''}          <!-- Solar->Home -->
                    ${isBatCharge ? this.makeFlow(160, 80, 60, 170, solar, cSolar) : ''}       <!-- Solar->Bat -->
                    ${isBatDischarge ? this.makeFlow(60, 170, 160, 260, vBat, cBat) : ''}      <!-- Bat->Home -->
                    ${isGridImport ? this.makeFlow(260, 170, 160, 260, vGrid, cGrid) : ''}     <!-- Grid->Home -->
                    ${isGridExport && isSolar ? this.makeFlow(160, 80, 260, 170, vGrid, cSolar) : ''} <!-- Solar->Export -->
                </svg>

                ${this.makeNode('solar', solar, '☀️', 'Solar', 'pos-solar', cSolar, isSolar)}
                ${this.makeNode('bat', vBat, '🔋', 'Storage', 'pos-bat', cBat, isBatCharge || isBatDischarge)}
                ${this.makeNode('grid', vGrid, '⚡', 'Grid', 'pos-grid', cGrid, isGridImport || isGridExport)}
                ${this.makeNode('home', home, '🏠', 'Home', 'pos-home', cHome, isHome)}
            </div>
        `;
    }

    makeNode(id, val, icon, label, posClass, color, active) {
        return `
        <div class="node ${posClass}" active="${active}" style="--glow-color: ${color}">
            <div class="icon-box" style="color: ${active ? 'white' : color}">${icon}</div>
            <div class="text">
                <div class="val" style="color: ${active ? color : '#aaa'}">${Math.round(val)} W</div>
                <div class="lbl">${label}</div>
            </div>
        </div>
        `;
    }

    makeFlow(x1, y1, x2, y2, watts, color) {
        if (watts < 1) return '';
        // Faster animation for higher watts
        // Cap at 0.5s for very high power, 4s for very low
        const dur = Math.max(0.6, 4 - (Math.log(watts + 1) / 2));

        return `
            <!-- Background faint line -->
            <path d="M${x1},${y1} L${x2},${y2}" stroke="${color}" stroke-opacity="0.1" stroke-width="4" fill="none" />
            
            <!-- Moving particle -->
            <circle r="5" fill="${color}" filter="drop-shadow(0 0 4px ${color})">
                <animateMotion dur="${dur}s" repeatCount="indefinite" path="M${x1},${y1} L${x2},${y2}" calcMode="linear" />
            </circle>
            
            <!-- Second particle for high power -->
            ${watts > 800 ? `
            <circle r="3" fill="${color}" opacity="0.7">
                <animateMotion dur="${dur}s" begin="${dur / 2}s" repeatCount="indefinite" path="M${x1},${y1} L${x2},${y2}" calcMode="linear" />
            </circle>` : ''}
        `;
    }

    getCardSize() {
        return 5;
    }
}

// --- VISUAL EDITOR ---
class FlowOpenKairoEditor extends HTMLElement {
    setConfig(config) {
        this._config = config;
        this.render();
    }

    configChanged(newConfig) {
        const event = new Event("config-changed", {
            bubbles: true,
            composed: true,
        });
        event.detail = { config: newConfig };
        this.dispatchEvent(event);
    }

    set hass(hass) {
        this._hass = hass;
        // Re-render only if necessary to update entity pickers, potentially optimizable
    }

    render() {
        if (!this.shadowRoot) {
            this.attachShadow({ mode: 'open' });
        }

        const c = this._config || {};

        this.shadowRoot.innerHTML = `
            <style>
                .row { display: flex; align-items: center; margin-bottom: 12px; }
                .label { width: 100px; font-weight: bold; }
                input[type="text"] { flex: 1; padding: 6px; border-radius: 4px; border: 1px solid #ccc; }
                input[type="color"] { width: 50px; height: 30px; border: none; padding: 0; }
                .section { margin-bottom: 24px; border-bottom: 1px solid #444; padding-bottom: 8px; font-size: 14px; text-transform: uppercase; color: var(--primary-color); }
            </style>

            <div class="card-config">
                
                <div class="section">Entities</div>
                
                <div class="row">
                    <div class="label">Solar</div>
                    <ha-entity-picker 
                        .hass="${this._hass}" 
                        .value="${c.solar}"
                        .configValue="${'solar'}"
                        domain-filter="sensor"
                        @value-changed="${this._valueChanged}">
                    </ha-entity-picker>
                </div>

                <div class="row">
                    <div class="label">Battery</div>
                     <ha-entity-picker 
                        .hass="${this._hass}" 
                        .value="${c.battery}"
                        .configValue="${'battery'}"
                        domain-filter="sensor"
                        @value-changed="${this._valueChanged}">
                    </ha-entity-picker>
                </div>

                <div class="row">
                    <div class="label">Grid</div>
                     <ha-entity-picker 
                        .hass="${this._hass}" 
                        .value="${c.grid}"
                        .configValue="${'grid'}"
                        domain-filter="sensor"
                        @value-changed="${this._valueChanged}">
                    </ha-entity-picker>
                </div>

                <div class="row">
                    <div class="label">Home</div>
                     <ha-entity-picker 
                        .hass="${this._hass}" 
                        .value="${c.home}"
                        .configValue="${'home'}"
                        domain-filter="sensor"
                        @value-changed="${this._valueChanged}">
                    </ha-entity-picker>
                </div>

                <div class="section" style="margin-top: 20px;">Colors</div>

                <div class="row">
                    <div class="label">Solar Color</div>
                    <input type="color" value="${c.color_solar || '#ffcc00'}" configValue="color_solar" @change="${this._valueChanged}">
                </div>
                 <div class="row">
                    <div class="label">Battery Color</div>
                    <input type="color" value="${c.color_battery || '#00ff66'}" configValue="color_battery" @change="${this._valueChanged}">
                </div>
                 <div class="row">
                    <div class="label">Grid Color</div>
                    <input type="color" value="${c.color_grid || '#00ccff'}" configValue="color_grid" @change="${this._valueChanged}">
                </div>
                 <div class="row">
                    <div class="label">Home Color</div>
                    <input type="color" value="${c.color_home || '#ff00ff'}" configValue="color_home" @change="${this._valueChanged}">
                </div>

            </div>
        `;

        // Bind events manually because @ expressions in innerHTML obviously strictly don't work in raw JS without Lit
        this.shadowRoot.querySelectorAll('ha-entity-picker').forEach(el => {
            el.hass = this._hass; // Ensure hass is passed down
            el.addEventListener('value-changed', (e) => this._valueChanged(e));
        });
        this.shadowRoot.querySelectorAll('input').forEach(el => {
            el.addEventListener('change', (e) => this._valueChanged(e));
        });
    }

    _valueChanged(ev) {
        if (!this._config || !this._hass) return;
        const target = ev.target;
        const configValue = target.configValue || target.getAttribute('configValue');
        const value = ev.detail && ev.detail.value !== undefined ? ev.detail.value : target.value;

        if (this._config[configValue] === value) return;

        const newConfig = {
            ...this._config,
            [configValue]: value,
        };
        this.configChanged(newConfig);
    }
}


customElements.define('flow-openkairo-editor', FlowOpenKairoEditor);
customElements.define('flow-openkairo', FlowOpenKairo);
window.customCards = window.customCards || [];
window.customCards.push({
    type: 'flow-openkairo',
    name: 'Flow OpenKairo',
    preview: true,
    description: 'Neon styled solar flow card'
});
