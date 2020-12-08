#!/usr/bin/env node

const { program } = require('commander')
const path = require('path')
const glob = require('glob')
const inquirer = require('inquirer') // 新增引入inquirer

program.usage('<project-name>').parse(process.argv)

let projectName = program.args[0]

if (!projectName) {
  console.log('需要为项目起一个名字')
  program.help()
  return
}

const list = glob.sync('*')
const fileRoot = setRootName(projectName)

// 新增命令行交互
inquirer.prompt([
  {
    name: 'projectName', // 参数名称
    message: '项目的名称', // 信息提示
    default: projectName // 默认值
  }, {
    name: 'projectVersion',
    message: '项目的版本号',
    default: '0.0.1'
  }, {
    name: 'projectDescription',
    message: '项目的简介',
    default: `A project named ${projectName}`
  }
]).then(answers => {
  console.log(answers); // 打印输入参数
  go()
})



function setRootName(projectName) {
  const rootName = path.basename(process.cwd())
  if (list.length === 0) {
    if (rootName === projectName) {
      return '.'
    } else {
      return projectName
    }
  }

  if (list.indexOf(projectName) != -1) {
    throw new Error(`项目${projectName}已经存在`)
  }
  return projectName
}

function go() {
  console.log(path.resolve(process.cwd(), path.join('.', fileRoot)))
}
