define([
	'intern!object',
	'intern/chai!assert',
	'dojo/parser',
	'dojo/_base/array',
	'dojo/_base/declare',
	'dojo/_base/window',
	'dojo/Deferred',
	'dojo/dom',
	'dojo/dom-construct',
	'dojo/_base/lang',
], function (registerSuite, assert, parser, array, declare, win, Deferred, dom, domConstruct, lang) {
	// instances of AsyncWidget will finish initializing when this Deferred is resolved
	/*globals asyncWidget, syncWidget*/
	var finishCreatingAsyncWidgets = new Deferred();

	var AsyncWidget = declare('AsyncWidget', null, {
		declaredClass: 'AsyncWidget',
		markupFactory: function (params, node) {
			// the markup factory can return a promise, and the parser will wait
			return finishCreatingAsyncWidgets.then(function () { return new AsyncWidget(params, node); });
		},
		constructor: function (args) {
			this.params = args;
			lang.mixin(this, args);
		},
		startup: function () {
			this._started = true;
		}
	});

	declare('SyncWidget', null, {
		declaredClass: 'SyncWidget',
		constructor: function (args) {
			this.params = args;
			lang.mixin(this, args);
		},
		startup: function () {
			this._started = true;
		}
	});

	var container;

	registerSuite({
		name: 'parser async tests',
		setup: function () {
			domConstruct.place(
				'<div id="main">' +
					'<span data-dojo-id="asyncWidget" data-dojo-type="AsyncWidget">hi</span>' +
					'<span data-dojo-id="syncWidget" data-dojo-type="SyncWidget">there</span>' +
				'</div>', win.body());
		},

		teardown: function () {
			domConstruct.empty(win.body());
			container = null;
		},

		'parse': function () {
			var d = this.async(),
				parsePromise = parser.parse(dom.byId('main'));

			assert.isFalse(parsePromise.isFulfilled(), 'parse not finished yet');
			assert.isUndefined(window.asyncWidget, 'async widget not created yet');
			assert.isFalse(!!syncWidget._started, 'sync widget created but not started');

			finishCreatingAsyncWidgets.resolve(true);

			parsePromise.then(d.callback(function (list) {
				assert.isDefined(window.asyncWidget, 'async widget created');
				assert.isTrue(asyncWidget._started, 'async widget started');
				assert.isTrue(syncWidget._started, 'sync widget started too');
				assert.equal(array.map(list, function (cls) {
					return cls.declaredClass;
				}).join(', '), 'AsyncWidget, SyncWidget', 'list of instances returned from parser');
			}));
		}
	});
});
