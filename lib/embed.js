/* Read the Docs Embed functions */

var Section = require('./doc').Section;


var Embed = function (project, version, doc, section, config) {
    // Build state
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
Embed.fromGlobal = function () {
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

// Add iframe with returned content to page
Embed.prototype.insertContent = function (elem) {
    var iframe = document.createElement('iframe'),
        self = this;

    iframe.style.display = 'none';

    if (typeof(elem) != 'undefined') {
        while (elem.children.length > 0) {
            elem.firstChild.remove();
        }
        elem.appendChild(iframe);
    }

    self.fetch(function (section) {
        var win = iframe.contentWindow;

        win.document.open();
        win.document.write(section.content);
        win.document.close();

        var head = win.document.head,
            body = win.document.body,
            base = null;

        if (head) {
            base = win.document.createElement('base');
            base.target = '_parent';
            base.href = section.url;
            head.appendChild(base);

            // Copy linked stylesheets from parent
            var link_elems = document.head.getElementsByTagName('link');
            for (var n = 0; n < link_elems.length; n++) {
                var link = link_elems[n];
                if (link.rel == 'stylesheet') {
                    head.appendChild(link.cloneNode());
                }
            }
        }

        win.onload = function () {
            iframe.style.display = 'inline-block';
        };
    });

    return iframe;
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

Embed.prototype.link_stylesheet = function () {
    var css_link = document.createElement('link');
    css_link.rel = 'stylesheet';
    css_link.href = 'https://media.readthedocs.org/css/sphinx_rtd_theme.css';
    document.getElementsByTagName('head')[0].appendChild(css_link);
}

exports.Embed = Embed;
