import webpack from "webpack";
import WebpackDevServer from "webpack-dev-server";
import "colors";
import progress from 'progress-webpack-plugin';
import { EnvHelper } from './EnvHelper.mjs';
import webpackConfig from "./webpack.config.mjs";



/**
 * Flags:
 *  command (first argument)
 *    serve
 *    build
 *    help
 *  mode
 *    --dev, -d
 *    --prod, -p
 *  target
 *    --ie
 *    --modern
 *    --chrome
 */


const commands = {
  help: (args) => {
    // console.log("HELP".green, args);
  },

  serve: (args) => {
    console.log("Starting dev server...".green);

    args.isDevServer = true;
    const config = webpackConfig(args);
    const port = config.devServer.port;
    const url = `http://localhost:${port}/`;

    // hot reload
    // do this for all entrypoints?
    config.entry.webcomponents.unshift(
      `webpack-dev-server/client?${url}`,
      "webpack/hot/dev-server"
    );
    config.plugins.push(new webpack.HotModuleReplacementPlugin({
      multiStep : false
    }));

    const compiler = getCompiler(args);
    const server = new WebpackDevServer(compiler, Object.assign({
      quiet: !args.verbose,
      hot: true
    }, config.devServer));
   
    server.listen(port, "localhost", () => {
      console.log(`Server is listening on: ${url}`.green);
    });

  },

  build: (args) => {
    const compiler = getCompiler(args);
    compiler.run((err, stats) => {
      if (err) {
        throw err
      }
      if (args.verbose) {
        process.stdout.write(stats.toString({
          colors: true,
          modules: false,
          children: false,
          chunks: false,
          chunkModules: false
        }) + '\n\n');
      }
    });
  }
};


runCommand();


function runCommand() {
  const args = parseArgs();
  const command = commands[args.command];
  const envh = new EnvHelper(args);
  if (command) {
    console.log(envh.description.green);

    command(args);
  } else {
    console.log(`webdev command ${args.command} is not supported`.red);
  }
}


function getCompiler(args, config) {
  config = config || webpackConfig(args);
  config.plugins.push(new progress());
  const compiler = webpack(config);
  return compiler;
}

function parseArgs() {
  const [,,command,...args] = process.argv;
  let env = {
    command,
    verbose: false,
    _: []
  };

  return args.reduce((env, arg) => {
    switch(arg) {
      case "--dev":
      case "-d":
        env.mode = "development";
        break;
      case "--prod":
      case "-p":
        env.mode = "production";
        break;
      case "--ie":
        env.target = "ie";
        break;
      case "--modern":
        env.target = "modern";
        break;
      case "--chrome":
        env.target = "chrome";
        break;
      case "--verbose":
      case "-v":
        env.verbose = true;
        break;
      default:
        env._.push(arg);
    }
    return env;
  }, env);
}







