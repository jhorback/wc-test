import webpack from "webpack";
import WebpackDevServer from "webpack-dev-server";
import colors from "colors";
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
    console.log("HELP".green, args);
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

    const compiler = webpack(config);
    const server = new WebpackDevServer(compiler, Object.assign({
      quiet: false,
      hot: true
    }, config.devServer));
   
    server.listen(port, "localhost", () => {
      console.log(`Server is listening on: ${url}`.green);
    });

  },

  build: (args) => {
    console.log("BUILD".green, args);
    const config = webpackConfig(args);

    const compiler = webpack(config);
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
  }
};


runCommand();


function runCommand() {
  const args = parseArgs();
  const command = commands[args.command];
  if (command) {
    command(args);
  } else {
    console.log(`webdev command ${args.command} is not supported`.red);
  }
}


function parseArgs() {
  const [,,command,...args] = process.argv;
  let env = {
    command,
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
      default:
        env._.push(arg);
    }
    return env;
  }, env);
}







