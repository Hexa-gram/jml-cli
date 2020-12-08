#!/usr/bin/env node

const { program } = require('commander')

program.usage('<project-name>').parse(process.argv)
//  argv: [ '/usr/local/bin/node', '/Users/jiminglu/jml-cli/jml-cli-init.js', '111']

console.log('args', program.args)
// 根据输入，获取项目名称
let projectName = program.args[0]

if (!projectName) {  // project-name 必填
  // 相当于执行命令的--help选项，显示help信息，这是commander内置的一个命令选项
  program.help()
  return
}