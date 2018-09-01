import {LitElement, html} from '@polymer/lit-element';


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
            Hello WC-TEST ! OH YEAH.
        `;
    }
}

customElements.define('wc-test-app', WcTestApp);
