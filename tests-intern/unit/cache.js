define([
	'intern!object',
	'intern/chai!assert',
	'sinon',
	'dojo/cache',
	'dojo/_base/url',
	'dojo/_base/lang'
], function (registerSuite, assert, sinon, cache, Url, lang) {
	var expected = '<h1>Hello World</h1>';
	var cacheNamespace = 'dojo.tests-intern.unit.__support.cache';
	var cacheSanitizeOptions = { sanitize: true };

	registerSuite(function () {
		return {
			name: 'dojo/cache',

			'caches xhr request': function () {
				var actual = lang.trim(cache(cacheNamespace, 'regular.html'));
				assert.equal(actual, expected);
			},

			'sanatizes request': function () {
				var actual =lang.trim(cache(cacheNamespace, 'sanitized.html', cacheSanitizeOptions));
				assert.equal(actual, expected);
			},

			'object variant passed as module': function () {
				var objPath = require.toUrl('dojo/tests-intern/unit/__support/cache/object.html');
				var actual = lang.trim(cache(new Url(objPath), cacheSanitizeOptions));
				assert.equal(actual, expected);
			},

			'unset cache returns null and does not throw': function () {
				assert.isNull(cache(cacheNamespace, 'regular.html', null));
			},

			'set value': function () {
				assert.equal('', cache(cacheNamespace, 'regular.html', ''));
				assert.equal('', cache(cacheNamespace, 'regular.html'));
			}
		};
	});
});
