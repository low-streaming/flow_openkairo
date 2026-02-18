class FlowOpenKairo extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    setConfig(config) {
        this.config = config;
    }

    set hass(hass) {
        this._hass = hass;
        this.render();
    }

    static getStubConfig() {
        return {
            solar: "sensor.solar_power",
            battery: "sensor.battery_power",
            grid: "sensor.grid_power",
            home: "sensor.home_consumption",
            miner: "",
            heatpump: "",
            ev: "",
            color_solar: "#ffcc00",
            color_battery: "#00ff66",
            color_grid: "#00ccff",
            color_home: "#ff00ff",
            color_miner: "#9c27b0",
            color_heatpump: "#ff5722",
            color_ev: "#2196f3",
            invert_battery: false
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

        const solar = this.getVal(this.config.solar);
        const battery = this.getVal(this.config.battery);
        const grid = this.getVal(this.config.grid);
        const home = this.getVal(this.config.home);
        const miner = this.getVal(this.config.miner);
        const heatpump = this.getVal(this.config.heatpump);
        const ev = this.getVal(this.config.ev);

        const cSolar = this.config.color_solar || '#ffcc00';
        const cBat = this.config.color_battery || '#00ff66';
        const cGrid = this.config.color_grid || '#00ccff';
        const cHome = this.config.color_home || '#ff00ff';
        const cMiner = this.config.color_miner || '#9c27b0';
        const cHP = this.config.color_heatpump || '#ff5722';
        const cEV = this.config.color_ev || '#2196f3';

        const isSolar = solar > 1;
        const isBatCharge = !this.config.invert_battery ? (battery > 1) : (battery < -1);
        const isBatDischarge = !this.config.invert_battery ? (battery < -1) : (battery > 1);
        const isGridImport = grid > 1;
        const isGridExport = grid < -1;
        const isHome = home > 1;
        const isMiner = miner > 1;
        const isHP = heatpump > 1;
        const isEV = ev > 1;

        const vBat = Math.abs(battery);
        const vGrid = Math.abs(grid);

        // Layout Constants
        const width = 320;
        const height = 400; // Increased height for extra consumers
        const cx = width / 2;
        const cy = 150; // Main Center Point

        // Nodes
        const posSolar = { x: cx, y: 40 };
        const posBat = { x: 50, y: cy };
        const posGrid = { x: width - 50, y: cy };
        const posHome = { x: cx, y: cy + 90 }; // Home pushed down slightly

        // Extra Consumers (Bottom Row)
        const posMiner = { x: 60, y: 340 };
        const posHP = { x: cx, y: 340 };
        const posEV = { x: width - 60, y: 340 };

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
                    height: ${height}px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border: 1px solid rgba(255,255,255,0.08);
                    overflow: hidden;
                    box-sizing: border-box;
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
                .canvas { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1; }
                .node { position: absolute; width: 80px; text-align: center; z-index: 2; transform: translate(-50%, -50%); }
                
                .icon-box {
                    width: 48px; height: 48px; margin: 0 auto;
                    border-radius: 50%; border: 2px solid rgba(255,255,255,0.1);
                    display: flex; align-items: center; justify-content: center;
                    background: rgba(20,20,30, 0.8); font-size: 24px;
                    box-shadow: 0 0 15px rgba(0,0,0,0.5); backdrop-filter: blur(5px);
                    transition: all 0.3s ease;
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
                .text { margin-top: 5px; text-shadow: 0 2px 4px rgba(0,0,0,0.8); }
                .val { font-weight: 700; font-size: 14px; }
                .lbl { font-size: 10px; opacity: 0.7; text-transform: uppercase; font-weight: 600; }
            </style>

            <div class="card">
                <div class="grid-bg"></div>
                <svg class="canvas" viewBox="0 0 ${width} ${height}">
                     <!-- Core Flows -->
                    ${isSolar ? this.makeFlow(posSolar.x, posSolar.y + 25, cx, cy, solar, cSolar) : ''}
                    ${isBatCharge ? this.makeFlow(cx, cy, posBat.x + 25, posBat.y, solar, cSolar) : ''}
                    ${isBatDischarge ? this.makeFlow(posBat.x + 25, posBat.y, cx, cy, vBat, cBat) : ''}
                    ${isGridImport ? this.makeFlow(posGrid.x - 25, posGrid.y, cx, cy, vGrid, cGrid) : ''}
                    ${isGridExport ? this.makeFlow(cx, cy, posGrid.x - 25, posGrid.y, vGrid, cSolar) : ''}
                    ${isHome ? this.makeFlow(cx, cy, posHome.x, posHome.y - 25, home, cHome) : ''}

                    <!-- Extra Flows (Branch from Home) -->
                    ${isMiner ? this.makeFlow(cx, cy + 40, posMiner.x, posMiner.y - 25, miner, cMiner) : ''}
                    ${isHP ? this.makeFlow(cx, cy + 40, posHP.x, posHP.y - 25, heatpump, cHP) : ''}
                    ${isEV ? this.makeFlow(cx, cy + 40, posEV.x, posEV.y - 25, ev, cEV) : ''}
                </svg>

                ${this.makeNode(solar, '☀️', 'Solar', posSolar.x, posSolar.y, cSolar, isSolar)}
                ${this.makeNode(vBat, '🔋', 'Batterie', posBat.x, posBat.y, cBat, isBatCharge || isBatDischarge)}
                ${this.makeNode(vGrid, '⚡', 'Netz', posGrid.x, posGrid.y, cGrid, isGridImport || isGridExport)}
                ${this.makeNode(home, '🏠', 'Haus', posHome.x, posHome.y, cHome, isHome)}

                ${this.config.miner ? this.makeNode(miner, '⛏️', 'Miner', posMiner.x, posMiner.y, cMiner, isMiner) : ''}
                ${this.config.heatpump ? this.makeNode(heatpump, '🌡️', 'Wärmep.', posHP.x, posHP.y, cHP, isHP) : ''}
                ${this.config.ev ? this.makeNode(ev, '🚗', 'E-Auto', posEV.x, posEV.y, cEV, isEV) : ''}
            </div>
        `;
    }

    makeNode(val, icon, label, x, y, color, active) {
        return `
        <div class="node" active="${active}" style="left:${x}px; top:${y}px; --glow-color: ${color}">
            <div class="icon-box" style="color: ${active ? 'white' : color}">${icon}</div>
            <div class="text">
                <div class="val" style="color: ${active ? color : '#bbb'}">${Math.round(val)} W</div>
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

class FlowOpenKairoEditor extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._initialized = false;
    }

    setConfig(config) {
        this._config = config;
        this.render();
    }

    set hass(hass) {
        this._hass = hass;
        // Always attempt to push hass to pickers if they exist, 
        // to ensure they populate even if render was called before hass arrived
        if (this.shadowRoot) {
            this.shadowRoot.querySelectorAll('ha-entity-picker').forEach(picker => {
                if (picker.hass !== hass) picker.hass = hass;
            });
        }
    }

    configChanged(newConfig) {
        this.dispatchEvent(new Event("config-changed", {
            bubbles: true,
            composed: true,
            detail: { config: newConfig }
        }));
    }

    render() {
        if (!this._hass || !this._config) return;

        // 1. Build DOM only once
        if (!this._initialized) {
            this.shadowRoot.innerHTML = `
                <style>
                    :host { display: block; padding: 20px; }
                    .header { 
                        font-weight: bold; text-transform: uppercase; 
                        color: var(--primary-color); margin: 24px 0 12px 0; 
                        border-bottom: 1px solid var(--divider-color); 
                    }
                    .header:first-child { margin-top: 0; }
                    .row { 
                        display: flex; align-items: center; justify-content: space-between; 
                        margin-bottom: 12px; gap: 12px;
                    }
                    .label { display: flex; align-items: center; width: 130px; font-weight: 500; }
                    .label ha-icon { margin-right: 8px; color: var(--secondary-text-color); }
                    ha-entity-picker { flex: 1; }
                    input[type="color"] { border: none; background: none; width: 40px; height: 30px; cursor: pointer;}
                </style>

                <div class="config">
                    <div class="header">Energiequellen</div>
                    ${this.makeRow('solar', 'Solar', 'mdi:solar-power')}
                    ${this.makeRow('battery', 'Batterie', 'mdi:battery-high')}
                    ${this.makeRow('grid', 'Netz', 'mdi:transmission-tower')}
                    ${this.makeRow('home', 'Haus', 'mdi:home-lightning')}

                    <div class="header">Zusätzliche Verbraucher</div>
                    ${this.makeRow('miner', 'Miner', 'mdi:pickaxe')}
                    ${this.makeRow('heatpump', 'Wärmepumpe', 'mdi:heat-pump')}
                    ${this.makeRow('ev', 'E-Auto', 'mdi:car-electric')}

                    <div class="header">Farben</div>
                    ${this.makeColor('color_solar', 'Solar')}
                    ${this.makeColor('color_battery', 'Batterie')}
                    ${this.makeColor('color_grid', 'Netz')}
                    ${this.makeColor('color_home', 'Haus')}
                    ${this.makeColor('color_miner', 'Miner')}
                    ${this.makeColor('color_heatpump', 'Wärmepumpe')}
                    ${this.makeColor('color_ev', 'E-Auto')}

                    <div class="header">Einstellungen</div>
                    <div class="row">
                        <div class="label">Batterie-Logik umkehren</div>
                        <ha-switch id="sw-invert"></ha-switch>
                    </div>
                </div>
            `;

            // Bind Events Once
            this.shadowRoot.querySelectorAll('ha-entity-picker').forEach(p => {
                p.addEventListener('value-changed', (e) => this.upd(p.getAttribute('configValue'), e.detail.value));
            });
            this.shadowRoot.querySelectorAll('input[type="color"]').forEach(i => {
                i.addEventListener('change', (e) => this.upd(i.getAttribute('configValue'), e.target.value));
            });
            const sw = this.shadowRoot.querySelector('#sw-invert');
            sw.addEventListener('change', (e) => this.upd('invert_battery', e.target.checked));

            this._initialized = true;
        }

        // 2. Update Values
        this.updateValues();
    }

    updateValues() {
        const c = this._config;

        // Update Pickers
        this.shadowRoot.querySelectorAll('ha-entity-picker').forEach(p => {
            const key = p.getAttribute('configValue');
            if (p.value !== c[key]) p.value = c[key] || '';
            if (p.hass !== this._hass) p.hass = this._hass;
        });

        // Update Colors
        this.shadowRoot.querySelectorAll('input[type="color"]').forEach(i => {
            const key = i.getAttribute('configValue');
            if (i.value !== (c[key] || '#ffffff')) i.value = c[key] || '#ffffff';
        });

        // Update Switch
        const sw = this.shadowRoot.querySelector('#sw-invert');
        if (sw.checked !== (c.invert_battery === true)) {
            sw.checked = c.invert_battery === true;
        }
    }

    makeRow(key, name, icon) {
        return `
        <div class="row">
            <div class="label"><ha-icon icon="${icon}"></ha-icon> ${name}</div>
            <ha-entity-picker configValue="${key}" domain-filter="sensor"></ha-entity-picker>
        </div>`;
    }

    makeColor(key, name) {
        return `
        <div class="row">
            <div class="label">${name}</div>
            <input type="color" configValue="${key}">
        </div>`;
    }

    upd(key, val) {
        if (this._config[key] === val) return;
        this.configChanged({ ...this._config, [key]: val });
    }
}

customElements.define('flow-openkairo-editor', FlowOpenKairoEditor);
customElements.define('flow-openkairo', FlowOpenKairo);
window.customCards = window.customCards || [];
if (!window.customCards.some(c => c.type === 'flow-openkairo')) {
    window.customCards.push({
        type: 'flow-openkairo',
        name: 'Flow OpenKairo',
        preview: true,
        description: 'Neon styled solar flow card'
    });
}
