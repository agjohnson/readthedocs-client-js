// Document response

// Page
var Page = function (project, version, doc) {
    this.project = project;
    this.version = version;
    this.doc = doc;

    this.url = null;
    this.sections = [];
};

Page.prototype.section = function (section) {
    return new Section(this.project, this.version, this.doc, section);
};

// Section
var Section = function (project, version, doc, section) {
    this.project = project;
    this.version = version;
    this.doc = doc;
    this.section = section;

    this.url = null;
    this.content = null;
    this.wrapped = null;
}

// Add iframe with returned content to page
Section.prototype.insertContent = function (elem) {
    var iframe = document.createElement('iframe'),
        self = this;

    iframe.style.display = 'none';

    if (window.jQuery && elem instanceof window.jQuery) {
        elem = elem.get(0);
    }

    if (typeof(elem) != 'undefined') {
        while (elem.children.length > 0) {
            elem.firstChild.remove();
        }
        elem.appendChild(iframe);
    }

    var win = iframe.contentWindow;

    win.document.open();
    win.document.write(this.content);
    win.document.close();

    var head = win.document.head,
        body = win.document.body,
        base = null;

    if (head) {
        base = win.document.createElement('base');
        base.target = '_parent';
        base.href = this.url;
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

    return iframe;
};


exports.Section = Section;
exports.Page = Page;
