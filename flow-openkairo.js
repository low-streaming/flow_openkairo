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
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

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
        // Update all entity pickers with the HASS object so they can list entities
        if (this.shadowRoot) {
            this.shadowRoot.querySelectorAll('ha-entity-picker').forEach(picker => {
                picker.hass = hass;
            });
        }
    }

    render() {
        if (!this._hass || !this._config) return;

        // Render structure only once to avoid losing focus/state, unless minimal
        // For simplicity in this vanilla implementation, we re-render efficiently or checking existence.
        // But to fix the "cannot select" issue quickly, we will re-render and re-bind.

        const c = this._config;

        this.shadowRoot.innerHTML = `
            <style>
                :host { 
                    display: block; 
                    padding: 20px; 
                    background: var(--ha-card-background, var(--card-background-color, #fff)); 
                    border-radius: var(--ha-card-border-radius, 12px);
                }
                
                .section-header {
                    font-size: 12px;
                    font-weight: bold;
                    text-transform: uppercase;
                    color: var(--primary-text-color);
                    opacity: 0.7;
                    margin-bottom: 16px;
                    margin-top: 24px;
                    letter-spacing: 1px;
                }
                .section-header:first-child { margin-top: 0; }
                
                .row {
                    display: flex;
                    align-items: center;
                    margin-bottom: 12px;
                    background: var(--secondary-background-color, rgba(0,0,0,0.03));
                    padding: 12px;
                    border-radius: 8px;
                    border: 1px solid var(--divider-color, rgba(0,0,0,0.05));
                }
                
                .label {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    font-weight: 500;
                    color: var(--primary-text-color);
                }
                
                .label ha-icon {
                    margin-right: 12px;
                    color: var(--primary-color);
                }
                
                ha-entity-picker {
                    width: 70%;
                    --paper-input-container-label: { color: var(--secondary-text-color); };
                    --paper-input-container-input: { color: var(--primary-text-color); };
                }
                
                input[type="color"] {
                    background: none;
                    border: none;
                    width: 40px;
                    height: 40px;
                    cursor: pointer;
                    padding: 0;
                    border-radius: 50%;
                    overflow: hidden;
                }
                
                ha-switch {
                    margin-left: auto;
                }
            </style>

            <div class="card-config">
                
                <div class="section-header">Power Sources</div>
                
                <div class="row">
                    <div class="label"><ha-icon icon="mdi:solar-power"></ha-icon> Solar</div>
                    <ha-entity-picker 
                        id="picker-solar"
                        configValue="solar"
                        domain-filter="sensor">
                    </ha-entity-picker>
                </div>

                <div class="row">
                    <div class="label"><ha-icon icon="mdi:battery-high"></ha-icon> Battery</div>
                    <ha-entity-picker 
                        id="picker-battery"
                        configValue="battery"
                        domain-filter="sensor">
                    </ha-entity-picker>
                </div>

                <div class="row">
                    <div class="label"><ha-icon icon="mdi:transmission-tower"></ha-icon> Grid</div>
                    <ha-entity-picker 
                        id="picker-grid"
                        configValue="grid"
                        domain-filter="sensor">
                    </ha-entity-picker>
                </div>

                <div class="row">
                    <div class="label"><ha-icon icon="mdi:home-lightning"></ha-icon> Home</div>
                    <ha-entity-picker 
                        id="picker-home"
                        configValue="home"
                        domain-filter="sensor">
                    </ha-entity-picker>
                </div>

                <div class="section-header">Style & Color</div>

                <div class="row">
                    <div class="label">Solar Theme</div>
                    <input type="color" id="color-solar" value="${c.color_solar || '#ffcc00'}" configValue="color_solar">
                </div>
                 <div class="row">
                    <div class="label">Battery Theme</div>
                    <input type="color" id="color-battery" value="${c.color_battery || '#00ff66'}" configValue="color_battery">
                </div>
                 <div class="row">
                    <div class="label">Grid Theme</div>
                    <input type="color" id="color-grid" value="${c.color_grid || '#00ccff'}" configValue="color_grid">
                </div>
                 <div class="row">
                    <div class="label">Home Theme</div>
                    <input type="color" id="color-home" value="${c.color_home || '#ff00ff'}" configValue="color_home">
                </div>

                <div class="row">
                    <div class="label" style="font-size: 0.9em; opacity: 0.7;">
                        Invert Battery (+/-)
                    </div>
                    <ha-switch 
                        id="invert-battery"
                        configValue="invert_battery">
                    </ha-switch>
                </div>

            </div>
        `;

        // --- BINDING START ---

        // Bind Entity Pickers
        this.shadowRoot.querySelectorAll('ha-entity-picker').forEach(picker => {
            // 1. Set Critical Properties
            picker.hass = this._hass;

            // 2. Set Current Value
            const key = picker.getAttribute('configValue');
            picker.value = this._config[key];

            // 3. Bind Event
            picker.addEventListener('value-changed', (e) => {
                this._valueChanged({
                    target: {
                        configValue: key,
                        value: e.detail.value
                    }
                });
            });
        });

        // Bind Color Inputs
        this.shadowRoot.querySelectorAll('input[type="color"]').forEach(input => {
            input.addEventListener('input', (e) => this._valueChanged(e));
        });

        // Bind Switches
        this.shadowRoot.querySelectorAll('ha-switch').forEach(sw => {
            // Handle checked state manually since we removed attribute binding
            const key = sw.getAttribute('configValue');
            sw.checked = this._config[key] === true;

            sw.addEventListener('change', (e) => {
                this._valueChanged({
                    target: {
                        configValue: key,
                        value: e.target.checked
                    }
                });
            });
        });
    }

    _valueChanged(ev) {
        if (!this._config || !this._hass) return;

        const target = ev.target;
        // Handle standard events or manual synthetic events
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
