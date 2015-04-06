/* Client embed tests */

var jsdom = require('jsdom'),
    sinon = require('sinon'),
    proxyquire = require('proxyquire').noCallThru(),
    doc = require('../lib/doc');

var Embed = proxyquire('../lib/embed', {
        'reqwest': function (options) {
            console.log(options)
        }
    })
    .Embed;


exports.testEmbed = function (test) {
    test.expect(2);
    var embed = new Embed();
    test.equal(embed._api_host, 'https://api.grokthedocs.com');
    var embed = new Embed({'api_host': 'http://localhost'});
    test.equal(embed._api_host, 'http://localhost');
    test.done();
};

exports.testEmbedFetch = function (test) {
    test.expect(8);

    var stub_req = sinon.stub().yieldsTo(
            'success',
            {content: 'Foobar'}
        ),
        Embed = proxyquire('../lib/embed', {
            'reqwest': stub_req
        }).Embed,
        embed = new Embed();

    embed.section(
        'project', 'version', 'doc', 'section',
        function (section) {
            test.equal(section.project, 'project');
            test.equal(section.version, 'version');
            test.equal(section.doc, 'doc');
            test.equal(section.section, 'section');
            test.equal(section.content, 'Foobar');
            test.ok(stub_req.calledWith(sinon.match({method: 'get'})));
            test.ok(stub_req.calledWith(sinon.match({crossDomain: true})));
            test.ok(stub_req.calledWith(sinon.match({
                url: 'https://api.grokthedocs.com/api/v1/embed/'
            })));
            test.done();
        }
    );
};

exports.testEmbedFetchFailure = function (test) {
    test.expect(5);

    var stub_req = sinon.stub().yieldsTo(
            'error',
            {'foo': 'bar'}
        ),
        Embed = proxyquire('../lib/embed', {
            'reqwest': stub_req
        }).Embed,
        embed = new Embed();

    embed.section(
        'project', 'version', 'doc', 'section',
        function (section) {
            test.ok(false);
        },
        function (error) {
            test.equal(error.project, null);
            test.equal(error['foo'], 'bar');
            test.ok(stub_req.calledWith(sinon.match({method: 'get'})));
            test.ok(stub_req.calledWith(sinon.match({crossDomain: true})));
            test.ok(stub_req.calledWith(sinon.match({
                url: 'https://api.grokthedocs.com/api/v1/embed/'
            })));
            test.done();
        }
    );
};
