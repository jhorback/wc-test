const path = require("path");
//const EnvHelper = require("./scripts/EnvHelper.mjs");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");

/*
Environment flags:
  --env.isDevServer
  --env.target = ie, modern, chrome
  --env.mode = development, production
*/
module.exports = (env = {}) => {

  const envh = new EnvHelper(env);
  console.log(envh.description);

  const config = {
    mode: envh.mode,
    devtool: envh.devtool,
    devServer: {
      contentBase: envh.targetBuildDir,
      port: 3024
    },    
    entry: {
      webcomponents: envh.entry(),
      app: ["./src/wc-test-app/wc-test-app.js"],
    },
    
    output: {
      filename: "[name].bundle.js", // could put hash here
      path: path.resolve(__dirname, envh.targetBuildDir),
      publicPath: "/"
    },
    
    // caused an inssue with paper-card impor?
    // optimization: {
    //   splitChunks: {
    //     chunks: "all"
    //   }
    // },
    
    resolve: {
      modules: [path.resolve(__dirname, "node_modules")]
    },
    
    module: {
      rules:[{
        test: /\.js$/,
        exclude: envh.babelExclude,
        use: {
          loader: "babel-loader",
          options: {
            "presets": [
              [
                "env", {
                  "targets": {
                    "browsers": [
                      envh.isChrome ?
                        "last 2 Chrome versions" :
                        envh.isIe ?
                        "ie 11" :
                        "last 2 Firefox versions"
                        //"last 2 Safari versions"
                    ]
                  },
                  "modules": false
                }
              ]
            ],
            plugins: [
              //"transform-class-properties",
              //"transform-runtime"
            //  "syntax-dynamic-import"
            ]
          }
        }
      }]
    },

    plugins: [
      new CleanWebpackPlugin([envh.targetBuildDir]),
      // new HtmlWebpackPlugin({
      //   template: path.resolve(__dirname, "src/index.html"),
      //   filename: path.resolve(__dirname,  `${targetBuildDir}index.html`),
      //   inject: false,
      //   hash: true
      // }),
      new HtmlWebpackPlugin({
        inject: true,
        hash: true,
        //chunks: ["app"],
        template: path.resolve(__dirname, "./src/index.html"),
        filename: path.resolve(__dirname,  `${envh.targetBuildDir}index.html`),

      }),
      new CopyWebpackPlugin([{
        from: path.resolve(__dirname,
          "node_modules/@webcomponents/webcomponentsjs/**/*"
        ),
        //to: "node_modules/@webcomponents/webcomponentsjs/"
      }]),
      // new CopyWebpackPlugin([{
      //   from: path.resolve(__dirname, "src/*.html"),
      //   to: "[name].[ext]"
      // }])
    ]
  };

  console.log(config);
  return config;
};





class EnvHelper {
  constructor(env) {
      this.env = env;
      this.baseScripts = getBaseScripts(this);
  }

  get description() {
      return `${this.isDevServer ? "SERVING" : "BUILDING"} for ${this.targetBrowser.toUpperCase()} (${this.mode} mode)`;
  }

  get targetBrowser() {
      return this.env.target || "chrome";
  }

  get mode() {
      return this.env.mode || 
          this.isDevServer ? "development" : "production"
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

  entry(entry) {
      return entry ? this.baseScripts.concat(entry) : [...this.baseScripts];
  }
}




/**
* Will want to use this to dynamically build up the entry point.
* Include babel-polyfill only in the browser(s) that need it.
* Cannot do this until the webcomponents-loader.js script is fixed
* to allow window.WebComponents.root.
* 
* usage syntax:
* entry: {
*  app: envh.entry(["script"]);
* }
*/
function getBaseScripts(envh) {
  let baseScripts = [];

  if (envh.isIe) {
      baseScripts = [
          "babel-polyfill",
          "./src/WebComponentsRoot.js",
          "./tmp/webcomponents-loader.js"
          //"./node_modules/@webcomponents/webcomponentsjs/webcomponents-loader.js"
      ];
  } else if (envh.isModern) {
      baseScripts = [
          "./src/WebComponentsRoot.js",
          "./tmp/webcomponents-loader.js"
          //"./node_modules/@webcomponents/webcomponentsjs/webcomponents-loader.js"
      ];
  } else {
      baseScripts = [
          "./src/WebComponentsRoot.js"
      ];
  }

  return baseScripts;
} 
