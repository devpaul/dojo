define([
	'require',
	'intern!object',
	'intern/chai!assert'
], function (require, registerSuite, assert) {
	/* globals fx, on, domGeometry, domClass, baseFx, aspect, createAnimationList */
	function getPage(context, url) {
		return context.get('remote')
			.setAsyncScriptTimeout(5000)
			.get(require.toUrl(url))
			.waitForCondition('ready');
	}

	function applyCompressClass(context) {
		return context.execute(function () {
				domClass.add('foo', 'compressed');
				return domGeometry.position('foo');
			})
			.then(function (results) {
				assert.isTrue(results.h < 10);
			});
	}

	registerSuite({
		name: 'dojo/fx',

		'.slideTo': function () {
			return getPage(this, './fx.html')
				.executeAsync(function (done) {
					var anim = fx.slideTo({
						node: 'foo',
						duration: 500,
						left: 500,
						top: 50
					}).play();

					on(anim, 'End', function () {
						done(domGeometry.getMarginBox('foo'));
					});
				}).then(function (results) {
					assert.equal(results.t, 50);
					assert.equal(results.l, 500);
				});
		},

		'.wipeOut': function () {
			return getPage(this, './fx.html')
				.executeAsync(function (done) {
					var anim = fx.wipeOut({
						node: 'foo'
					}).play();

					on(anim, 'End', function () {
						done(domGeometry.position('foo'));
					});
				}).then(function (results) {
					assert.isTrue(results.w < 5);
				});
		},

		'.wipeIn': function () {
			return applyCompressClass(getPage(this, './fx.html'))
				.executeAsync(function (done) {
					var anim = fx.wipeIn({
						node: 'foo'
					}).play();

					on(anim, 'End', function () {
						done(domGeometry.position('foo'));
					});
				}).then(function (results) {
					assert.isTrue(results.h > 10);
				});
		},
		
		'.chain': {
			'onEnd both children animations are stopped': function () {
				return applyCompressClass(getPage(this, './fx.html'))
					.executeAsync(function (done) {
						var wipeInAnim = fx.wipeIn({
							node: 'foo',
							duration: 500
						});
						var fadeOutAnim = baseFx.fadeOut({
							node: 'foo',
							duration: 500
						});
						var anim = fx.chain([wipeInAnim, fadeOutAnim]);

						on(anim, 'End', function () {
							done({
								status: {
									wipeIn: wipeInAnim.status(),
									fadeOut: fadeOutAnim.status()
								}
							});
						});

						anim.play();
					})
					.then(function (results) {
						assert.equal(results.status.wipeIn, 'stopped');
						assert.equal(results.status.fadeOut, 'stopped');
					});
			},

			'delay': function () {
				return getPage(this, './fx.html')
					.executeAsync(function (done) {
						var anim = fx.chain(createAnimationList());
						var timer;

						aspect.after(anim, 'onEnd', function () {
							done({
								expected: anim.duration,
								actual: Date.now() - timer
							});
						}, true);

						timer = Date.now();
						anim.play();
					}).then(function (results) {
						assert.isTrue(results.actual > 100);
						assert.closeTo(results.actual, results.actual, 100);
					});
			},

			'onEnd is called': function () {
				return getPage(this, './fx.html')
					.executeAsync(function (done) {
						var fadeOutAnim = baseFx.fadeOut({ node: 'foo2', duration: 400 });
						var fadeInAnim = baseFx.fadeIn({ node: 'foo2', duration: 400 });
						var anim = fx.chain([fadeOutAnim, fadeInAnim]);
						aspect.after(anim, 'onEnd', function () {
							done();
						}, true);
						anim.play();
					});
			},

			'onPlay is called': function () {
				return getPage(this, './fx.html')
					.executeAsync(function (done) {
						var fadeOutAnim = baseFx.fadeOut({ node: 'foo2', duration: 400 });
						var fadeInAnim = baseFx.fadeIn({ node: 'foo2', duration: 400 });
						var anim = fx.chain([fadeOutAnim, fadeInAnim]);
						aspect.after(anim, 'onPlay', function () {
							done();
						}, true);
						anim.play();
					});
			}
		},


		'.combine': {
			'test basic functionality': function () {
				return applyCompressClass(getPage(this, './fx.html'))
					.executeAsync(function (done) {
						var wipeInAnim = fx.wipeIn({
							node: 'foo',
							duration: 500
						});
						var fadeInAnim = baseFx.fadeIn({
							node: 'foo',
							duration: 1000
						});
						var anim = fx.combine([wipeInAnim, fadeInAnim]);

						aspect.after(anim, 'onEnd', function () {
							done({
								status: {
									wipeIn: wipeInAnim.status(),
									fadeIn: fadeInAnim.status(),
									combine: anim.status()
								}
							});
						}, true);

						anim.play();
					})
					.then(function (results) {
						assert.equal(results.status.wipeIn, 'stopped');
						assert.equal(results.status.fadeIn, 'stopped');
						assert.equal(results.status.combine, 'stopped');
					});
			},
			
			'beforeBegin is called': function () {
				return getPage(this, './fx.html')
					.executeAsync(function (done) {
						var fadeOutAnim = baseFx.fadeOut({ node: 'foo2', duration: 400 });
						var fadeInAnum = baseFx.fadeIn({ node: 'foo2', duration: 400 });
						var anim = fx.combine([fadeOutAnim, fadeInAnum]);

						aspect.after(anim, 'beforeBegin', function () {
							done(true);
						}, true);
						anim.play();
					})
					.then(function (results) {
						assert.isTrue(results);
					});
			},

			'delay': function () {
				return getPage(this, './fx.html')
					.executeAsync(function (done) {
						var anim = fx.combine(createAnimationList());
						var timer;

						aspect.after(anim, 'onEnd', function () {
							done({
								expected: anim.duration,
								actual: Date.now() - timer
							});
						}, true);

						timer = Date.now();
						anim.play();
					})
					.then(function (results) {
						assert.isTrue(results.actual > 100);
						assert.closeTo(results.actual, results.actual, 100);
					});
			},
			
			'onEnd is called': function () {
				return getPage(this, './fx.html')
					.executeAsync(function (done) {
						var fadeOutAnim = baseFx.fadeOut({ node: 'foo2', duration: 400 });
						var fadeInAnim = baseFx.fadeIn({ node: 'foo2', duration: 400 });
						var anim = fx.combine([fadeOutAnim, fadeInAnim]);
						aspect.after(anim, 'onEnd', function () {
								done();
							}, true);
						anim.play();
					});
			},

			'onPlay is called': function () {
				return getPage(this, './fx.html')
					.executeAsync(function (done) {
						var fadeOutAnim = baseFx.fadeOut({ node: 'foo2', duration: 400 });
						var fadeInAnim = baseFx.fadeIn({ node: 'foo2', duration: 400 });
						var anim = fx.combine([fadeOutAnim, fadeInAnim]);
						aspect.after(anim, 'onPlay', function () {
							done();
						}, true);
						anim.play();
					});
			}
		},

		'.stop': {
			'delay': function () {
				return getPage(this, './fx.html')
					.executeAsync(function (done) {
						var anim = baseFx.fadeOut({ node: 'foo2', delay: 400 });

						aspect.after(anim, 'onPlay', function () {
							done(false);
						}, true);
						anim.play();
						anim.stop();
						setTimeout(function(){
							done(true);
						}, 500);
					})
					.then(function (results) {
						assert.isTrue(results);
					});
			},

			'delay passed to play': function () {
				return getPage(this, './fx.html')
					.executeAsync(function (done) {
						var anim = baseFx.fadeOut({ node: 'foo2' });

						aspect.after(anim, 'onPlay', function () {
							done(false);
						}, true);
						anim.play(400);
						anim.stop();
						setTimeout(function(){
							done(true);
						}, 600);
					})
					.then(function (results) {
						assert.isTrue(results);
					});
			}
		},
	});
});