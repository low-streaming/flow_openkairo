
import { LitElement, html, css, nothing } from 'lit';
import { property, customElement, state } from 'lit/decorators.js';

@customElement('flow-openkairo-card-editor')
export class FlowOpenKairoCardEditor extends LitElement {
    @property({ attribute: false }) public hass: any;
    @state() private _config: any;

    public setConfig(config: any): void {
        this._config = config;
    }

    private _getEntity(key: string): string {
        if (!this._config || !this._config[key]) return '';
        const conf = this._config[key];
        if (typeof conf === 'string') return conf;
        return conf.entity || '';
    }

    private _valueChanged(ev: any, key: string) {
        if (!this._config || !this.hass) return;

        const value = ev.detail.value;
        const currentConf = this._config[key];

        // Always try to maintain the existing type (string or object)
        // If it doesn't exist, start as string for simplicity
        let newKeyConf;
        if (typeof currentConf === 'object' && currentConf !== null) {
            newKeyConf = { ...currentConf, entity: value };
        } else {
            // If it was a string or undefined, update as string to keep config simple
            // unless user explicitly wants advanced config (which we can add later)
            // But wait, the user wanted advanced config (colors). 
            // Let's stick to the flexible approach:
            // If it's a string, update the string. 
            // If it's an object, update the entity property.
            if (currentConf === undefined || typeof currentConf === 'string') {
                newKeyConf = value;
            } else {
                newKeyConf = { ...currentConf, entity: value };
            }
        }

        const newConfig = {
            ...this._config,
            [key]: newKeyConf
        };

        this._fireConfigChanged(newConfig);
    }

    private _toggleChanged(ev: any, key: string) {
        if (!this._config || !this.hass) return;
        const value = ev.target.checked;

        if (this._config[key] === value) return;

        const newConfig = {
            ...this._config,
            [key]: value
        };

        this._fireConfigChanged(newConfig);
    }

    private _fireConfigChanged(config: any) {
        this._config = config;
        const event = new CustomEvent("config-changed", {
            detail: { config: config },
            bubbles: true,
            composed: true,
        });
        this.dispatchEvent(event);
    }

    render() {
        if (!this.hass || !this._config) {
            // Render anyway but maybe with a warning or disabled state if strictly necessary
            // But usually better to render the structure so HA can attach event listeners
        }

        const entities = ['solar', 'battery', 'grid', 'home'];

        return html`
            <div class="card-config">
                <h3>Entities</h3>
                ${this._renderEntityPicker('Solar Power', 'solar', ['sensor', 'input_number'])}
                ${this._renderEntityPicker('Battery Power', 'battery', ['sensor', 'input_number'])}
                ${this._renderEntityPicker('Grid Power', 'grid', ['sensor', 'input_number'])}
                ${this._renderEntityPicker('Home Consumption', 'home', ['sensor', 'input_number'])}
                
                <h3>Options</h3>
                ${this._renderSwitch('Invert Battery (Active = Charge)', 'invert_battery')}
                ${this._renderSwitch('Invert Grid (Active = Import)', 'invert_grid')}
                
                <p class="info">
                    Hinweis: Sie können zwischen einfachen Entitäten (Text) und erweiterten Objekten (Farbe, Icon) wählen. 
                    Der Editor unterstützt primär die Auswahl der Entität.
                </p>
            </div>
        `;
    }

    private _renderEntityPicker(label: string, key: string, domains?: string[]) {
        const value = this._getEntity(key);
        return html`
            <div class="option">
                <ha-entity-picker
                    .label=${label}
                    .hass=${this.hass}
                    .value=${value}
                    .includeDomains=${domains}
                    @value-changed=${(ev: any) => this._valueChanged(ev, key)}
                    allow-custom-entity
                ></ha-entity-picker>
            </div>
        `;
    }

    private _renderSwitch(label: string, key: string) {
        // Safe access to config
        const checked = this._config ? this._config[key] === true : false;

        return html`
            <div class="row">
                <ha-switch
                    .checked=${checked}
                    .disabled=${!this._config}
                    @change=${(ev: any) => this._toggleChanged(ev, key)}
                ></ha-switch>
                <span>${label}</span>
            </div>
        `;
    }

    static styles = css`
        .card-config { display: flex; flex-direction: column; gap: 16px; padding: 16px 0; }
        .option { display: flex; flex-direction: column; gap: 8px; }
        .row { display: flex; align-items: center; gap: 12px; }
        .info { font-style: italic; opacity: 0.7; font-size: 0.9em; margin-top: 16px; }
    `;
}
