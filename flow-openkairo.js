console.log("FLOW OPENKAIRO: VERSION VERTICAL FIX");
class FlowOpenKairo extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._stateKey = '';
    }

    setConfig(config) {
        this.config = config;
    }

    set hass(hass) {
        this._hass = hass;
        this.update();
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

    formatPower(w) {
        if (w >= 1000) return (w / 1000).toFixed(1) + ' kW';
        return Math.round(w) + ' W';
    }

    getDur(w) {
        if (w < 1) return 0;
        return Math.max(0.5, 4 - (Math.log(w + 1) / 1.5));
    }

    update() {
        if (!this.config || !this._hass) return;

        const solar = this.getVal(this.config.solar);
        const battery = this.getVal(this.config.battery);
        const grid = this.getVal(this.config.grid);
        const home = this.getVal(this.config.home);
        const miner = this.getVal(this.config.miner);
        const heatpump = this.getVal(this.config.heatpump);
        const ev = this.getVal(this.config.ev);

        const isSolar = solar > 1;
        let isBatCharge = false;
        let isBatDischarge = false;
        if (this.config.invert_battery) {
            isBatCharge = battery < -1;
            isBatDischarge = battery > 1;
        } else {
            isBatCharge = battery > 1;
            isBatDischarge = battery < -1;
        }

        const isGridImport = grid > 1;
        const isGridExport = grid < -1;
        const isHome = home > 1;
        const isMiner = miner > 1;
        const isHP = heatpump > 1;
        const isEV = ev > 1;

        const newStateKey = [isSolar, isBatCharge, isBatDischarge, isGridImport, isGridExport, isHome, isMiner, isHP, isEV].map(b => b ? '1' : '0').join('');

        if (this._stateKey !== newStateKey || !this.shadowRoot.innerHTML) {
            this._stateKey = newStateKey;
            this.renderDOM({
                solar, battery, grid, home, miner, heatpump, ev,
                isSolar, isBatCharge, isBatDischarge, isGridImport, isGridExport, isHome, isMiner, isHP, isEV
            });
        } else {
            this.updateValues({
                solar, battery, grid, home, miner, heatpump, ev,
                isSolar, isBatCharge, isBatDischarge, isGridImport, isGridExport, isHome, isMiner, isHP, isEV
            });
        }
    }

    renderDOM(vals) {
        const c = this.config;
        const width = 320;
        const height = 440;
        const cx = 160;
        const cy = 150;

        const posSolar = { x: cx, y: 50 };
        const posBat = { x: 50, y: cy };
        const posGrid = { x: width - 50, y: cy };
        const posHome = { x: cx, y: 260 };

        const posMiner = { x: 50, y: 380 };
        const posHP = { x: cx, y: 380 };
        const posEV = { x: width - 50, y: 380 };

        const cSolar = c.color_solar || '#ffcc00';
        const cBat = c.color_battery || '#00ff66';
        const cGrid = c.color_grid || '#00ccff';
        const cHome = c.color_home || '#ff00ff';
        const cMiner = c.color_miner || '#9c27b0';
        const cHP = c.color_heatpump || '#ff5722';
        const cEV = c.color_ev || '#2196f3';

        this.shadowRoot.innerHTML = `
            <style>
                :host { display: block; }
                .card {
                    background: linear-gradient(135deg, #101014 0%, #1a1a24 100%);
                    border-radius: 20px;
                    padding: 16px;
                    box-shadow: 0 10px 20px rgba(0,0,0,0.5);
                    color: white; font-family: 'Segoe UI', sans-serif;
                    position: relative; height: ${height}px;
                    display: flex; justify-content: center; align-items: center;
                    overflow: hidden; box-sizing: border-box;
                }
                .bg-grid {
                    position: absolute; inset: 0;
                    background-image: 
                        linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
                    background-size: 30px 30px; opacity: 0.3; pointer-events: none;
                }
                .canvas { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1; }
                .node { position: absolute; width: 70px; text-align: center; z-index: 2; transform: translate(-50%, -50%); transition: all 0.3s ease; }
                .icon-circle {
                    width: 50px; height: 50px; margin: 0 auto 6px auto;
                    border-radius: 50%; background: rgba(30, 30, 40, 0.6);
                    backdrop-filter: blur(5px);
                    border: 2px solid rgba(255,255,255,0.08);
                    display: flex; align-items: center; justify-content: center;
                    font-size: 24px; box-shadow: 0 4px 10px rgba(0,0,0,0.3);
                }
                .node[active="true"] .icon-circle {
                    border-color: var(--color);
                    box-shadow: 0 0 15px var(--color), inset 0 0 10px var(--color-alpha);
                    color: var(--color);
                }
                .val { font-weight: 700; font-size: 14px; text-shadow: 0 2px 4px black; }
                .lbl { font-size: 10px; opacity: 0.6; text-transform: uppercase; font-weight: 600; margin-top: 2px; }
                ha-icon { --mdc-icon-size: 26px; }
            </style>
            <div class="card">
                <div class="bg-grid"></div>
                <svg class="canvas" viewBox="0 0 ${width} ${height}">
                    <defs>
                        <filter id="glow"><feGaussianBlur stdDeviation="2.5" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                    </defs>
                    ${vals.isSolar ? this.drawFlow(posSolar, { x: cx, y: cy }, vals.solar, cSolar, 'solar') : ''}
                    ${vals.isBatCharge ? this.drawFlow({ x: cx, y: cy }, posBat, vals.solar, cSolar, 'bat-charge') : ''}
                    ${vals.isBatDischarge ? this.drawFlow(posBat, { x: cx, y: cy }, Math.abs(vals.battery), cBat, 'bat-discharge') : ''}
                    ${vals.isGridImport ? this.drawFlow(posGrid, { x: cx, y: cy }, Math.abs(vals.grid), cGrid, 'grid-import') : ''}
                    ${vals.isGridExport ? this.drawFlow({ x: cx, y: cy }, posGrid, Math.abs(vals.grid), cSolar, 'grid-export') : ''}
                    ${vals.isHome ? this.drawFlow({ x: cx, y: cy }, posHome, vals.home, cHome, 'home') : ''}
                    ${vals.isMiner ? this.drawFlow({ x: cx, y: cy }, posMiner, vals.miner, cMiner, 'miner', true) : ''}
                    ${vals.isHP ? this.drawFlow({ x: cx, y: cy }, posHP, vals.heatpump, cHP, 'hp', true) : ''}
                    ${vals.isEV ? this.drawFlow({ x: cx, y: cy }, posEV, vals.ev, cEV, 'ev', true) : ''}
                </svg>
                ${this.renderNode(vals.solar, 'mdi:solar-power', 'Solar', posSolar, cSolar, vals.isSolar, 'solar')}
                ${this.renderNode(Math.abs(vals.battery), 'mdi:battery-high', 'Batterie', posBat, cBat, vals.isBatCharge || vals.isBatDischarge, 'battery')}
                ${this.renderNode(Math.abs(vals.grid), 'mdi:transmission-tower', 'Netz', posGrid, cGrid, vals.isGridImport || vals.isGridExport, 'grid')}
                ${this.renderNode(vals.home, 'mdi:home-lightning', 'Haus', posHome, cHome, vals.isHome, 'home')}
                ${c.miner ? this.renderNode(vals.miner, 'mdi:pickaxe', 'Miner', posMiner, cMiner, vals.isMiner, 'miner') : ''}
                ${c.heatpump ? this.renderNode(vals.heatpump, 'mdi:heat-pump', 'Wärmep.', posHP, cHP, vals.isHP, 'heatpump') : ''}
                ${c.ev ? this.renderNode(vals.ev, 'mdi:car-electric', 'E-Auto', posEV, cEV, vals.isEV, 'ev') : ''}
            </div>
        `;
    }

    updateValues(vals) {
        this.updNode('solar', vals.solar);
        this.updNode('battery', Math.abs(vals.battery));
        this.updNode('grid', Math.abs(vals.grid));
        this.updNode('home', vals.home);
        this.updNode('miner', vals.miner);
        this.updNode('heatpump', vals.heatpump);
        this.updNode('ev', vals.ev);

        this.updFlow('solar', vals.solar);
        this.updFlow('bat-charge', vals.solar);
        this.updFlow('bat-discharge', Math.abs(vals.battery));
        this.updFlow('grid-import', Math.abs(vals.grid));
        this.updFlow('grid-export', Math.abs(vals.grid));
        this.updFlow('home', vals.home);
        this.updFlow('miner', vals.miner);
        this.updFlow('hp', vals.heatpump);
        this.updFlow('ev', vals.ev);
    }

    updNode(id, val) {
        const el = this.shadowRoot.getElementById('val-' + id);
        if (el) el.innerText = this.formatPower(val);
    }

    updFlow(id, val) {
        const el = this.shadowRoot.getElementById('anim-' + id);
        if (el) el.setAttribute('dur', this.getDur(val) + 's');
    }

    renderNode(val, icon, label, pos, color, active, id) {
        const alpha = color + '40';
        return `
        <div class="node" active="${active}" style="left:${pos.x}px; top:${pos.y}px; --color: ${color}; --color-alpha: ${alpha}">
            <div class="icon-circle"><ha-icon icon="${icon}"></ha-icon></div>
            <div class="val" id="val-${id}" style="color: ${active ? color : '#bbb'}">${this.formatPower(val)}</div>
            <div class="lbl">${label}</div>
        </div>`;
    }

    drawFlow(start, end, watts, color, id, isSecondary) {
        if (watts < 1) return '';
        const dur = this.getDur(watts);
        let path = `M ${start.x},${start.y} L ${end.x},${end.y}`;
        if (isSecondary) {
            if (start.x === end.x) path = `M ${start.x},${start.y} L ${end.x},${end.y}`;
            else path = `M ${start.x},${start.y} Q ${start.x},${end.y} ${end.x},${end.y}`;
        }
        return `
            <path d="${path}" stroke="${color}" stroke-opacity="0.15" stroke-width="3" fill="none" />
            <circle r="4" fill="${color}" filter="url(#glow)">
                <animateMotion id="anim-${id}" dur="${dur}s" repeatCount="indefinite" path="${path}" calcMode="linear" />
            </circle>
            ${watts > 800 ? `<circle r="2" fill="${color}" opacity="0.6"><animateMotion dur="${dur}s" begin="${dur / 3}s" repeatCount="indefinite" path="${path}" calcMode="linear" /></circle>` : ''}
        `;
    }
    getCardSize() { return 10; }
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

        if (!this._initialized) {
            this.shadowRoot.innerHTML = `
                <style>
                    :host { display: block; padding: 20px; overflow: visible; }
                    .row { margin-bottom: 12px; }
                    .row.inline { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
                    .header { font-weight: bold; text-transform: uppercase; color: var(--primary-color); margin: 24px 0 12px 0; border-bottom: 1px solid var(--divider-color); }
                    .header:first-child { margin-top: 0; }
                    .label { display: flex; align-items: center; margin-bottom: 8px; font-weight: 500; }
                    .label ha-icon { margin-right: 8px; color: var(--secondary-text-color); }
                    ha-entity-picker { display: block; width: 100%; box-sizing: border-box; }
                    input[type="color"] { border: none; background: none; width: 40px; height: 30px; cursor: pointer; }
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
                    <div class="row inline">
                        <div class="label">Batterie-Logik umkehren</div>
                        <ha-switch id="sw-invert"></ha-switch>
                    </div>
                </div>
            `;

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

        this.updateValues();
    }

    updateValues() {
        const c = this._config;

        this.shadowRoot.querySelectorAll('ha-entity-picker').forEach(p => {
            const key = p.getAttribute('configValue');
            if (p.value !== c[key]) p.value = c[key] || '';
            if (p.hass !== this._hass) p.hass = this._hass;
        });

        this.shadowRoot.querySelectorAll('input[type="color"]').forEach(i => {
            const key = i.getAttribute('configValue');
            if (i.value !== (c[key] || '#ffffff')) i.value = c[key] || '#ffffff';
        });

        const sw = this.shadowRoot.querySelector('#sw-invert');
        if (sw.checked !== (c.invert_battery === true)) {
            sw.checked = c.invert_battery === true;
        }
    }

    makeRow(key, name, icon) {
        return `
        <div class="row">
            <div class="label"><ha-icon icon="${icon}"></ha-icon> ${name}</div>
            <ha-entity-picker configValue="${key}"></ha-entity-picker>
        </div>`;
    }

    makeColor(key, name) {
        return `
        <div class="row inline">
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
        description: 'Neon Solar Flow'
    });
}
