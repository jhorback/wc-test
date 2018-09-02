import {LitElement, html} from '@polymer/lit-element';
import '@polymer/paper-button';
import "@polymer/app-layout/app-header/app-header";
import "@polymer/app-layout/app-toolbar/app-toolbar";
import "@polymer/paper-card/paper-card"


//class WcTestApp extends HTMLElement {
class WcTest2App extends LitElement {
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
                    <div main-title>WC-TEST2</div>
                </app-toolbar>
                <app-toolbar class="bottom">TOOLBAR</app-toolbar>
            </app-header>
            <div style="padding:2em">
                <paper-card>
                    <paper-button>Hello TEST 2</paper-button>
                </paper-card>
            </div>
        `;
    }
}

customElements.define('wc-test2-app', WcTest2App);
