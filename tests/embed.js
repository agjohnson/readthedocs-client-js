/* Client embed tests */

var jsdom = require('jsdom'),
    sinon = require('sinon');

exports.testEmbed = function (test) {
    test.expect(4);
    var Embed = require('../lib/readthedocs').Embed,
        embed = new Embed('project', 'version', 'doc', 'section');
    test.equal(embed.project, 'project');
    test.equal(embed.version, 'version');
    test.equal(embed.doc, 'doc');
    test.equal(embed.section, 'section');
    test.done();
};

exports.testEmbedFromAPI = function (test) {
    test.expect(1);
    var Embed = require('../lib/readthedocs').Embed;
    test.throws(
        function () {
            var embed = Embed.from_api();
        },
        Error,
        'From API not implemented yet'
    );
    test.done();
};

exports.testEmbedFromGlobalFail = function (test) {
    test.expect(1);
    jsdom.env(
        '<html><body></body></html>',
        [],
        function (errs, window) {
            global.window = window;
            var Embed = require('../lib/readthedocs').Embed;
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
            var Embed = require('../lib/readthedocs').Embed,
                embed = Embed.from_global();
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
            var Embed = require('../lib/readthedocs').Embed,
                embed = Embed.from_global();
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
    test.expect(3);

    // Mock jQuery ajax method
    var jQuery = require('../bower_components/jquery-min/jquery.min');
    sinon.stub(jQuery, 'ajax')
        .yieldsTo('success', {'meta': {'project': 'foobar'}}, 200, {});

    jsdom.env(
        '<html><body></body></html>',
        [],
        function (errs, window) {
            global.window = window;
            window.jQuery = jQuery;
            var Embed = require('../lib/readthedocs').Embed,
                embed = new Embed('project', 'version', 'doc', 'section');
            embed.fetch(function (section) {
                test.equal(section.project, 'foobar');
                test.ok(jQuery.ajax.calledWithMatch({
                    'type': 'GET',
                    url: 'https://api.grokthedocs.com/api/v1/embed/',
                    crossDomain: true,
                }));
                test.deepEqual(embed.cache.project, 'foobar');
                jQuery.ajax.restore();
                test.done();
            });
        }
    );
};

exports.testEmbedFetchFailure = function (test) {
    test.expect(3);

    // Mock jQuery ajax method
    var jQuery = require('../bower_components/jquery-min/jquery.min');
    sinon.stub(jQuery, 'ajax')
        .yieldsTo('error', {'foo': 'bar'}, 200, new Error('Foobar'));

    jsdom.env(
        '<html><body></body></html>',
        [],
        function (errs, window) {
            global.window = window;
            window.jQuery = jQuery;
            var Embed = require('../lib/readthedocs').Embed,
                embed = new Embed('project', 'version', 'doc', 'section');
            embed.fetch(
                function (data) {
                    test.ok(false);
                    test.done();
                },
                function (data) {
                    test.equal(data['foo'], 'bar');
                    test.ok(jQuery.ajax.calledWithMatch({
                        'type': 'GET',
                        url: 'https://api.grokthedocs.com/api/v1/embed/',
                        crossDomain: true,
                    }));
                    test.equal(embed.cache, null);
                    jQuery.ajax.restore();
                    test.done();
                }
            );
        }
    );
};
