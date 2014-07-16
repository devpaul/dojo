define([
	'./intern'
], function (intern) {
	intern.tunnel = 'NullTunnel';
	intern.tunnelOptions = {
		hostname: 'localhost',
		port: 4444
	};

	intern.environments = [
		{ browserName: 'firefox' },
		{ browserName: 'chrome' },
		{ browserName: 'safari' }
	];

	delete intern.suites;

	intern.functionalSuites = [ 'tests-intern/functional/html' ];

	return intern;
});
