#!/usr/bin/env node

const { program } = require('commander');
program.version('1.0.0')
  .usage('<command> [项目名称]')
  // .command('hello', '调用hello命令将使用jml-cli-hello.js')
  // .command('init <project-name>', '创建项目')
  // .command('init2 <project-name>', '创建项目')
  // .command('init3 <project-name>', '创建项目')
  // .command('init4 <project-name>', '创建项目')
  // .command('init5 <project-name>', '创建项目')
  // .command('init6 <project-name>', '创建项目')
  // .command('init7 <project-name>', '创建项目')
  // .command('ip', '获取本机ip地址')



program
  .command('coffee')
  // .command('coffee <command> [destination]')
  .description('drink coffee')
  .action((command, destination) => {
    console.log('This coffee is delicious');
    // console.log(command, destination)
  });

program.parse(process.argv);
