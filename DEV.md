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

### 2025/1 checkbox调整

当show_opt_in=true时，format=checkbox原先会显示两个checkbox，一个是opt_in一个是自身，现在合并为一个（只用opt_in），要么勾上为true值，要么不勾没有值。

	prop1: {
		type:"boolean",
		format: "checkbox"
	},

调整spectre对checkbox的改造，它原先用了form-icon来替代显示checkbox，会导致风格不一致。

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

### 按需加载ace库

如果window.ace变量为空，则发出loadlib事件，用于加载ace库，示例：

	// async load ace lib, use ev.dfd (means Deferred/Promise)
	jsonEditor.on("loadlib", function (ev) {
		if (ev.libname == "ace") {
			ev.dfd = loadAceLib();
		}
	});

	var m_dfdAceLib;
	function loadAceLib()
	{
		if (m_dfdAceLib == null) {
			m_dfdAceLib = $.when(WUI.loadScript("lib/ace/ace.js"), WUI.loadScript("lib/ace/ext-language_tools.js"));
		}
		return m_dfdAceLib;
	}

默认配置示例：ace选项中设置自动提示

	$.extend(JSONEditor.defaults.options, {
		theme: "bootstrap4",
		iconlib: "fontawesome4", 
		remove_empty_properties: true,
		// use_default_values: false, // 这个不建议用了，有些bug，且意义似乎不大
		show_opt_in: true,
		ace: {
			enableBasicAutocompletion: true,
			enableSnippets: true,
			enableLiveAutocompletion: true
		}
	});

### 数组项支持拖拽调方式整顺序

Drag and drop for array item is supported to perform a quick item moving.
For array editor with format=`tabs` or `tabs-top`, you can drag the tab header directly.
For the default array editor (or format=`table`), you have to drag the array item panel with Ctrl key pressed (to avoid side-effect of draggable panel), or drag any text in the input box to another item panel.

拖拽的实现使用了draggable属性及相关事件(dragstart/dragover/drop等)。
对于format=tabs或tabs-top的情况，可以拖拽tab头到所需位置即可；
但对于format=table或默认情况，需要按住Ctrl来拖动，或是选中一些文本拖拽到其它位置也可以。

因为面板中包含有大量其它组件，如果直接设置draggable属性，将导致其内部所有的文本无法通过鼠标拖拉来选择（因为与拖拽操作冲突），
对于文本框内无法拖拉问题，还可以在dragstart事件中判断鼠标当前所在的DOM组件并调用ev.preventDefault()来实现。但其它处文本则没有办法来实现拖拉选择。
为了不影响这些操作，默认不开放拖拽操作，直到双击面板区域则才激活(draggable=true)，待完成或取消拖拽动作后再次禁用(draggable=false)。

