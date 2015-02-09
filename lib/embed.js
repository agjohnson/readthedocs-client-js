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
Embed.from_api = function (endpoint) {
    throw new Error('Not implemented yet.');
    /* TODO make this work
    return new Embed(project, version, doc, section);
    */
}

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
    var modal = $('#rtd-documentation-embed');
    if (modal.length) {
        modal.hide();
    }
    else {
        modal = $('<div id="rtd-documentation-embed" />');
        modal.hide();
        $('body').append(modal);
    }

    this.fetch(function (section) {
        modal.html(section.wrapped);
        modal.show();
    });
};

Embed.prototype.fetch = function (callback, error_callback) {
    var self = this;

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
        window.jQuery.ajax({
            type: 'GET',
            url: this.api_host + '/api/v1/embed/',
            crossDomain: true,
            data: {
                project: this.project,
                version: this.version,
                doc: this.doc,
                section: this.section,
            },
            success: function(data, textStatus, request) {
                self.cache = new Section(data);
                callback(self.cache);
            },
            error: function(data, textStatus, error) {
                self.cache = null;
                error_callback(data);
            }
        });
    }
};

exports.Embed = Embed;
