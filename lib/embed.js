/* Read the Docs Embed functions */

var Section = require('./doc').Section;


var Embed = function (project, version, doc, section, config) {
    this.project = project;
    this.version = version;
    this.doc = doc;
    this.section = section;

    this.api_host = 'https://api.grokthedocs.com';
    if (typeof config == 'object') {
        if ('api_host' in config) {
            this.api_host = config['api_host'];
        }
    }
};

// Factory methods for constructing Embed instances
Embed.from_global = function () {
    try {
        return new Embed(
            window.READTHEDOCS_EMBED['project'],
            window.READTHEDOCS_EMBED['version'],
            window.READTHEDOCS_EMBED['doc'],
            window.READTHEDOCS_EMBED['section']
        );
    }
    catch (error) {
        if (error instanceof ReferenceError) {
            throw new ReferenceError('Global object missing required keys');
        }
        throw new Error('Problem with global object READTHEDOCS_EMBED');
    }
}

// Create modal with generated documentation
Embed.prototype.show_modal = function () {
    var modal = document.getElementById('rtd-documentation-embed');
    if (typeof modal == 'undefined') {
        modal.style.display = 'none';
    }
    else {
        var body = document.getElementsByTagName('body')[0];
        modal = document.createElement('div');
        modal.id = 'rtd-documentation-embed';
        modal.style.display = 'none';
        body.appendChild(modal);
    }
    this.fetch(function (section) {
        modal.innerHTML = section.wrapped;
        modal.style.display = 'block';
    });
};

Embed.prototype.fetch = function (callback, error_callback) {
    var self = this,
        reqwest = require('reqwest');

    // Default error handler
    if (typeof error_callback == 'undefined') {
        error_callback = function (error) {
            console.log('Embed failure: ' + error);
        }
    }

    // Emit cached response to callback if we have it
    if (typeof this.cache != 'undefined') {
        callback(this.cache)
    }
    else {
        reqwest({
            url: this.api_host + '/api/v1/embed/',
            method: 'get',
            contentType: 'application/json',
            crossDomain: true,
            headers: {'Accept': 'application/json'},
            data: {
                project: this.project,
                version: this.version,
                doc: this.doc,
                section: this.section,
            },
            success: function(resp) {
                self.cache = new Section(resp);
                callback(self.cache);
            },
            error: function(error) {
                self.cache = null;
                error_callback(error);
            }
        })
    }
};

exports.Embed = Embed;
