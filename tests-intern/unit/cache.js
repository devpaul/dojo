define([
	'intern!object',
	'intern/chai!assert',
	'sinon',
	'dojo/Deferred',
	'dojo/_base/kernel',
	'dojo/has',
	'dojo/_base/lang'
], function (registerSuite, assert, sinon, Deferred, dojo, has, lang) {
	registerSuite(function () {
		var regular = '<h1>Hello World</h1>';
		var unsanitized = '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"' +
			'"http://www.w3.org/TR/html4/loose.dtd">' +
			'<html>' +
			'<head>' +
			'	<script type="text/javascript" src="../../dojo.js"></script>' +
			'	<script type="text/javascript" src="../../cache.js"></script>' +
			'</head>' +
			'<body class="tundra">' +
			'	<h1>Hello World</h1>' +
			'</body>' +
			'</html>';
		var cache;

		return {
			name: 'dojo/cache',

			'beforeEach': function () {
				var dfd = new Deferred();

				require.undef('dojo/cache');
				require.undef('dojo/text');
				delete dojo.cache;
				if(has('host-browser')) {
					mockGetTextForBrowser().then(requireDojoCache);
				} else {
					mockGetTextForNode().then(requireDojoCache);
				}

				return dfd;


				function requireDojoCache() {
					require(['dojo/cache'], function (_cache) {
						cache = _cache;
						dfd.resolve();
					});
				}

				function mockGetTextForBrowser() {
					var dfd = new Deferred();

					has('config-requestProvider');
					require.undef('dojo/request');
					require.undef('dojo/request/default!');

					require(['dojo/request/registry'], function (registry) {
						registry.register(/.*regular\.html$/, function () {
							var dfd = new Deferred();
							dfd.resolve(regular);
							return dfd;
						});
						registry.register(/.*sanitized\.html$/, function () {
							var dfd = new Deferred();
							dfd.resolve(unsanitized);
							return dfd;
						});
						dfd.resolve();
					});

					return dfd;
				}

				function mockGetTextForNode() {
					// TODO implement
					throw new Error('implement');
				}
			},

			'afterEach': function () {
				has('config-requestProvider', false);
				require.undef('dojo/cache');
				require.undef('dojo/text');
				require.undef('dojo/request');
				require.undef('dojo/request/default!');
			},

			'caches xhr request': function () {
				var actual = lang.trim(cache('dojo.tests.cache', 'regular.html'));
				assert.equal(actual, regular);
			},

			'sanatizes request': function () {
				var actual =lang.trim(cache('dojo.tests.cache', 'sanitized.html', { sanitize: true }));
				assert.equal(actual, regular);
			},

			'object variant passed as module': function () {

			},

			'files are loaded only once': function () {

			},

			'unset cache returns null and does not throw': function () {

			},

			'set value': function () {

			}
		};
	});
});
