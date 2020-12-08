#!/usr/bin/env node

const { program } = require('commander')
const path = require('path')
const glob = require('glob')
const inquirer = require('inquirer')
const generator = require('./generator')  // 引入封装的metalsmith
const mvdir = require('mvdir') // 引入模块
const ora = require('ora')  // 引一个进度条

program.usage('<project-name>').parse(process.argv)

let projectName = program.args[0]

if (!projectName) {
  console.log('需要为项目起一个名字')
  program.help()
  return
}

const list = glob.sync('*')

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
    default: `${projectName} is a cool project`
  }
]).then(async (answers) => {
  let fileRoot = setRootName(answers.projectName || projectName)
  // 我们询问一下用户,岂不是更好
  if (fileRoot === '.') {
    await inquirer.prompt([
      {
        name: 'isUseNowPath',
        message: '当前目录为空，且目录名称和项目名称相同，是否直接在当前目录下创建新项目？',
        type: 'confirm',
        default: true
      }
    ]).then(answer => {
      fileRoot = answer.isUseNowPath ? '.' : projectName
    })
  }
  go(answers, fileRoot)
})

function setRootName(projectName) {
  const rootName = path.basename(process.cwd())
  if (list.indexOf(projectName) != -1) {
    throw new Error(`项目${projectName}已经存在`)
  }
  if (list.length === 0) {
    if (rootName === projectName) {
      return '.'
    } else {
      return projectName
    }
  }
  return projectName
}


function download() {
  // 使用mvdir复制templates文件夹内容到当前项目的.download-temp文件夹下。.download-temp为临时文件夹，编译模板后会删除。
  return new Promise((resolve, reject) => {
    const spinner = ora(`谢邀,人在美国,刚下飞机`)
    spinner.start()
    mvdir(path.join(__dirname, './template2'), '.download-temp', { copy: true }).then((err) => {
      if (err) {
        console.log(err);
        spinner.fail() // fail
        reject()
      } else {
        spinner.succeed() // ok
        resolve()
      }
    });
  })
}

function go(data, fileRoot) {
  download().then(() => {
    const src = `${process.cwd()}/.download-temp`;
    // 添加生成的逻辑
    return generator(data, src, fileRoot)
  }).then(() => {
    console.log('bingo~~')
  }).catch(err => {
    console.error('我大E了啊,没有闪：', err.message)
  })
}