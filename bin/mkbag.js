#!/usr/bin/env node
var myCommand = require('../lib'),
    fs = require('fs'),
    pkg = fs.readFileSync(__dirname.replace(/bin/, '') + 'package.json'),
    version = JSON.parse(pkg).version;
    
var yargs = require('yargs')
    .version(version)
    .usage('命令格式  node ./bin/mkbag [Command] [option]')
    .option('v', {
        alias: 'version'
    })
    .command('start', '设置当前目录为开发路径')
    .command('pack', '打包一个平台包到packed目录下')
    .example('node ./bin/mkbag start', '设置当前目录为开发路径')
    .example('node ./bin/mkbag pack banana', '打包大香蕉')
    .example('node ./bin/mkbag -v', '版本号'),
    argv = yargs.argv,
    command = argv._[0];
    
if (command === 'start') {
    console.log('start模式');

    if (argv._.length > 1) {
        console.log('兄弟,这个模式带参无用，别挣扎了,重新不带参数的启动一次吧');
        return;
    }

    myCommand.start();
} else if (command === 'clean') {
    myCommand.clean();
} else if (command === 'pack') {
    console.log('pack模式启动');
    if (argv._.length != 2) {
        console.log('pack方法只支持传入一个参数来打包一个项目');
        return;
    }

    const dir = process.argv[3] || argv._

    myCommand.pack(dir);
} else if (command === 'dev') {
    console.log('dev模式启动');
    if (argv._.length != 2) {
        console.log('dev方法只支持传入一个参数来打包一个项目');
        return;
    }

    const dir = process.argv[3] || argv._
    
    myCommand.dev(dir);
} else {
    yargs.showHelp();
}

process.on('uncaughtException', function (err) {
    console.error('捕獲未處理異常：');
    console.error(err.stack);
});
