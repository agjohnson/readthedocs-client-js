// Document response

var Section = function (data) {
    if (typeof data == 'undefined') {
        return;
    }

    this.content = data.content;
    this.wrapped = data.wrapped;
    this.project = data.meta.project;
    this.version = data.meta.version;
    this.doc = data.meta.doc;
    this.section = data.meta.section;
}

Section.prototype.appendTo = function (elem, unwrapped) {
    var content = $('<div />');
    if (unwrapped) {
        content.html(this.content);
    }
    else {
        content.html(this.wrapped);
    }
    elem.append(content);
};

exports.Section = Section;
