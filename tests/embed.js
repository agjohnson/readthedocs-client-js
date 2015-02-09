/* Client embed tests */

var jsdom = require('jsdom');

exports.testEmbed = function (test) {
    test.expect(4);
    var Embed = require('../lib/readthedocs').Embed,
        embed = new Embed('project', 'version', 'file', 'section');
    test.equal(embed.project, 'project');
    test.equal(embed.version, 'version');
    test.equal(embed.file, 'file');
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
                'file': 'file',
                'section': 'section'
            };
            var Embed = require('../lib/readthedocs').Embed,
                embed = Embed.from_global();
            test.equal(embed.project, 'project');
            test.equal(embed.version, 'version');
            test.equal(embed.file, 'file');
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
                'file': undefined,
                'section': undefined,
                'api_host': 'https://api.grokthedocs.org'
            })
            test.done();
        }
    );
};
