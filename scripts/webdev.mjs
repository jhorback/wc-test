import "colors";
import webpack from "webpack";
import WebpackDevServer from "webpack-dev-server";
import progress from 'progress-webpack-plugin';
import { CommandExecutor } from './CommandExecutor.mjs';
import { EnvHelper } from './EnvHelper.mjs';
import webpackConfig from './webpack.config.mjs';


const program = new CommandExecutor({target: "chrome"});
program.addHelpCommand();

program.addCommand("build", {
  help: "Builds the application for chrome in production mode",
  execute: (env) => {
    const compiler = getCompiler(env);
    compiler.run((err, stats) => {
      if (err) {
        throw err
      }
      if (env.verbose) {
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
});

program.addCommand("serve", {
  help: "Starts the dev server for chrome in development mode",

  updateEnv: (env) => {
    env.isDevServer = true;
  },

  execute: (env) => {
    console.log("Starting dev server...".green);

    const config = webpackConfig(env);
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

    const compiler = getCompiler(env);
    const server = new WebpackDevServer(compiler, Object.assign({
      quiet: !env.verbose,
      hot: true
    }, config.devServer));
   
    server.listen(port, "localhost", () => {
      console.log(`Server is listening on: ${url}`.green);
    });
  }
})

program.addOption("dev", {
  flag: "d",
  help: "Set the mode to development",
  updateEnv: (env) => {
    env.mode = "development";
  }
});

program.addOption("prod", {
  flag: "p",
  help: "Set the mode to production",
  updateEnv: (env) => {
    env.mode = "production";
  }
});

program.addOption("verbose", {
  flag: "v",
  help: "Turn on vebose debugging output",
  defaultValue: false,
  updateEnv: (env) => {
    env.verbose = true;
  }
});

program.addOption("ie", {
  help: "Set the target broswer to ie",
  updateEnv: (env) => {
    env.target = "ie";
  }
});

program.addOption("chrome", {
  help: "Set the target browser to chrome",
  updateEnv: (env) => {
    env.target = "chrome";
  }
});

program.addOption("modern", {
  help: "Set the target browser to modern browsers (e.g. firefox, safari, etc.)",
  updateEnv: (env) => {
    env.target = "modern";
  }
});

program.execute((commandName, env) => {

  if (commandName === "help") {
    console.log("\nAi webdev".bold);
    return;
  } 

  const envh = new EnvHelper(env);
  console.log(envh.description.green);
  if (env.verbose) {
    console.log("ENV:");
    Object.keys(env).sort(alphaNumericSort).forEach((key) => {
      console.log(`  ${key}: ${env[key]}`);
    });
    console.log("");
  }
});


function alphaNumericSort (a, b) {
  if (a === b) {
      return 0;
  }
  if (typeof a === typeof b) {
      return a < b ? -1 : 1;
  }
  return typeof a < typeof b ? -1 : 1;
}


function getCompiler(args, config) {
  config = config || webpackConfig(args);
  config.plugins.push(new progress());
  const compiler = webpack(config);
  return compiler;
}







