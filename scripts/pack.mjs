import webpack from "webpack";
import config from "../webpack.config.babel.js";

/**
 * Flags:
 *  run
 *    -webpack-dev-server
 *    -webpack
 *  mode
 *    -dev
 *    -prod
 *  target
 *    -ie
 *    -modern
 *    -chrome
 */

console.log(config());
const compiler = webpack(config());
compiler.run((err, stats) => {
  if (err) {
    throw err
  }
  // process.stdout.write(stats.toString({
  //   colors: true,
  //   modules: false,
  //   children: false,
  //   chunks: false,
  //   chunkModules: false
  // }) + '\n\n');
});

const args = getArgs();
console.log(args);



function getArgs() {
    const [,,...args] = process.argv;
    
    let run = null;
    let isDevServer = false;

    if (args.includes("webpack-dev-server")) {
      run = "webpack-dev-server";
      isDevServer = true;
    } else if (args.includes("webpack")) {
      run = "webpack";
    } else {
      throw new Error("Run task not defined.");
    }
    
    let target = "chrome";
    if (args.includes("ie")) {
      target = "ie";
    } else if (args.includes("modern")) {
      target = "modern";
    }
  
    let mode = null;
    if (args.includes("dev")) {
      mode = "development";
    } else if (args.includes("prod")) {
      mode = "production";
    } else {
      mode = isDevServer ? "development" : "production";
    }
    
    return {
      run,
      isDevServer,
      target,
      mode
    };
  }
  