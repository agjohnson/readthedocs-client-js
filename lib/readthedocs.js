/* Read the Docs Client */


function RTDClient (project, version, file, section) {
    this.project = project;
    this.version = version;
    this.file = file;
    this.section = section;
}

RTDClient.from_api = function (endpoint) {
    throw new Error('Not implemented yet.');
    /* TODO make this work
    return new RTDClient(project, version, file, section);
    */
}

RTDClient.from_global = function () {
    try {
        return new RTDClient(
            window.READTHEDOCS_EMBED['project'],
            window.READTHEDOCS_EMBED['version'],
            window.READTHEDOCS_EMBED['file'],
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

RTDClient.prototype.embed = function () {
}

exports.RTDClient = RTDClient;
