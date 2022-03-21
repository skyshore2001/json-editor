为避免仅用于jsoneditor的css库污染全局，通过将原版本css增加scoped处理，限定在特定容器类中。
考虑到轻量，这里使用spectre库，通过下面命令生成spectre-scoped.min.css，增加了限定类`.spectre`：

	node make.js

打开测试页test.html查看效果。在test.js编辑测试schema。
