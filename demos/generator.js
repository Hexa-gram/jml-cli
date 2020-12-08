const Metalsmith = require('metalsmith') // 引入静态网站生成器
const Handlebars = require('handlebars') // 引入模板引擎
const rm = require('rimraf').sync
/**
 * 
 * @param {Object} metadata 全局元数据  {projectName:'xxx',projectVersion:'1.0.0'...}
 * @param {String} src      编译文件目录 './xxx' 中间文件
 * @param {String} dest     编译目标路径 './xxx' 用户输入
 */

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
