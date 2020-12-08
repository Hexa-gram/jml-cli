#!/usr/bin/env node

const { program } = require('commander')
const path = require('path')
const glob = require('glob') // npm i glob -D

program.usage('<project-name>').parse(process.argv)

let projectName = program.args[0]

if (!projectName) {
  console.log('需要为项目起一个名字')
  program.help()
  return
}

const list = glob.sync('*')  // 遍历当前目录
const rootName = path.basename(process.cwd()) // 获取当前进程的根目录名称

const fileRoot = setRootName(projectName);

function setRootName(projectName) {
  // 目录为空
  if (list.length === 0) {
    if (rootName === projectName) { // 当前文件夹与项目同名
      return '.'
    } else {
      return projectName
    }
  }

  // 当前目录不为空 
  if (list.indexOf(projectName) != -1) { // 命名重复
    throw new Error(`项目${projectName}已经存在`)
  }

  return projectName
}

go()

function go() {
  // 预留，处理子命令  
  console.log(path.resolve(process.cwd(), path.join('.', fileRoot)))
}
