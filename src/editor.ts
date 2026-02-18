
import { LitElement, html, css, nothing } from 'lit';
import { property, customElement, state } from 'lit/decorators.js';

@customElement('flow-openkairo-card-editor')
export class FlowOpenKairoCardEditor extends LitElement {
    @property({ attribute: false }) public hass: any;
    @state() private _config: any;

    public setConfig(config: any): void {
        this._config = config;
    }

    private _entityChanged(ev: any, key: string) {
        if (!this._config || !this.hass) {
            return;
        }

        const value = ev.detail.value;

        if (this._config[key]?.entity === value) {
            return;
        }

        const newConfig = {
            ...this._config,
            [key]: {
                ...this._config[key],
                entity: value
            }
        };

        this._FireConfigChanged(newConfig);
    }

    private _toggleChanged(ev: any, key: string) {
        if (!this._config || !this.hass) return;

        const target = ev.target;
        // Invert logic: switch checked = true means "invert" usually
        const checked = target.checked;

        if (this._config[key] === checked) return;

        const newConfig = {
            ...this._config,
            [key]: checked
        };

        this._FireConfigChanged(newConfig);
    }

    private _FireConfigChanged(config: any) {
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
            return nothing;
        }

        return html`
            <div class="card-config">
                <h3>Entities</h3>
                
                <div class="option">
                    <ha-entity-picker
                        label="Solar Grid/Power (W)"
                        .hass=${this.hass}
                        .value=${this._config.solar?.entity || ''}
                        @value-changed=${(ev: any) => this._entityChanged(ev, 'solar')}
                        allow-custom-entity
                    ></ha-entity-picker>
                </div>

                <div class="option">
                    <ha-entity-picker
                        label="Battery Power (W)"
                        .hass=${this.hass}
                        .value=${this._config.battery?.entity || ''}
                        @value-changed=${(ev: any) => this._entityChanged(ev, 'battery')}
                        allow-custom-entity
                    ></ha-entity-picker>
                </div>

                <div class="option">
                    <ha-entity-picker
                        label="Grid Power (W)"
                        .hass=${this.hass}
                        .value=${this._config.grid?.entity || ''}
                        @value-changed=${(ev: any) => this._entityChanged(ev, 'grid')}
                        allow-custom-entity
                    ></ha-entity-picker>
                </div>

                <div class="option">
                    <ha-entity-picker
                        label="Home Consumption (W)"
                        .hass=${this.hass}
                        .value=${this._config.home?.entity || ''}
                        @value-changed=${(ev: any) => this._entityChanged(ev, 'home')}
                        allow-custom-entity
                    ></ha-entity-picker>
                </div>

                <h3>Options</h3>
                <div class="row">
                    <ha-switch
                        .checked=${this._config.invert_battery !== false}
                        @change=${(ev: any) => this._toggleChanged(ev, 'invert_battery')}
                    ></ha-switch>
                    <span>Invert Battery Logic (Standard: +Charge/-Discharge)</span>
                </div>
                <div class="row">
                    <ha-switch
                        .checked=${this._config.invert_grid !== false}
                        @change=${(ev: any) => this._toggleChanged(ev, 'invert_grid')}
                    ></ha-switch>
                    <span>Invert Grid Logic (Standard: +Import/-Export)</span>
                </div>
            </div>
        `;
    }

    static styles = css`
        .card-config {
            display: flex;
            flex-direction: column;
            gap: 16px;
            padding: 16px 0;
        }
        .option {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        .row {
            display: flex;
            align-items: center;
            gap: 12px;
        }
    `;
}
