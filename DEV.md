# 开发说明

## 开发

	npm run debug

它会编译到内存，在内存中生成文件dist/jsoneditor.js；并开一个web服务，修改源码也会实时编译。

写一个test.html（可从docs/basic.html等文件复制，修改引用库的位置）：

    <script src="dist/jsoneditor.js"></script>
	（文件是在内存中，实际路径下没这个文件）

然后访问：

	http://localhsot:8080/test.html

或者直接修改已有示例并访问，比如：

	http://localhsot:8080/docs/ace_editor.html

在chrome中打开源码，在`webpack://`下面的src下就是打包前的源码。
如果修改源码，会自动刷新生效。

### 在项目中调试

如果在jdcloud项目中调试，它引用库的位置是server/web/lib/jsoneditor.min.js，为了能在项目中直接调试，可以使用代理。
假如jdcloud项目使用apache服务器，则可以设置server/web/.htaccess，添加：

	rewriteengine on
	rewriterule ^lib/jsoneditor.min.js http://localhost:8080/dist/jsoneditor.js [P,L]

这样就可以查看jsoneditor源码了，直接修改源码后也会自动刷新。

## 发布

	npm run build.prod

生成发布版本的dist/jseditor.js，已做min压缩。

## 修改记录

### ace代码编辑器集成优化

2022/03/18 

- bug: 如果字段值为null会报错。
- bug: 在`show_opt_in: true`选项时，如果一开始选项未选中，这时应该是readonly状态，不可编辑。

问题：在编辑纯php代码时，怎样不需要`<?php`头？

在ace中解决方案是setMode时加inline参数：

	ace.setMode({path: "ace/mode/php", inline: true});
	或
	ace.setOptions({mode: {path: "ace/mode/php", inline: true}});

那么在json editor中，可以指定options如下：

			onValidate: {
				type: "string",
				format: "php",
				options: {
					ace: {
						mode: {path: "ace/mode/php", inline: true}
					}
				},
			},

