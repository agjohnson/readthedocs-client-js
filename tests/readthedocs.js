/* Client tests */

var RTDClient = require('../lib/readthedocs').RTDClient,
    jsdom = require('jsdom');

exports.testClient = function (test) {
    test.expect(4);
    var client = new RTDClient('project', 'version', 'file', 'section');
    test.equal(client.project, 'project');
    test.equal(client.version, 'version');
    test.equal(client.file, 'file');
    test.equal(client.section, 'section');
    test.done();
};

exports.testClientFromAPI = function (test) {
    test.expect(1);
    test.throws(
        function () {
            var client = RTDClient.from_api('/test');
        },
        Error,
        'From API not implemented yet'
    );
    test.done();
};

exports.testClientFromGlobalFail = function (test) {
    test.expect(1);
    jsdom.env(
        '<html><body></body></html>',
        [],
        function (errs, window) {
            global.window = window;
            var RTDClient = require('../lib/readthedocs').RTDClient;
            test.throws(
                function () {
                    var client = RTDClient.from_global();
                },
                Error,
                'Missing variable throws exception'
            );
            test.done();
        }
    );
}

exports.testClientFromGlobalPass = function (test) {
    test.expect(4);
    jsdom.env(
        '<html><body></body></html>',
        [],
        function (errs, window) {
            global.window = window;
            var embed = {
                'project': 'project',
                'version': 'version',
                'file': 'file',
                'section': 'section'
            };
            window.READTHEDOCS_EMBED = embed;
            var RTDClient = require('../lib/readthedocs').RTDClient,
                client = RTDClient.from_global();
            test.equal(client.project, 'project');
            test.equal(client.version, 'version');
            test.equal(client.file, 'file');
            test.equal(client.section, 'section');
            test.done();
        }
    );
}

exports.testClientFromGlobalMissing = function (test) {
    test.expect(1);
    jsdom.env(
        '<html><body></body></html>',
        [],
        function (errs, window) {
            global.window = window;
            var embed = {'missing': 'everything'};
            window.READTHEDOCS_EMBED = embed;
            var RTDClient = require('../lib/readthedocs').RTDClient;

            var client = RTDClient.from_global();
            test.deepEqual(client, {
                'project': undefined,
                'version': undefined,
                'file': undefined,
                'section': undefined
            })
            test.done();
        }
    );
};
