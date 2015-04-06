/* Read the Docs Embed functions */

var doc = require('./doc'),
    Section = doc.Section,
    Page = doc.Page;


var Embed = function (config) {
    this._api_host = 'https://api.grokthedocs.com';
    if (typeof config == 'object') {
        if ('api_host' in config) {
            this._api_host = config['api_host'];
        }
    }
};

Embed.prototype.section = function (project, version, doc, section,
        callback, error_callback) {
    callback = callback || function () {};
    error_callback = error_callback || function () {};

    var self = this,
        data = {
            'project': project,
            'version': version,
            'doc': doc,
            'section': section
        };

    this._getObject(
        data,
        function (resp) {
            var section_ret = new Section(project, version, doc, section);
            section_ret.url = resp.url;
            section_ret.content = resp.content;
            section_ret.wrapped = resp.wrapped;
            callback(section_ret);
        },
        function (error, msg) {
            error_callback(error);
        }
    );
};

Embed.prototype.page = function (project, version, doc, callback,
        error_callback) {

    var self = this,
        data = {
            'project': project,
            'version': version,
            'doc': doc,
        };

    this._getObject(
        data,
        function (resp) {
            var page = new Page(project, version, doc);
            page.url = resp.url;
            // TODO headers is misleading here, rename it on the API
            page.sections = resp.headers;
            callback(page);
        },
        function (error, msg) {
            error_callback(error);
        }
    )
};

Embed.prototype._getObject = function (data, callback, error_callback) {
    var self = this,
        reqwest = require('reqwest');
    callback = callback || function () {};
    error_callback = error_callback || function () {};

    return reqwest({
        url: this._api_host + '/api/v1/embed/',
        method: 'get',
        contentType: 'application/json',
        crossDomain: true,
        headers: {'Accept': 'application/json'},
        data: data,
        success: callback,
        error: error_callback
    });
};

exports.Embed = Embed;
