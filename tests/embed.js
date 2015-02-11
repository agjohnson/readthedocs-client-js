/* Client embed tests */

var jsdom = require('jsdom'),
    sinon = require('sinon'),
    proxyquire = require('proxyquire').noCallThru();

var Embed = proxyquire('../lib/embed', {
        'reqwest': function (options) {
            console.log(options)
        }
    })
    .Embed;

exports.testEmbed = function (test) {
    test.expect(4);
    var embed = new Embed('project', 'version', 'doc', 'section');
    test.equal(embed.project, 'project');
    test.equal(embed.version, 'version');
    test.equal(embed.doc, 'doc');
    test.equal(embed.section, 'section');
    test.done();
};

exports.testEmbedFromGlobalFail = function (test) {
    test.expect(1);
    jsdom.env(
        '<html><body></body></html>',
        [],
        function (errs, window) {
            global.window = window;
            test.throws(
                function () {
                    var embed = Embed.from_global();
                },
                Error,
                'Missing variable throws exception'
            );
            test.done();
        }
    );
}

exports.testEmbedFromGlobalPass = function (test) {
    test.expect(4);
    jsdom.env(
        '<html><body></body></html>',
        [],
        function (errs, window) {
            global.window = window;
            window.READTHEDOCS_EMBED = {
                'project': 'project',
                'version': 'version',
                'doc': 'doc',
                'section': 'section'
            };
            var embed = Embed.from_global();
            test.equal(embed.project, 'project');
            test.equal(embed.version, 'version');
            test.equal(embed.doc, 'doc');
            test.equal(embed.section, 'section');
            test.done();
        }
    );
};

exports.testEmbedFromGlobalMissing = function (test) {
    test.expect(1);
    jsdom.env(
        '<html><body></body></html>',
        [],
        function (errs, window) {
            global.window = window;
            window.READTHEDOCS_EMBED = {'missing': 'everything'};
            var embed = Embed.from_global();
            test.deepEqual(embed , {
                'project': undefined,
                'version': undefined,
                'doc': undefined,
                'section': undefined,
                'api_host': 'https://api.grokthedocs.com'
            })
            test.done();
        }
    );
};

exports.testEmbedFetch = function (test) {
    test.expect(5);

    var stub_req = sinon.stub().yieldsTo(
            'success',
            {meta: {project: 'foobar'}}
        ),
        Embed = proxyquire('../lib/embed', {
            'reqwest': stub_req
        }).Embed,
        embed = new Embed('project', 'version', 'doc', 'section');

    embed.fetch(function (section) {
        test.equal(section.project, 'foobar');
        test.ok(stub_req.calledWith(sinon.match({method: 'get'})));
        test.ok(stub_req.calledWith(sinon.match({crossDomain: true})));
        test.ok(stub_req.calledWith(sinon.match({
            url: 'https://api.grokthedocs.com/api/v1/embed/'
        })));
        test.deepEqual(embed.cache.project, 'foobar');
        test.done();
    });
};

exports.testEmbedFetchFailure = function (test) {
    test.expect(6);

    var stub_req = sinon.stub().yieldsTo(
            'error',
            {'foo': 'bar'}
        ),
        Embed = proxyquire('../lib/embed', {
            'reqwest': stub_req
        }).Embed,
        embed = new Embed('project', 'version', 'doc', 'section');

    embed.fetch(
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
            test.deepEqual(embed.cache, null);
            test.done();
        }
    );
};
