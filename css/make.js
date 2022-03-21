var fs = require('fs');
var css = fs.readFileSync('spectre.min.css', 'utf-8') + fs.readFileSync('spectre-icons.min.css', 'utf-8');
var css1 = scopeCss(css, '.spectre');
fs.writeFileSync('spectre-scoped.min.css', css1);
console.log('=== create spectre-scoped.min.css');

function scopeCss(css, selector)
{
	var level = 1;
	var css1 = css.replace(/\/\*(.|\s)*?\*\//g, '')
	.replace(/([^{}]*)([{}])/g, function (ms, text, brace) {
		if (brace == '}') {
			-- level;
			return ms;
		}
		if (brace == '{' && level++ != 1)
			return ms;

		// level=1
		return ms.replace(/((?:^|,)\s*)([^,{}]+)/g, function (ms, ms1, sel) { 
			if (sel[0] == '@')
				return ms;
			if (sel == 'html' || sel == 'body') {
				return ms1 + selector;
			}
			return ms1 + selector + ' ' + sel;
		});
	});
	return css1;
}
