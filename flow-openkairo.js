class FlowOpenKairo extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    setConfig(config) {
        if (!config.solar && !config.battery && !config.grid) {
            // relaxed check
        }
        this.config = config;
    }

    set hass(hass) {
        this._hass = hass;
        this.render();
    }

    // Stub setup
    static getStubConfig() {
        return {
            solar: "sensor.solar_power",
            battery: "sensor.battery_power",
            grid: "sensor.grid_power",
            home: "sensor.home_consumption",
            // Extras
            miner: "",
            heatpump: "",
            ev: "",
            // Colors
            color_solar: "#ffcc00",
            color_battery: "#00ff66",
            color_grid: "#00ccff",
            color_home: "#ff00ff",
            color_miner: "#9c27b0",
            color_heatpump: "#ff5722",
            color_ev: "#2196f3"
        };
    }

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

        // Entities
        const solar = this.getVal(this.config.solar);
        const battery = this.getVal(this.config.battery);
        const grid = this.getVal(this.config.grid);
        const home = this.getVal(this.config.home);

        // New Entities (Optional)
        const miner = this.config.miner ? this.getVal(this.config.miner) : 0;
        const heatpump = this.config.heatpump ? this.getVal(this.config.heatpump) : 0;
        const ev = this.config.ev ? this.getVal(this.config.ev) : 0;

        // Custom Colors
        const cSolar = this.config.color_solar || '#ffcc00';
        const cBat = this.config.color_battery || '#00ff66';
        const cGrid = this.config.color_grid || '#00ccff';
        const cHome = this.config.color_home || '#ff00ff';
        const cMiner = this.config.color_miner || '#B0278A';
        const cHP = this.config.color_heatpump || '#ff5722';
        const cEV = this.config.color_ev || '#2196f3';

        // Logic
        const isSolar = solar > 2;
        const isBatCharge = battery > 2;
        const isBatDischarge = battery < -2;
        const isGridImport = grid > 2;
        const isGridExport = grid < -2;
        const isHome = home > 2;

        const isMiner = miner > 2;
        const isHP = heatpump > 2;
        const isEV = ev > 2;

        const vBat = Math.abs(battery);
        const vGrid = Math.abs(grid);

        // Coordinates
        // Center: 160, 150 (shifted up slightly to make room at bottom)
        const cx = 160, cy = 140;
        const solarPos = { x: 160, y: 40 };
        const batPos = { x: 40, y: 140 };
        const gridPos = { x: 280, y: 140 };
        const homePos = { x: 160, y: 240 };

        // Extra consumers at the bottom
        const minerPos = { x: 80, y: 320 };
        const hpPos = { x: 160, y: 320 };
        const evPos = { x: 240, y: 320 };

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
                    height: 400px; /* Increased height */
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border: 1px solid rgba(255,255,255,0.08);
                    overflow: hidden;
                }
                
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
                    width: 80px;
                    text-align: center;
                    z-index: 2;
                    transition: all 0.3s ease;
                }

                .icon-box {
                    width: 48px; height: 48px;
                    margin: 0 auto;
                    border-radius: 50%;
                    border: 2px solid rgba(255,255,255,0.1);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(20,20,30, 0.8);
                    font-size: 24px;
                    box-shadow: 0 0 15px rgba(0,0,0,0.5);
                    backdrop-filter: blur(5px);
                    transition: all 0.3s ease;
                    position: relative;
                }

                .node[active="true"] .icon-box {
                    border-color: var(--glow-color);
                    box-shadow: 0 0 20px var(--glow-color), inset 0 0 5px var(--glow-color);
                    color: white;
                    animation: pulse 2s infinite;
                }

                @keyframes pulse {
                    0% { box-shadow: 0 0 10px var(--glow-color); }
                    50% { box-shadow: 0 0 25px var(--glow-color); }
                    100% { box-shadow: 0 0 10px var(--glow-color); }
                }

                .text { margin-top: 4px; text-shadow: 0 2px 4px rgba(0,0,0,0.8); }
                .val { font-weight: 800; font-size: 14px; letter-spacing: 0.5px; }
                .lbl { font-size: 10px; opacity: 0.6; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; }

                /* Node Positions */
                .pos-solar { top: ${solarPos.y}px; left: ${solarPos.x}px; transform: translate(-50%, -50%); }
                .pos-bat   { top: ${batPos.y}px; left: ${batPos.x}px; transform: translate(-50%, -50%); }
                .pos-grid  { top: ${gridPos.y}px; left: ${gridPos.x}px; transform: translate(-50%, -50%); }
                .pos-home  { top: ${homePos.y}px; left: ${homePos.x}px; transform: translate(-50%, -50%); }
                
                .pos-miner { top: ${minerPos.y}px; left: ${minerPos.x}px; transform: translate(-50%, -50%); }
                .pos-hp    { top: ${hpPos.y}px; left: ${hpPos.x}px; transform: translate(-50%, -50%); }
                .pos-ev    { top: ${evPos.y}px; left: ${evPos.x}px; transform: translate(-50%, -50%); }

                path {
                    filter: drop-shadow(0 0 3px currentColor);
                }
            </style>

            <div class="card">
                <div class="grid-bg"></div>
                <!-- SVG Canvas -->
                <svg class="canvas" viewBox="0 0 320 400">
                    <!-- Standard Flows -->
                    ${isSolar ? this.makeFlow(solarPos.x, solarPos.y + 25, cx, cy, solar, cSolar) : ''}          <!-- Solar->Center -->
                    ${isBatCharge ? this.makeFlow(cx, cy, batPos.x + 25, batPos.y, solar, cSolar) : ''}          <!-- Center->Bat -->
                    ${isBatDischarge ? this.makeFlow(batPos.x + 25, batPos.y, cx, cy, vBat, cBat) : ''}          <!-- Bat->Center -->
                    ${isGridImport ? this.makeFlow(gridPos.x - 25, gridPos.y, cx, cy, vGrid, cGrid) : ''}        <!-- Grid->Center -->
                    ${isGridExport ? this.makeFlow(cx, cy, gridPos.x - 25, gridPos.y, vGrid, cSolar) : ''}       <!-- Center->Grid -->
                    ${isHome ? this.makeFlow(cx, cy, homePos.x, homePos.y - 25, home, cHome) : ''}               <!-- Center->Home -->

                    <!-- Extra Consumers (fed from Center) -->
                    ${isMiner && this.config.miner ? this.makeFlow(cx, cy + 10, minerPos.x, minerPos.y - 25, miner, cMiner) : ''}
                    ${isHP && this.config.heatpump ? this.makeFlow(cx, cy + 10, hpPos.x, hpPos.y - 25, heatpump, cHP) : ''}
                    ${isEV && this.config.ev ? this.makeFlow(cx, cy + 10, evPos.x, evPos.y - 25, ev, cEV) : ''}
                </svg>

                ${this.makeNode('solar', solar, '☀️', 'Solar', 'pos-solar', cSolar, isSolar)}
                ${this.makeNode('bat', vBat, '🔋', 'Speicher', 'pos-bat', cBat, isBatCharge || isBatDischarge)}
                ${this.makeNode('grid', vGrid, '⚡', 'Netz', 'pos-grid', cGrid, isGridImport || isGridExport)}
                ${this.makeNode('home', home, '🏠', 'Haus', 'pos-home', cHome, isHome)}

                <!-- Extra Nodes -->
                ${this.config.miner ? this.makeNode('miner', miner, '⛏️', 'Miner', 'pos-miner', cMiner, isMiner) : ''}
                ${this.config.heatpump ? this.makeNode('hp', heatpump, '🌡️', 'WP', 'pos-hp', cHP, isHP) : ''}
                ${this.config.ev ? this.makeNode('ev', ev, '🚗', 'E-Auto', 'pos-ev', cEV, isEV) : ''}
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
        const dur = Math.max(0.6, 4 - (Math.log(watts + 1) / 2));

        return `
            <path d="M${x1},${y1} L${x2},${y2}" stroke="${color}" stroke-opacity="0.1" stroke-width="2" fill="none" />
            <circle r="4" fill="${color}" filter="drop-shadow(0 0 4px ${color})">
                <animateMotion dur="${dur}s" repeatCount="indefinite" path="M${x1},${y1} L${x2},${y2}" calcMode="linear" />
            </circle>
        `;
    }

    getCardSize() {
        return 6;
    }
}

// --- VISUAL EDITOR (PROPER FIX) ---
class FlowOpenKairoEditor extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        // We will build the DOM once in connectedCallback or first render
        this._domBuilt = false;
    }

    setConfig(config) {
        this._config = config;
        this.updateDOM();
    }

    configChanged(newConfig) {
        const event = new Event("config-changed", { bubbles: true, composed: true });
        event.detail = { config: newConfig };
        this.dispatchEvent(event);
    }

    set hass(hass) {
        this._hass = hass;
        this.updatePickers();
    }

    // New method to strictly update values without rebuilding DOM
    updateDOM() {
        if (!this._config) return;

        // Build structure ONCE
        if (!this._domBuilt) {
            this.buildStructure();
            this._domBuilt = true;
        }

        // Update Values of existing inputs
        if (this.shadowRoot) {
            // Entities
            const entities = ['solar', 'battery', 'grid', 'home', 'miner', 'heatpump', 'ev'];
            entities.forEach(key => {
                const picker = this.shadowRoot.querySelector(`#picker-${key}`);
                if (picker) {
                    picker.value = this._config[key] || '';
                    if (this._hass) picker.hass = this._hass;
                }
            });

            // Colors
            const colors = ['color_solar', 'color_battery', 'color_grid', 'color_home', 'color_miner', 'color_heatpump', 'color_ev'];
            colors.forEach(key => {
                const input = this.shadowRoot.querySelector(`input[configValue="${key}"]`);
                if (input) input.value = this._config[key] || '#ffffff';
            });

            // Switch
            const sw = this.shadowRoot.querySelector('#invert-battery');
            if (sw) sw.checked = this._config['invert_battery'] === true;
        }
    }

    updatePickers() {
        if (this.shadowRoot && this._hass) {
            this.shadowRoot.querySelectorAll('ha-entity-picker').forEach(picker => {
                picker.hass = this._hass;
            });
        }
    }

    buildStructure() {
        const c = this._config;

        this.shadowRoot.innerHTML = `
            <style>
                :host { display: block; padding: 20px; }
                .section { margin-top: 24px; margin-bottom: 12px; font-weight: bold; text-transform: uppercase; color: var(--primary-color); border-bottom: 1px solid #444; }
                .row { display: flex; align-items: center; margin-bottom: 12px; background: rgba(255,255,255,0.03); padding: 8px; border-radius: 8px; }
                .label { flex: 1; display: flex; align-items: center; }
                .label ha-icon { margin-right: 8px; color: var(--secondary-text-color); }
                ha-entity-picker { width: 65%; }
                input[type="color"] { width: 40px; height: 30px; border: none; background: none; }
            </style>

            <div class="card-config">
                <div class="section">Energiequellen</div>
                ${this.makeRow('solar', 'Solar', 'mdi:solar-power')}
                ${this.makeRow('battery', 'Batterie', 'mdi:battery-high')}
                ${this.makeRow('grid', 'Netz', 'mdi:transmission-tower')}
                ${this.makeRow('home', 'Haus', 'mdi:home-lightning')}

                <div class="section">Zusätzliche Verbraucher</div>
                ${this.makeRow('miner', 'Miner', 'mdi:pickaxe')}
                ${this.makeRow('heatpump', 'Wärmepumpe', 'mdi:heat-pump')}
                ${this.makeRow('ev', 'E-Auto', 'mdi:car-electric')}

                <div class="section">Farben</div>
                ${this.makeColor('color_solar', 'Solar Farbe')}
                ${this.makeColor('color_battery', 'Batterie Farbe')}
                ${this.makeColor('color_grid', 'Netz Farbe')}
                ${this.makeColor('color_home', 'Haus Farbe')}
                ${this.makeColor('color_miner', 'Miner Farbe')}
                ${this.makeColor('color_heatpump', 'WP Farbe')}
                ${this.makeColor('color_ev', 'E-Auto Farbe')}
                
                <div class="row">
                    <div class="label">Batterie Invertieren</div>
                    <ha-switch id="invert-battery" configValue="invert_battery"></ha-switch>
                </div>
            </div>
        `;

        // Attach listeners once
        this.shadowRoot.querySelectorAll('ha-entity-picker').forEach(p => {
            p.addEventListener('value-changed', (e) => this._valChange(p.getAttribute('configValue'), e.detail.value));
        });
        this.shadowRoot.querySelectorAll('input').forEach(i => {
            i.addEventListener('change', (e) => this._valChange(i.getAttribute('configValue'), i.value));
        });
        this.shadowRoot.querySelectorAll('ha-switch').forEach(s => {
            s.addEventListener('change', (e) => this._valChange(s.getAttribute('configValue'), s.checked));
        });
    }

    makeRow(key, label, icon) {
        return `
        <div class="row">
            <div class="label"><ha-icon icon="${icon}"></ha-icon> ${label}</div>
            <ha-entity-picker id="picker-${key}" configValue="${key}" domain-filter="sensor"></ha-entity-picker>
        </div>`;
    }

    makeColor(key, label) {
        return `
        <div class="row">
            <div class="label">${label}</div>
            <input type="color" configValue="${key}">
        </div>`;
    }

    _valChange(key, value) {
        if (this._config[key] === value) return;
        const newConfig = { ...this._config, [key]: value };
        this.configChanged(newConfig);
    }
}

if (!customElements.get('flow-openkairo-editor')) {
    customElements.define('flow-openkairo-editor', FlowOpenKairoEditor);
}
if (!customElements.get('flow-openkairo')) {
    customElements.define('flow-openkairo', FlowOpenKairo);
}

window.customCards = window.customCards || [];
if (!window.customCards.some(c => c.type === "flow-openkairo")) {
    window.customCards.push({
        type: 'flow-openkairo',
        name: 'Flow OpenKairo',
        preview: true,
        description: 'Neon styled solar flow card'
    });
}
