(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* Read the Docs Embed functions */


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
        modal = $('<div id="rtd-documentation-embed />');
        modal.hide();
        $('body').append(modal);
    }

    this.fetch(function (data) {
        modal.html(data['wrapper']);
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
                self.cache = data;
                callback(data);
            },
            error: function(data, textStatus, error) {
                self.cache = null;
                error_callback(data);
            }
        });
    }
};

exports.Embed = Embed;

},{}],2:[function(require,module,exports){
/* Read the Docs Client */

var embed = require('./embed');

exports.Embed = embed.Embed;

if (typeof window != 'undefined') {
    window.Embed = embed.Embed;
}

},{"./embed":1}]},{},[2])