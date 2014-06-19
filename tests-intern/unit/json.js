define([
	'intern!object',
	'intern/chai!assert',
	'dojo/json'
], function (registerSuite, assert, json) {
	registerSuite({
		name: 'dojo/json',

		'.parse': {
			'simple string': function () {
				assert.deepEqual({ foo: 'bar' }, JSON.parse('{"foo":"bar"}'));
			},

			'simple true': function () {
				assert.deepEqual({ foo: true }, JSON.parse('{"foo":true}'));
			},

			'simple false': function () {
				assert.deepEqual({ foo: false }, JSON.parse('{"foo":false}'));
			},

			'simple null': function () {
				assert.deepEqual({ foo: null }, JSON.parse('{"foo":null}'));
			},

			'simple number': function () {
				assert.deepEqual({ foo: 3.3 }, JSON.parse('{"foo":3.3}'));
			},

			'strict string': function () {
				assert.deepEqual({ foo: 'bar' }, JSON.parse('{"foo":"bar"}', true));
			},

			'strict empty string': function () {
				assert.deepEqual({ foo: '' }, JSON.parse('{"foo":""}', true));
			},

			'strict escaped string': function () {
				assert.deepEqual({ foo: 'b\n\t\"ar()' }, JSON.parse('{"foo":"b\\n\\t\\"ar()"}', true));
			},

			'strict true': function () {
				assert.deepEqual({ foo: true }, JSON.parse('{"foo":true}', true));
			},

			'strict false': function () {
				assert.deepEqual({ foo: false }, JSON.parse('{"foo":false}', true));
			},

			'strict null': function () {
				assert.deepEqual({ foo: null }, JSON.parse('{"foo":null}', true));
			},

			'strict number': function () {
				assert.deepEqual({ foo: 3.3 }, JSON.parse('{"foo":3.3}', true));
			},

			'strict negative number': function () {
				assert.deepEqual({ foo: -3.3 }, JSON.parse('{"foo":-3.3}', true));
			},

			'strict negative exponent': function () {
				assert.deepEqual({ foo: 3.3e-33 }, JSON.parse('{"foo":3.3e-33}', true));
			},

			'strict exponent': function () {
				assert.deepEqual({ foo: 3.3e33 }, JSON.parse('{"foo":3.3e33}', true));
			},

			'strict array': function () {
				assert.deepEqual({ foo: [3, true, []] }, JSON.parse('{"foo":[3,true,[]]}', true));
			},

			'bad call throws': function () {
				assert.throws(function () {
					JSON.parse('{"foo":alert()}', true);
				});
			},

			'bad math throws': function () {
				assert.throws(function () {
					JSON.parse('{"foo":3+4}', true);
				});
			},

			'bad array index throws': function () {
				assert.throws(function () {
					JSON.parse('{"foo":"bar"}[3]', true);
				});
			},

			'unquoted object key throws': function () {
				assert.throws(function () {
					JSON.parse('{foo:"bar"}', true);
				});
			},

			'unclosed array throws': function () {
				assert.throws(function () {
					JSON.parse('[', true);
				});
			},

			'closing an unopened object literal throws': function () {
				assert.throws(function () {
					JSON.parse('}', true);
				});
			},

			'malformed array throws': function () {
				assert.throws(function () {
					JSON.parse('["foo":"bar"]');
				});
			}
		},

		'.stringify': {
			'string': function () {
				assert.equal('{"foo":"bar"}', JSON.stringify({"foo":"bar"}));
			},

			'null': function () {
				assert.equal('{"foo":null}', JSON.stringify({"foo":null}));
			},

			'function': function () {
				assert.equal('{}', JSON.stringify({"foo":function(){}}));
			},

			'NaN': function () {
				assert.equal('{"foo":null}', JSON.stringify({"foo":NaN}));
			},

			'Infinity': function () {
				assert.equal('{"foo":null}', JSON.stringify({"foo":Infinity}));
			},

			'date': function () {
				// there is differences in how many decimals of accuracies in seconds in how Dates are serialized between browsers
				assert.match(JSON.parse(JSON.stringify({"foo":new Date(1)})).foo, /1970-01-01T00:00:00.*Z/);
			},

			'inherited object': function () {
				function FooBar() { this.foo = "foo"; }
				FooBar.prototype.bar = "bar";
				assert.equal('{"foo":"foo"}', JSON.stringify(new FooBar()));
			},

			'toJson': function () {
				assert.equal('{"foo":{"name":"value"}}', JSON.stringify({foo:{toJSON:function(){return {name:"value"}; }}}));
			}
		}
	});
});