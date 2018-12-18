// colors console.log 文本添加字体颜色, 美观
import 'colors';

// 接收命令行参数, 提供基础信息提示功能
import commander from 'commander';

// 内部模块
import { existsSync } from 'fs';
import { resolve } from 'path';
import { version } from '../package.json';

commander.version(version).parse(process.argv);

// 获取命令行中传入的第一个参数
const [todo = ''] = commander.args;

// 判断如果 command 目录下是否存在用户输入的命令对应的文件
if (existsSync(resolve(__dirname, `command/${todo}.js`))) {
  require(`./command/${todo}.js`);
} else {
  console.log(
    `
      你输入了未知指令, 小哥哥我已经受不了挂了...
    `.red,
  );
  process.exit(-1);
}
