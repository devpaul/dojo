define([
	'require',
	'intern!object',
	'intern/chai!assert',
	'dojo/request/registry',
	'dojo/request',
	'dojo/domReady!'
], function (require, registerSuite, assert, registry, request) {
	registerSuite({
		name: 'dojo/request/registry',

		'.get': {
			'fallback works': function () {
				var dfd = this.async();
				var handle = registry.register('foobar', function () { });
				var url = require.toUrl('../../functional/support/standard.html');

				registry.get(url).then(dfd.callback(function () {
					handle.remove();
				}), dfd.reject.bind(dfd));
			}
		},

		'.register': {
			'RegExp registration works': function () {
				var dfd = this.async();
				var handle = registry.register(/^foo/, dfd.callback(function (url) {
					assert.match(url, /^foo/);
					handle.remove();
				}));

				registry.get('foobar');
			},

			'functional registration works': function () {
				var dfd = this.async();
				var handle = registry.register(function (url, options) {
					return options.method === 'POST';
				}, dfd.callback(function (url, options) {
					assert.equal(options.method, 'POST');
					handle.remove();
				}));

				registry.post('foobar');
			},

			'string registration works': function () {
				var dfd = this.async();
				var handle = registry.register('foobar', dfd.callback(function (url) {
					assert.equal(url, 'foobar');
					handle.remove();
				}));

				registry.get('foobar');
			}
		}
	});
});