define([
	'require',
	'intern!object',
	'intern/chai!assert'
], function (require, registerSuite, assert) {
	/* globals ieTrimSpaceBetweenTags */

	function testQueriedHtmlSet(session, args) {
		return session.executeAsync(function (queryStr, markup, done) {
				require(['dojo/html', 'dojo/query', 'dojo/domReady!'], function (html, query) {
					var targetNode = query(queryStr)[0];
					var actual;

					html.set(targetNode, markup);
					actual = ieTrimSpaceBetweenTags(targetNode.innerHTML.toLowerCase());
					done(markup.toLowerCase() === actual);
				});
			}, args)
			.then(function (result) {
				assert.isTrue(result);
			});
	}

	registerSuite({
		name: 'dojo/html',

		beforeEach: function () {
			return this.get('remote')
				.setExecuteAsyncTimeout(10000)
				.get(require.toUrl('./support/html.html'))
				.executeAsync(function (done) {
					window.ieTrimSpaceBetweenTags = function (str){
						return str.replace(/(<[a-z]*[^>]*>)\s*/ig, '$1');
					};
					require(['dojo/_base/declare'], function (declare) {
						declare('SimpleThing', null, {
							constructor: function(params, node) {
								node.setAttribute('test', 'ok');
							}
						});

						done();
					});
				});
		},

		'.set': {
			'basic usage': function () {
				var query = 'body';
				var markup = 'expected';

				return testQueriedHtmlSet(this.get('remote'), [query, markup]);
			},


			'attach onEnd handler': function () {
				return this.get('remote')
					.executeAsync(function (done) {
						require(['dojo/html', 'dojo/domReady!'], function (html) {
							var targetNode = document.body;
							var msg = 'expected';
							var handler = function () {
								done(targetNode.innerHTML);
							};

							html.set(targetNode, msg, { onEnd: handler });
						});
					})
					.then(function (result) {
						assert.equal(result, 'expected');
					});
			},
			'parse content true': function () {
				return this.get('remote')
					.executeAsync(function (done) {
						require(['dojo/html', 'dojo/domReady!'], function (html) {
							var targetNode = document.body;
							var content = '<div data-dojo-type="SimpleThing" data-dojo-id="ifrs" data="{}"></div>';
							var options = {
								parseContent: true,
								postscript: function () {
									this.set();

									done({
										/* globals ifrs */
										ifrs: !!(typeof ifrs !== 'undefined' && ifrs.declaredClass === 'SimpleThing'),
										parseResultsLength: this.parseResults.length
									});
								}
							};

							html.set(targetNode, content, options);
						});
					})
					.then(function (result) {
						assert.isTrue(result.ifrs);
						assert.equal(result.parseResultsLength, 1);
					});
			},

			'change content of TRhead': function () {
				var query = 'table#tableTest > thead > tr';
				var markup = '<td><div>This</div>Should<u>Work</u></td>';

				return testQueriedHtmlSet(this.get('remote'), [query, markup]);
			},

			'change content of THhead': function () {
				var query = 'table#tableTest > thead';
				var markup = '<tr><td><div>This</div>Should<u>Work</u></td></tr>';

				return testQueriedHtmlSet(this.get('remote'), [query, markup]);
			},

			'change content of TRBody': function () {
				var query = 'table#tableTest > tbody > tr';
				var markup = '<td><div>This</div>Should<u>Work</u></td>';

				return testQueriedHtmlSet(this.get('remote'), [query, markup]);
			},

			'change content of TBody': function () {
				var query = 'table#tableTest > tbody';
				var markup = '<tr><td><div>This</div>Should<u>Work</u></td></tr>';

				return testQueriedHtmlSet(this.get('remote'), [query, markup]);
			},

			'change content of Table': function () {
				var query = 'table#tableTest';
				var markup = '<tbody><tr><td><div>This</div>Should<u>Work</u></td></tr></tbody>';

				return testQueriedHtmlSet(this.get('remote'), [query, markup]);
			},
			
			'basic NodeList': function () {
				return this.get('remote')
					.executeAsync(function (done) {
						require([
							'dojo/html',
							'dojo/dom-construct',
							'dojo/query',
							'dojo/domReady!'
						], function (html, domConstruct, query) {
							var targetNode = document.body;
							var tmpUL = domConstruct.create('ul');
							domConstruct.create('li', { innerHTML: 'item 1' }, tmpUL);
							domConstruct.create('li', { innerHTML: 'item 2' }, tmpUL);

							html.set(targetNode, tmpUL.childNodes);
							done(query('li', document.body).length);
						});
					})
					.then(function (result) {
						assert.equal(result, 2);
					});
			},

			'mixed content': function () {
				var query = 'body';
				var markup = '<h4>See Jane</h4>Look at her <span>Run</span>!';

				return testQueriedHtmlSet(this.get('remote'), [query, markup]);
			},

			'extract content option': function () {
				return this.get('remote')
					.executeAsync(function (queryStr, markup, done) {
						require(['dojo/html', 'dojo/query', 'dojo/domReady!'], function (html, query) {
							var targetNode = document.body;
							var markup = ''
								+'<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN">'
								+'<html>											'
								+'	<head>											'
								+'		<title>										'
								+'			the title									 '
								+'		</title>									'
								+'	</head>											'
								+'	<body>											'
								+'		<p>											'
								+'			This is the <b>Good Stuff</b><br>		'
								+'		</p>										'
								+'	</body>											'
								+'</html>											';

							html.set(targetNode, markup, { extractContent: true });
							done({
								targetNodeMissingTitle: (targetNode.innerHTML.indexOf('title') === -1),
								actualLength: query('*', targetNode).length
							});
						});
					})
					.then(function (result) {
						assert.isTrue(result.targetNodeMissingTitle);
						assert.equal(result.actualLength, 3);
					});
			}
		},

		'._emptyNode': function () {
			return this.get('remote')
				.executeAsync(function (done) {
					require(['dojo/html', 'dojo/domReady!'], function (html) {
						var targetNode = document.body;

						targetNode.innerHTML = '<div><span>just</span>some test<br/></div>text';
						html._emptyNode(targetNode);
						done(!!(targetNode.childNodes.length === 0 && targetNode.innerHTML === ''));
					});
				})
				.then(function (result) {
					assert.isTrue(result);
				});
		},

		'query mixin': {

		}
	});
});