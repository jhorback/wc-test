

/*
 * env: {
 *  isDevServer: boolean,
 *  mode: string, // "production", "development"
 *  target: string, // "chrome", "ie", "modern"
 * }
 */
export class EnvHelper {
    constructor(env) {
        this.env = env;
    }

    get description() {
        return `${this.isDevServer ? "SERVING" : "BUILDING"} for ${this.targetBrowser.toUpperCase()} (${this.mode} mode)`;
    }

    get targetBrowser() {
        return this.env.target || "chrome";
    }

    get mode() {
        if (this.env.mode) {
            return this.env.mode;
        }
        return this.isDevServer ? "development" : "production";
    }

    /** @return {boolean} true if running the dev server */
    get isDevServer() {
        return this.env.isDevServer;
    }

    get isDevMode() {
        return this.env.mode === "development";
    }

    get isProdMode() {
        return this.env.mode === "production";
    }

    get isIe() {
        return this.targetBrowser === "ie";
    }

    get isModern() {
        return this.targetBrowser === "modern";
    }

    get isChrome() {
        return this.targetBrowser === "chrome";
    }

    get targetBuildDir() {
        return `./build/${this.targetBrowser}/`
    }

    get babelExclude() {
        return this.isIe ? void 0 : /node_modules/;
    }

    get devtool() {
        return (this.isIe || this.isProdMode) ? "source-map" : "eval-source-map";
    }

    get verbose() {
        return this.env.verbose;
    }

    get webComponentsEntry() {
        return getBaseScripts(this);
    }
}




/**
 * Will want to use this to dynamically build up the entry point.
 * Include babel-polyfill only in the browser(s) that need it.
 * Cannot do this until the webcomponents-loader.js script is fixed
 * to allow window.WebComponents.root.
 */
function getBaseScripts(envh) {
    let baseScripts = [];

    if (envh.isIe) {
        baseScripts = [
            "babel-polyfill",
            "./src/webcomponents.root.js",
            "./src/window.loadEntry.js",
            "./node_modules/@webcomponents/webcomponentsjs/webcomponents-loader.js"
        ];
    } else if (envh.isModern) {
        baseScripts = [
            "./src/webcomponents.root.js",
            "./src/window.loadEntry.js",
            "./node_modules/@webcomponents/webcomponentsjs/webcomponents-loader.js"
        ];
    } else {
        baseScripts = [
            "./src/window.loadEntry.js"
        ];
    }

    return baseScripts;
} 
