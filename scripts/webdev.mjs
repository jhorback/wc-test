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

class CommandExecutor {
  constructor(defaultEnv) {
    this.commands = {};
    this.options = {};
    this.flags = {};
    this.env = defaultEnv || {};
    this.env._ = [];
  }

  addCommand(name, {help, execute, updateEnv = null}) {
    const command = {name, updateEnv, execute, help};
    this.commands[name] = command;
  }

  addHelpCommand() {

  }

  addOption(name, {
      help,
      flag = null,
      defaultValue = null,
      updateEnv
    }) {
    const option = {flag, name, updateEnv, defaultValue, help};
    
    this.options[`--${name}`] = option;

    if (flag) {
      this.flags[`-${flag}`] = option;
    }

    if (defaultValue) {
      this.env[name] = defaultValue;
    }
  }

  execute(beforeExecute) {
    const [,, commandName, ...args] = process.argv;
    const command = this.commands[commandName];

    if (!command) {
      console.log(`webdev command ${commandName} is not supported`.red);
    }
    
    command.updateEnv && command.updateEnv(this.env);
    args.forEach((arg) => {
      const option = this.options[arg] || this.flags[arg];
      if (option && option.updateEnv) {
        option.updateEnv(this.env);
      } else {
        this.env._.push(option);
      }
    });

    beforeExecute && beforeExecute(this.env);
    command.execute(this.env);
  }
}



const executor = new CommandExecutor({target: "chrome"});
executor.addHelpCommand();

executor.addCommand("build", {
  help: "",
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

executor.addCommand("serve", {
  help: "",

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

executor.addOption("dev", {
  flag: "d",
  help: "",
  updateEnv: (env) => {
    env.mode = "development";
  }
});

executor.addOption("prod", {
  flag: "p",
  help: "",
  updateEnv: (env) => {
    env.mode = "production";
  }
});

executor.addOption("verbose", {
  flag: "v",
  help: "",
  defaultValue: false,
  updateEnv: (env) => {
    env.verbose = true;
  }
});

executor.addOption("ie", {
  help: "",
  updateEnv: (env) => {
    env.target = "ie";
  }
});

executor.addOption("chrome", {
  help: "",
  updateEnv: (env) => {
    env.target = "chrome";
  }
});

executor.addOption("modern", {
  help: "",
  updateEnv: (env) => {
    env.target = "modern";
  }
});

executor.execute((env) => {
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







