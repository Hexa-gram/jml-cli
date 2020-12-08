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
<img src="./img/mabaoguo.jpg" alt="图片名称" style="margin:0 auto;"/>

5.使用 **npm install -g** 或者 **npm link** 将当前项目安装到全局环境 **ps:mac需要使用sudo授权**        
6.此时我们可以使用自己的cli工具啦,在terminal输入myscript


## 3.等等,我们还可以更炫酷

<img src="./img/erkang.jpeg" alt="图片名称" style="margin:0 auto;"/>

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

<img src="./img/666.jpeg" alt="图片名称" style="margin:0 auto;"/>


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

<img src="./img/nice.png" style="margin:0 auto;">


## 5.实现自己的工程结构

我们已经可以通过`jml-cli`工具生成README文件了,但是我们项目中用到的肯定不是这样只输出一个文件,而且这样输出文件很低效     

如何才能高效产生我们自己的工程结构呢?软件工程提出了一种很好的解决该问题的设计模式 -- **模板模式**  

我们可以通过使用模板模式的方式来实现高效输出一个工程骨架,首先我们创建`templates文件夹`保存项目模板,使用 **npm init** 生成一个`package.json`文件,   

当然,因为我们是要复制模板的形式创建工程,我们需要一个复制文件夹的包,这里选择**mvdir**,在jml-cli根目录安装

> npm i mvdir


我们继续修改`jml-cli-init`

```javascript
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

```
通过调用 **jml-cli init xxx** 我们已经可以完成模板的复制了

## 6.实现交互修改

因为我们并不希望只是生硬的拷贝模板,我们想要对模板做出些定制化操作,比如手动输入版本号等

<img src="./img/but.jpg" style="margin:0 auto;">  

我们需要一个能够处理静态文件的工具这里我们使用`Metalsmith`编译模板文件  

> [Metalsmith](https://metalsmith.io/) - simple, pluggable static site generator

它就是一个静态网站生成器，可以用在批量处理模板的场景，类似的工具包还有[Wintersmith](http://wintersmith.io/)、[Hexo](https://hexo.io/)。它最大的一个特点就是EVERYTHING IS PLUGIN，所以，metalsmith本质上就是一个胶水框架，通过黏合各种插件来完成生产工作。


我们还需要一个模板引擎,我们引入一个模板引擎 **handlebars** ,当然，还可以有其他选择，例如ejs、jade。

> 官方文档 [`handlebars`](https://handlebarsjs.com/)   


此时,基于handlebars的语法,我们对`package.json文件`做点修改

```javascript
{
  "name": "{{projectName}}",
  "version": "{{projectVersion}}",
  "description": "{{projectDescription}}",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC"
}
```
现在,package.json的name、version、description字段的内容被替换成了handlebar语法的占位符     

### 实现脚手架给模板插值的功能

我们在根目录下创建`generator.js`，用来封装metalsmith

```javascript
const Metalsmith = require('metalsmith') // 引入静态网站生成器
const Handlebars = require('handlebars') // 引入模板引擎
const rm = require('rimraf').sync

module.exports = function (metadata = {}, src, dest = '.') {
  if (!src) return Promise.reject(new Error(`无效的source：${src}`))
  
  return new Promise((resolve, reject) => {
    Metalsmith(process.cwd())
      .metadata(metadata)
      .clean(false) // 是否删除
      .source(src) // 编译来源
      .destination(dest) // 编译目标路径
      .use((files, metalsmith, done) => { //自定义插件
        const meta = metalsmith.metadata()
        Object.keys(files).forEach(fileName => {
          const t = files[fileName].contents.toString()
          files[fileName].contents = Buffer.from(Handlebars.compile(t)(meta))
        })
        done()
      }).build(err => {
        rm(src)
        err ? reject(err) : resolve()
      })
  })
}

```

然后,我们在最后一次修改`jml-cli-init`文件

```javascript
#!/usr/bin/env node

const { program } = require('commander')
const path = require('path')
const glob = require('glob')
const inquirer = require('inquirer')
const generator = require('./generator')  // 引入封装的metalsmith
const mvdir = require('mvdir') // 引入模块

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
    mvdir(path.join(__dirname, './templates'), '.download-temp', { copy: true }).then((err) => {
      if (err) {
        console.log(err);
        reject()
      } else {
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
   console.error('我大E了啊,没有闪：',err.message)
  })
}
```

至此,我们的简易的cli工具就完成了,运行一下**jml-cli init test1**,  开始祈祷🙏,但愿没有bug~   
哎哟不错哦!


## 小记

CLI虽然常用于创建项目结构,但是回到文章最开始的那句话,什么是CLI? 说到底,是工具,一种效率手段,我写了一个ip工具用来查询本机ip地址,希望小伙伴们可以开发出更多实用且有意思的工具,fighting~ 💪💪💪