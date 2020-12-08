#!/usr/bin/env node

const { program } = require('commander')
const path = require('path')
const glob = require('glob')
const fs = require('fs')
const inquirer = require('inquirer')

program.usage('<project-name>').parse(process.argv)

let projectName = program.args[0]

if (!projectName) {
  console.log('需要为项目起一个名字')
  program.help()
  return
}

const list = glob.sync('*')
const fileRoot = setRootName(projectName)

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
  let rootPath = path.resolve(process.cwd(), path.join('.', fileRoot))
  let content = `# ${answers.projectName} \n## ${answers.projectDescription}`

  fs.mkdir(rootPath, { recursive: true }, (err) => {
    if (err) return callback(err);
    // 写入文件（会覆盖之前的内容）（文件不存在就创建）  utf8参数可以省略 
    fs.writeFile(rootPath + '/README.md', content, 'utf8', function (err) {
      if (err) throw new Error(err);
      console.log('写入成功');
    })
  });

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

