### 自定义自己的vue-cli模板

在使用vue-cli的过程中，常用的webpack模板只为我们提供最基础的内容，但每次需要新建一个项目的时候就需要把之前项目的一些配置都搬过来，这样就造成挺大的不方便，如果是作为一个团队，那么维护一个通用的模板，我认为是挺有必要的。   
例如下面是我常用构建项目的目录。


```
src
├─api  //接口
├─assets //图片
├─components  //公用组件
├─css  //样式 主要是scss
├─js //第三方以及工具类
├─page  //页面
├─router //路由
└─store  //vuex

```
下面说下怎么自定义自己的vue-cli模板

#### fork一个自己的模板
从  [https://github.com/vuejs-templates/webpack](https://github.com/vuejs-templates/webpack) fork 一个库，再提交自己的修改到【自己的分支】，因为我们大部分内容还是在这个基础上做修改的。  

关于vue-cli的源码分析可以参考下这个文章[从vue-cli源码学习如何写模板](https://github.com/dwqs/blog/issues/56 )  


``vuejs-templates/webpack``目录如下，

```
│  .gitignore
│  circle.yml
│  deploy-docs.sh
│  LICENSE
│  meta.js   //该文件必须导出为一个对象, 用于定义模板的 meta 信息
│  package.json
│  README.md
│  test.sh
├─docs  // 一些介绍该模板一些模块的文档
└─template  //模板的内容


D:\work\nodetest\webpack>
```
#### meta.js

``meta.js ``主要是定义模板的一些配置, 目前可定义的字段如下:

- prompts<Object>: 收集用户自定义数据
- filters<Object>: 根据条件过滤文件
- completeMessage<String>: 模板渲染完成后给予的提示信息, 支持 handlebars 的 mustaches 表达式
- complete<Function>: 模板渲染完成后的回调函数, 优先于 completeMessage
- helpers<Object>: 自定义的 Handlebars 辅助函数

#### prompts
有用过``vue-cli``的同学应该有看过下面的这个图

![image](http://www.jamielhf.cn/wp/wp-content/uploads/2017/11/1510631675.png)

看下 ``prompts``的代码
```
 "prompts": {
    "name": {  //项目名
      "type": "string",
      "required": true,
      "message": "Project name"  
    },
    "description": {  
      "type": "string",
      "required": false,
      "message": "Project description",
      "default": "A Vue.js project"
    },
    "author": {
      "type": "string",
      "message": "Author"
    },
    "router": {   
      "type": "confirm",
      "message": "Install vue-router?"
    },
    ...   
 }

```
所有的用户输入完成之后, ``template`` 目录下的所有文件将会用 ``Handlebars``（[了解相关的语法点这里](http://handlebarsjs.com/)） 进行渲染. 用户输入的数据会作为模板渲染时的使用数据,例如，在``cmd``确认使用``router``后，那么``main.js``就会``import router，main.js``中源码：
```
{{#router}}
import router from './router'{{#if_eq lintConfig "airbnb"}};{{/if_eq}}
//类似 {{#if_eq lintConfig "airbnb"}};{{/if_eq}}是启用lint后一些语法的检查

{{/router}}



```


因为开发常用到``vuex``，我们可以加入``vuex``，修改``meta.js``

```
 "vuex":{
      "type": "confirm",
      "message": "Install vuex?"
    },
```

安装过程中，就会询问是否安装``vuex``了


#### helper

上面的``if_eq``，还有源码中的``unless_eq``是原本vue cli中注册的那个辅助函数，在vue-cli中的generate.js：

```
# vue-cli/lib/generate.js

//...

// register handlebars helper
Handlebars.registerHelper('if_eq', function (a, b, opts) {
  return a === b
    ? opts.fn(this)
    : opts.inverse(this)
})

Handlebars.registerHelper('unless_eq', function (a, b, opts) {
  return a === b
    ? opts.inverse(this)
    : opts.fn(this)
})
```
类似的，你也可以自定义一些函数，方便你自己去处理一些数据，在``meta.js``中``helpers``对象中可以加入自己的方法，如源码中就有注册一个``if_or``的方法,你在文件中就可以用``{{#if_or a b}}{{/if_or}}``去使用

```
"helpers": {
    "if_or": function (v1, v2, options) {
      if (v1 || v2) {
        return options.fn(this);
      }

      return options.inverse(this);
    }
  },
```



#### filters
``filters`` 是根据条件过滤文件，源码:
```
 "filters": {
    ".eslintrc.js": "lint",
    ".eslintignore": "lint",
    "config/test.env.js": "unit || e2e",
    "test/unit/**/*": "unit",
    "build/webpack.test.conf.js": "unit",
    "test/e2e/**/*": "e2e",
    "src/router/**/*": "router"  //例如上面的 router 为true的时候，就会加入这个目录
  },

```
同样，这里我可以加入自己的vuex目录，当，``vuex``为``true``的时候，会导入这个目录
```

 "filters": {
    ".eslintrc.js": "lint",
    ".eslintignore": "lint",
    "config/test.env.js": "unit || e2e",
    "test/unit/**/*": "unit",
    "build/webpack.test.conf.js": "unit",
    "test/e2e/**/*": "e2e",
    "src/store/**/*": "vuex",  //加入自己的目录
    "src/router/**/*": "router"
  },
```
然后在``main.js``引入``vuex   ``


```
{{#vuex}}  //vuex为true的时候就会写入这些
import Vuex from 'vuex'{{#if_eq lintConfig "airbnb"}};{{/if_eq}}
import store from  './store/store'{{#if_eq lintConfig "airbnb"}};{{/if_eq}}
Vue.use(Vuex){{#if_eq lintConfig "airbnb"}};{{/if_eq}}
{{/vuex}}

//store.js 文件是我写vuex的入口

new Vue({
  el: '#app',
  {{#router}}
  router,
  {{/router}}
  {{#vuex}}
  store,
  {{/vuex}}
  {{#if_eq build "runtime"}}
  render: h => h(App){{#if_eq lintConfig "airbnb"}},{{/if_eq}}
  {{/if_eq}}
  {{#if_eq build "standalone"}}
  template: '<App/>',
  components: { App }{{#if_eq lintConfig "airbnb"}},{{/if_eq}}
  {{/if_eq}}
}){{#if_eq lintConfig "airbnb"}};{{/if_eq}}


```

还有在``template/package.json``中也要加入``vuex``
```
 "dependencies": {
    "vue": "^2.5.2"{{#router}},
    "vue-router": "^3.0.1"{{/router}}{{#vuex}},
    "vuex": "^2.1.1"{{/vuex}}

  },
```
后续的话只需要将自己需要的文件跟文件夹，加入到``template/src``，例如,我这里加入一个询问是否是移动端的，是移动端的话，会引入 ``lib-flexible.js ``以及相关配置的scss文件

```
  "isMobile":{
        "type": "confirm",
        "message": "is Mobile project?"
    },
```

最后,提交到github自己的分支上，就可以使用了


```
vue init jamielhf/webpack#template1 name

```
#### github地址
[https://github.com/jamielhf/webpack/tree/template1](https://github.com/jamielhf/webpack/tree/template1)

#### 参考：  
[vue-cli webpack的配置详解](http://blog.csdn.net/hongchh/article/details/55113751 )  
[从vue-cli源码学习如何写模板 ](https://github.com/dwqs/blog/issues/56)  
