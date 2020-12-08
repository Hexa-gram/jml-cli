#!/usr/bin/env node

const { program } = require('commander')
const path = require('path')
const inquirer = require('inquirer')
const mvdir = require('mvdir') // 引入模块

program.usage('<project-name>').parse(process.argv)

const projectName = program.args[0] || 'test'

inquirer.prompt([
  {
    name: 'projectName',
    message: '项目的名称',
    default: projectName
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
  console.log(answers);

  // 使用mvdir复制templates文件夹内容到当前项目的.download-temp文件夹下。.download-temp为临时文件夹，编译模板后会删除。
  mvdir(path.join(__dirname, './templates'), '.download-temp', { copy: true }).then((err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('复制成功');
    }
  });
})

