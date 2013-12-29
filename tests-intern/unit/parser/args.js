define([
	'intern!object',
	'intern/chai!assert',
	'dojo/parser',
	'dojo/_base/lang',
	'dojo/dom-construct',
	'dojo/_base/declare',
	'dojo/_base/window'
], function (registerSuite, assert, parser, lang, domConstruct, declare, win) {
	var mixin = lang.mixin,
		container;

	declare('tests.parser.Class1', null, {
		constructor: function (args) {
			this.params = args;
			mixin(this, args);
		},
		strProp1: 'original1',
		strProp2: 'original2'
	});

	registerSuite({
		name: 'args scope test',

		setup: function () {
			container = domConstruct.place(
				'<div id="main">' +
					'<div data-myscope-type="tests.parser.Class1" data-myscope-id="scopeObj"' +
						'data-myscope-props="strProp1:\'text\'">' +
					'</div>' +
					'<div data-dojo-type="tests.parser.Class1" data-dojo-id="normalObj"' +
						'data-dojo-props="strProp1:\'text\'">' +
					'</div>' +
				'</div>', win.body());
		},

		teardown: function () {
			domConstruct.empty(win.body());
			container = null;
		},

		'noArgs': function () {
			// testing parse() with no arguments
			var dfd = this.async();
			parser.parse().then(dfd.callback(function (widgets) {
				assert.lengthOf(widgets, 1, 'found 1 widget');
				assert.equal(widgets[0].strProp1, 'text');
			}), dfd.reject.bind(dfd));
		},

		'optionsOnly': function () {
			// Test when only the options argument is passed, and it does not contain a rootNode.
			// For 2.0, if we drop scope parameter, change this test.
			var dfd = this.async();
			parser.parse({ scope: 'myscope' }).then(dfd.callback(function (widgets) {
				var scopeObj = window.scopeObj;
				assert.lengthOf(widgets, 1, 'found 1 widget');
				assert.equal(scopeObj.strProp1, 'text');
			}), dfd.reject.bind(dfd));
		}
	});
});
