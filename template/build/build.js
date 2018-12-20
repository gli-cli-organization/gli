require('./check-versions')();
process.env.NODE_ENV = 'production';
const ora = require('ora');
const rm = require('rimraf');
const path = require('path');
const chalk = require('chalk');
const webpack = require('webpack');
const config = require('../config');
const webpackConfig = require('./webpack.prod.conf');
const spinner = ora({
    color: 'green',
    text: 'building for ' + process.env.NODE_ENV + '' + (process.env.npm_config_sit ? '(SIT)' : '') + '...'
}
);
spinner.start();

rm(path.join(config.build.assetsRoot, config.build.assetsPublicPath), err => {
    if (err) throw err;
    webpack(webpackConfig, (err, stats) => {
        spinner.stop();
        if (err) throw err;
        process.stdout.write(stats.toString({
            colors: true,
            modules: false,
            children: false,
            chunks: false,
            chunkModules: false
        }) + '\n\n');
        console.log(chalk.cyan('  ' + process.env.NODE_ENV + '' + (process.env.npm_config_sit ? '(SIT)' : '') + 'build complete.\n'));
        console.log(chalk.yellow(
            '  Tip: built files are meant to be served over an HTTP server.\n' +
            '  Opening index.html over file:// won\'t work.\n'
        ));
    });
});
