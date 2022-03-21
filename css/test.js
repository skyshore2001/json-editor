// refer to: https://github.com/json-editor/json-editor
var schema = {
	title: "字段配置",
	type: "array",
	format: "tabs",
	items: {
		title: "字段",
		type: "object",
//		format: "categories",
//		headerTemplate: "{{i1}} {{self.name}} {{self.title}}",
		options: {
			onNotify: function (val, isManualChange) {
				return val.title? val.title + '(' + val.name + ')': val.name;
			}
		},
		properties: {
			name: {
				title: "name/字段名",
				type: "string",
				required: true,
				options: {
					onNotify: function (val, isManualChange) {
						if (isManualChange)
							this.parent.editors["type"].setValue(UiMeta.guessType(val));
					}
				}
			},
			title: {
				title: "title/显示名",
				required: true,
				type: "string"
			},
			type: {
				title: "类型",
				type: "string",
				enum: [
					"s",
					"t",
					"i",
					"n",
					"tm",
					"date",
					"flag",
					"real",
					"tt",
					"subobj"
				],
				default: "s",
				required: true,
				options: {
					enum_titles: [
						"s-字符串",
						"t-长文本",
						"i-整数",
						"n-小数",
						"tm-日期时间",
						"date-日期",
						"flag-标志",
						"real-浮点数",
						"tt-64K以上文本",
						"subobj-子对象"
					]
				}
			},
			notInList: {
				title: "不在列表中显示",
				type: "boolean",
				required: true,
				format: "checkbox"
			},
			linkTo: {
				type: "string",
				options: {
					dependencies: {
						type: "i"
					}
				}
			},
			uiMeta: {
				title: "uiMeta/页面名",
				type: "string",
				options: {
					dependencies: {
						uiType: "subobj"
					}
				},
				required: true,
				description: "指定已定义的页面名(UiMeta.name)"
			},
			uiType: {
				title: "uiType/UI类型",
				type: "string",
				enum: [
					"text",
					"json",
					"combo-simple",
					"combo",
					"combo-db",
					"combogrid",
					"upload",
					"subobj"
				],
				default: "text",
				options: {
					enum_titles: [
						"text:文本框",
						"json:JSON配置",
						"combo-simple:下拉列表",
						"combo:下拉列表-值映射",
						"combo-db:下拉列表-接口取值",
						"combogrid:下拉表格-接口取值",
						"upload:图片或文件",
						"subobj:子对象"
					],
				}
			},
			opt: {
				title: "opt/配置代码",
				type: "string",
				format: "javascript",
				options: {
					input_height: "200px",
					ace: {
						minLines: 5,
					},
				},
				description: "<a class='easyui-linkbutton btnExample' href='javascript:;'>查看示例</a>"
			},
			pos: {
				title: "pos/对话框排版",
				type: "object",
				format: "grid",
				properties: {
					inline: {
						type: "boolean",
						required: true,
						format: "checkbox",
						description: "勾上表示使用多列布局，本字段接上一字段，不换行。"
					},
					extend: {
						type: "integer",
						description: "在多列布局时，设置1表示多占用1个字段的位置。"
					},
					group: {
						type: "string",
						description: "指定分组名，字段开始一个新的组（显示一行横线）。`-`表示没有名字。"
					},
					tab: {
						type: "string",
						description: "字段放在指定Tab页上，如`基本`, `高级`"
					}
				}
			}
		}
	}
};

var editorOpt = {
	schema: schema,
	no_additional_properties: true,
};
