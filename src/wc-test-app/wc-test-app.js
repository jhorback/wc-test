import {LitElement, html} from '@polymer/lit-element';
import '@polymer/paper-button';
import "@polymer/app-layout/app-header/app-header";
import "@polymer/app-layout/app-toolbar/app-toolbar";


//class WcTestApp extends HTMLElement {
class WcTestApp extends LitElement {
    static get properties() {
        return {
            example1Text: String,
            example2Text: String,
            example3Text: String
        };
    };

    constructor() {
        super();
    }

    _render({
        example1Text,
        example2Text,
        example3Text
    }) {
        return html`
            <app-header>
                <app-toolbar>
                    <div main-title>WC-TEST</div>
                </app-toolbar>
                <app-toolbar class="bottom">TOOLBAR</app-toolbar>
            </app-header>
            <div style="padding:2em">
                Hello WC-TEST ! OH YEAH. NOW!
                <br>
                <paper-button>Hello</paper-button>
                <br>
                <slot></slot>
            </div>
        `;
    }
}

customElements.define('wc-test-app', WcTestApp);
