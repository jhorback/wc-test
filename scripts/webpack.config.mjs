import path from "path";
import { EnvHelper } from "./EnvHelper.mjs";
import plugins from "./webpack.plugins.js";

/*
Environment flags:
  --env.isDevServer
  --env.target = ie, modern, chrome
  --env.mode = development, production
*/
export default (env = {}) => {

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
      webcomponents: envh.webComponentsEntry,
      app: ["./src/wc-test-app/wc-test-app.js"],
    },
    
    output: {
      filename: "[name].bundle.js?[hash]", // could put hash here
      path: resolvePath(envh.targetBuildDir),
      publicPath: "/"
    },
    
    // caused an inssue with paper-card impor?
    // optimization: {
    //   splitChunks: {
    //     chunks: "all"
    //   }
    // },
    
    resolve: {
      modules: [resolvePath("node_modules")]
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
      plugins.cleanWebpackPlugin([envh.targetBuildDir]),
      // new HtmlWebpackPlugin({
      //   template: path.resolve(__dirname, "src/index.html"),
      //   filename: path.resolve(__dirname,  `${targetBuildDir}index.html`),
      //   inject: false,
      //   hash: true
      // }),
      plugins.htmlWebpackPlugin({
        template: resolvePath("./src/index.html"),
        filename: resolvePath(`${envh.targetBuildDir}index.html`),
        chunks: ["webcomponents", "app"]
      }),
      plugins.copyWebpackPlugin([{
        from: resolvePath(
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

  return config;
};


function resolvePath(pathToResolve) {
  const dirName = path.resolve();
  return path.resolve(dirName,  pathToResolve);
}
