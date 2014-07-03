define([
	'sinon-lib',
	'sinon-lib/sinon/util/event',
	'sinon-lib/sinon/util/fake_xml_http_request',
	'sinon-lib/sinon/util/fake_xdomain_request',
	'sinon-lib/sinon/util/fake_server'
], function(sinon) {
	sinon.extend(sinon, this.sinon);
	delete this.sinon;  // remove it from global scope
	return sinon;
});
