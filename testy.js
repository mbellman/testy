(function(){
	/* -============- *\
	|  OUTPUT STRINGS  |
	\* -============- */
	var H2_TAG = '<h2>{*}</h2>';
	var H4_TAG = '<h4>{*}</h4>';
	var DIV_TAG = '<div id="{*}"></div>';
	var SPAN_TAG = '<span style="color: {*}">{m}</span>';
	var BR_TAG = '<br />';
	var BODY_CSS = 'body { font-family: Arial; } h1, h2, h3, h4, h5 { margin: 10px 0 -10px; }';

	/* -=======- *\
	|  VARIABLES  |
	\* -=======- */
	var PASS_COLOR = '#5c5';
	var FAIL_COLOR = 'red';

	var describe_depth = 0;
	var total_failures = 0;
	var total_assertions = 0;
	var unit_assertions = 0;
	var assert_errors = [];
	var timer = 0;

	/* -===========- *\
	|  DOM SHORTCUTS  |
	\* -===========- */
	function e (element) {
		return document.getElementById(element);
	}

	function h2 (message) {
		return H2_TAG.replace('{*}', message);
	}

	function h4 (message) {
		return H4_TAG.replace('{*}', message);
	}

	function div (id) {
		return '<div id="' + id + '"></div>';
	}

	function span (color, message) {
		return SPAN_TAG.replace('{*}', color).replace('{m}', message);
	}

	function br () {
		return BR_TAG;
	}

	function print (output) {
		document.write(output + br());
	}

	function html (element, content) {
		element.innerHTML = content;
	}

	/* -============- *\
	|  HANDY ROUTINES  |
	\* -============- */
	function each (array, handler) {
		var i = -1;

		while (array[++i]) {
			handler(array[i], i);
		}
	}

	function getAssertions (unitHandler) {
		var lines = unitHandler.toString().split('\n');
		var line;
		var i = 0;

		while (i < lines.length) {
			line = lines[i] = lines[i].trim();

			if (!equal(line.substring(0, 6), 'assert')) {
				lines.splice(i, 1);
				continue;
			}

			i++;
		}

		return lines;
	}

	/* -=============- *\
	|  ASSERTION TOOLS  |
	\* -=============- */
	function equal (a, b) {
		return a === b;
	}

	function that (a) {
		return {
			equals: function (b) {
				return equal(a, b);
			},
			is: {
				not: function (b) {
					return !equal(a, b);
				},
				a: {
					string: (typeof a === 'string'),
					number: (typeof a === 'number'),
					function: (typeof a === 'function')
				},
				an: {
					object: (typeof a === 'object' && !(a instanceof Array)),
					array: (a instanceof Array)
				},
				true: (a === true),
				truthy: (!!a),
				false: (a === false),
				falsy: (!a),
				undefined: (typeof a === 'undefined'),
				null: (a === null)
			}
		};
	}

	/* -================- *\
	|  TEST REPORT OUTPUT  |
	\* -================- */
	function failIcon () {
		return span(FAIL_COLOR, '<b>X</b>');
	}

	function passIcon () {
		return span(PASS_COLOR, '<b>&#10003;</b>');
	}

	function reportIcon (condition) {
		return (condition ? passIcon() : failIcon());
	}

	function reportUnit (message, condition) {
		print(reportIcon(condition) + ' ' + message);
	}

	function reportError (message) {
		print(span('red', message));
	}

	function isPassing () {
		return total_failures === 0;
	}

	function isUnitPassing () {
		return assert_errors.length === 0;
	}

	function runTime () {
		return Date.now() - timer;
	}

	/* -====- *\
	|  EVENTS  |
	\* -====- */
	function onStart () {
		timer = Date.now();
		print(div('timer') + div('failures'));
	}

	function onBeforeUnit () {
		assert_errors.length = 0;
		unit_assertions = 0;
	}

	function onBeforeAssert () {
		total_assertions++;
		unit_assertions++;
	}

	function onComplete () {
		html(e('timer'), total_assertions + ' tests run in: ' + runTime() + 'ms');
		html(e('failures'), 'Failures: ' + span((isPassing() ? PASS_COLOR : FAIL_COLOR), total_failures));
	}

	/* -=- *\
	|  API  |
	\* -=- */
	window.describe = function (description, handler) {
		if (describe_depth === 0) {
			onStart();
			print(h2(description));
		} else {
			print(h4(description));
		}

		describe_depth++;
		handler();

		if (--describe_depth === 0) {
			onComplete();
		}
	};

	window.it = function (description, handler) {
		onBeforeUnit();
		handler();
		reportUnit(description, isUnitPassing());

		if (!isUnitPassing()) {
			var assertions = getAssertions(handler);

			each(assert_errors, function(assertion){
				reportError(assertions[assertion - 1]);
			});
		}
	};

	window.assert = function (condition) {
		onBeforeAssert();

		if (!condition) {
			assert_errors.push(unit_assertions);
			total_failures++;
		}
	};

	window.that = that;

	window.onload = function () {
		var css = document.createElement('style');
		css.type = 'text/css';
		css.innerHTML = BODY_CSS;
		document.getElementsByTagName('head')[0].appendChild(css);
	};
})();