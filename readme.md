# CLI简介
<img src="./img/header.jpg" width = "100%" alt="图片名称" />
## 1.什么是CLI 

CLI是command-line interface的缩写，即命令行工具，常用的vue-cli， create-react-app，express-generator 等都是CLI工具

## 2.一切从一个demo开始

1.首先,我们从模仿我们熟悉的cli工具开始,通过 `mkdir jml-cli && cd jml-cli` 进入该目录  
2.使用 npm init 创建`package.json`,一路回车,当然你也可以配置相关信息  
3.此时我们创建一个myscript.js文件作为目前的主文件 `touch myscript.js`  
4.现在我们拥有了一个myscript.js文件和一个package.json文件,我们为`package.json`添加一个字段**bin**，用来存放一个可执行的文件，我们此处的可执行文件是myscript.js，因此配置如下：  
```javascript
"bin":{
    "myscript": "./myscript.js",
},
```
同时,我们给myscript.js文件添加些内容 
```javascript
#!/usr/bin/env node   
//在首行增加这样一句注释，作用是"指定由哪个解释器来执行脚本"。

console.log('年轻人,不讲武德,耗子尾汁');
```
5.使用**npm install -g** 或者 **npm link** 将当前项目安装到全局环境 **ps:mac需要使用sudo授权**      
6.此时我们可以使用自己的cli工具啦,在terminal输入myscript


## 3.等等,我们还可以更炫酷

在package.json的scripts字段里添加脚本名
```javascript 
"scripts": {
    "dev": "myscript"
 }
```
在scripts中,我们可以写任何shell语句,比如更改环境变量 `cross-env NODE_ENV=production`,
我们创建env.js并做如下修改
```javascript
// env.js文件
console.log('now env:', process.env.NODE_ENV);

// package.json
"scripts": {
    "test:env": "cross-env NODE_ENV=production node env.js"
},
```

## 4.正餐开始

我们在package.json中继续添加以下代码,用以处理接下来的逻辑,并创建文件 `index.js`
```javascript
"bin":{
   "jml-cli":"./index.js"
},
```
接下来我们需要使用 tj大神开发的模块 `commander.js`   
> 官方中文文档:[`commander.js`](https://github.com/tj/commander.js/blob/master/Readme_zh-CN.md)

```bash
npm i commander
```

1.首先我们创建`index.js`文件并编写如下代码
```javascript
#!/usr/bin/env node

const { program } = require('commander');
program.version('1.0.0').usage('<command> [项目名称]')
program
  .command('coffee')
  .description('drink coffee')
  .action(() => {
    console.log('This coffee is delicious');
  });

program.parse(process.argv);
```

执行**jml-cli**代码,我们会得到一组输出
```bash
Usage: jml-cli <command> [项目名称]

Options:
  -V, --version                   output the version number
  -h, --help                      display help for command

Commands:
  coffee <command> [destination]  drink coffee
  help [command]                  display help for command
```

通过调用`jml-cli coffee`命令我们可以看到,我们输出了结果 This coffee is delicious,我们更改下我们的代码,做更多的事情  

```javascript
#!/usr/bin/env node

const { program } = require('commander');
program.version('1.0.0').usage('<command> [项目名称]')
program
  .command('coffee <command> [destination]')
  .description('drink coffee')
  .action((command, destination) => {
    console.log('This coffee is delicious');
    console.log(command, destination)
  });

program.parse(process.argv);
```
调用`jml-cli coffee`命令,此时我们接收到一个报错,`error: missing required argument 'command'`,这是因为我们定义了command参数但是却没有提供给coffee命令,我们调用`jml-cli coffee init`

```bash

This coffee is delicious
init undefined

```

可以看到,我们定义的参数打印出来了,通过这样的方式,我们可以实现命令行传参来像调用函数一样,辅助我们日常开发过程中,需要自定义的变量   

除此之外,commander支持独立的可执行（子）命令，就意味着使用独立的可执行文件作为子命令，文件名的格式是[command]-[subcommand]，例如：

pm install => pm-install
pm search => pm-search

然后使用 **jml-cli** 可以看到目前commander给我们提供的一些功能
2.创建`jml-cli-hello.js`文件并编写如下代码
```javascript
console.log('你好,打工人')
```

此时使用 **jml-cli hello 命令** 可以发现已经打印出了我们在 jml-cli-hello.js 中写的语句已经打印出来了      

   
当使用文件形式的子命令,如何处理我们想要的参数呢  
在node程序中，通过process.argv可获取到命令的参数，以数组返回.  
我们可以通过使用commander提供的解析钩子,获取到我们自定义的参数,我们修改`jml-cli-hello.js`中的代码   

```javascript

const { program } = require('commander')
program.parse(process.argv);
console.log('args', program.args);
```

我们可以看到,`program.args`所对应的数组,就是我们的输入,接下来我们来用cli实现创建一组目录结构   


3.首先,我们创建`jml-cli-init.js`,来创建有关文件目录的部分,首先添加如下代码
```javascript
#!/usr/bin/env node

const { program } = require('commander')

program.usage('<project-name>').parse(process.argv)

console.log('args', program.args)
// 根据输入，获取项目名称
let projectName = program.args[0]

if (!projectName) {  // project-name 必填
  // 相当于执行命令的--help选项，显示help信息，这是commander内置的一个命令选项
  program.help()
  return
}
```
根据我们的配置,project-name是必填参数，按下列方式处理。

    - 如果当前目录不为空,且目录中存在与**project-name**同名的目录，则提示项目已经存在，结束命令执行。
    - 如果当前目录为空,且当前目录与**project-name**同名,则直接在当前目录下,创建工程。
    - 当前目录与**project-name**不同名,以**project-name**创建工程。
  
我们需要对`jml-cli-init.js`文件在做改进

```javascript
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
```

我们通过 **mkdir test1** 创建一个空文件夹, 并在该文件夹下使用 **jml-cli init hello** 可以看到终端打印出了我们的项目路径   

接下来我们为我们的脚手架设计一点交互,有问有答,**才有技术feel~**  
我们引入**inquirer**模块来设计我们的交互   
> 官方文档 [`inquirer`](https://github.com/SBoudrias/Inquirer.js)
```bash
npm i inquirer
```

## 4.设计交互

1.我们修改`jml-cli-init`的代码  
```javascript
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

```

通过使用**jml-cli init**我们得到如下的结果  

```bash
? 项目的名称 hahah
? 项目的版本号 1.0.0
? 项目的简介 shhah
{
  projectName: 'hahah',
  projectVersion: '1.0.0',
  projectDescription: '这就很酷'
}
/Users/jiminglu/jml-cli/hahha
```

以上，就得到了几个重要的参数：项目名称、项目版本号、项目介绍。  
接下来我们先生成项目中的第一个文件`README.md` 

我们继续更改`jml-cli-init`的代码  

```javascript
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

```
通过使用 **jml-cli init haha** 可以看到我们已经成功的在当前目录创建了名为`haha的文件夹`,并包含一个基础输出的`README.md`