process.env.NODE_ENV = 'production';
const fs = require('fs');
fs.exists('./public/bundle-config.json', exists => {
    const chalk = require('chalk');
    if (exists) {
        console.log(chalk.cyan('lib files already exists.'));
    } else {
        console.log(chalk.yellow('lib files does not exist.'));
    }

    if (!(process.env.npm_config_check_dll && exists)) {
        const path = require('path');
        const webpack = require('webpack');
        const dllConfig = require('./webpack.dll.conf');
        const rm = require('rimraf');
        const ora = require('ora');
        const spinner = ora({ color: 'green', text: 'building for lib files...' });
        spinner.start();

        rm(path.resolve(__dirname, '../public'), err => {
            if (err) throw err;
            webpack(dllConfig, (err, stats) => {
                spinner.stop();
                if (err) throw err;
                process.stdout.write(stats.toString({
                    colors: true,
                    modules: false,
                    children: false,
                    chunks: false,
                    chunkModules: false
                }) + '\n\n');
                console.log(chalk.cyan('  lib files build complete.\n'));
            });
        });
    }
});










