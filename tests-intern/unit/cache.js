define([
	'intern!object',
	'intern/chai!assert',
	'sinon',
	'dojo/cache',
	'dojo/_base/lang'
], function (registerSuite, assert, sinon, cache, lang) {
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
		var getTextStub;

		return {
			name: 'dojo/cache',

			'beforeEach': function () {
				// TODO this stub wont work since dojo/text caches require.getText
				getTextStub = sinon.stub(require, 'getText');
			},

			'caches xhr request': function () {
				var actual;

				getTextStub.returns(regular);
				actual = lang.trim(cache('dojo.tests.cache', 'regular.html'));
				assert.equal(actual, regular);
			},

			'sanatizes request': function () {
				var actual;

				getTextStub.returns(unsanitized);
				actual = lang.trim(cache('dojo.tests.cache', 'sanatized.html', { sanitize: true }));
				assert.equal(actual, regular);
			},

			'object variant passed as module': function () {

			},

			'files are loaded only once': function () {

			},

			'unset cache returns null and does not throw': function () {

			},

			'set value': function () {

			},

			'afterEach': function () {
				getTextStub.restore();
			}
		};
	});
});
