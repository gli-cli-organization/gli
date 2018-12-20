### 自定义自己的 vue 模板 gli

下面是我构建的前端项目的目录。

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

#### 构建一个自己的模板

从[https://github.com/vuejs-templates/webpack](https://github.com/vuejs-templates/webpack) clone 一个模板，再提交到 github 分支上。

如果你想学习 vue-cli 的源码分析请参考：[从 vue-cli 源码学习如何写模板](https://github.com/dwqs/blog/issues/56)

`vuejs-templates/webpack`目录如下，

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

```

### 下面主要讲一下如何配置自己的模板

#### meta.js

`meta.js`主要是定义模板的一些配置, 目前可定义的字段如下:

- prompts<Object>: 收集用户自定义数据
- filters<Object>: 根据条件过滤文件
- completeMessage<String>: 模板渲染完成后给予的提示信息, 支持 handlebars 的 mustaches 表达式
- complete<Function>: 模板渲染完成后的回调函数, 优先于 completeMessage
- helpers<Object>: 自定义的 Handlebars 辅助函数

#### prompts

看下 `prompts`的基本代码如下

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
    "vuex": {
        "type": "confirm",
        "message": "Install vuex?"
    },
    "isMobile": {
        "type": "confirm",
        "message": "is Mobile project?"
    },
    ...
 }

```

所有的用户输入完成之后, `template` 目录下的所有文件将会用 `Handlebars`（[了解相关的语法点这里](http://handlebarsjs.com/)） 进行渲染. 用户输入的数据会作为模板渲染时的使用数据,例如，在`cmd`确认使用`router`或 `vuex`后，那么`main.js`就会`import router，import Vuex,main.js`中源码：

```
{{#router}}
import router from './router'{{#if_eq lintConfig "airbnb"}};{{/if_eq}}
//类似 {{#if_eq lintConfig "airbnb"}};{{/if_eq}}是启用lint后一些语法的检查

{{/router}}


{{#vuex}}
import Vuex from 'vuex'{{#if_eq lintConfig "airbnb"}};{{/if_eq}}
import store from  './store/store'{{#if_eq lintConfig "airbnb"}};{{/if_eq}}
Vue.use(Vuex){{#if_eq lintConfig "airbnb"}};{{/if_eq}}
{{/vuex}}


#### helper

上面的``if_eq``，还有源码中的``unless_eq``是原本 gli中注册的那个辅助函数，在gli/lib中的generate.js：

```

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
类似的，你也可以自定义一些函数，，在``meta.js``中``helpers``对象中可以加入自己的方法，如源码中就有注册一个``if_or``的方法,你在文件中就可以用``{{#if_or a b}}{{/if_or}}``去使用

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
"test/unit/**/\*": "unit",
"build/webpack.test.conf.js": "unit",
"test/e2e/**/_": "e2e",
"src/router/\*\*/_": "router" //例如上面的 router 为 true 的时候，就会加入这个目录
},

```
同样，这里我可以加入自己的vuex目录，当，``vuex``为``true``的时候，会导入这个目录
```

"filters": {
".eslintrc.js": "lint",
".eslintignore": "lint",
"config/test.env.js": "unit || e2e",
"test/unit/**/\*": "unit",
"build/webpack.test.conf.js": "unit",
"test/e2e/**/_": "e2e",
"src/store/\*\*/_": "vuex", //加入自己的目录
"src/router/\*_/_": "router"
},

```
然后在``main.js``引入``vuex   ``


```

//store.js 文件是我写 vuex 的入口

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
加入一个询问是否是移动端的，是移动端的话，会引入 ``lib-flexible.js ``以及相关配置的scss文件

```

"isMobile":{
"type": "confirm",
"message": "is Mobile project?"
},

```

最后,提交到github自己的分支上，就可以使用了


```

vue init gli name

```
#### github地址
[https://github.com/gli-cli-organization/gli](https://github.com/gli-cli-organization/gli)

#### 参考：
[vue-cli webpack的配置详解](http://blog.csdn.net/hongchh/article/details/55113751 )
[从vue-cli源码学习如何写模板 ](https://github.com/dwqs/blog/issues/56)
```
