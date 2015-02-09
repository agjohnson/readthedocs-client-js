/* Read the Docs Embed functions */


var Embed = function (project, version, file, section, config) {
    this.project = project;
    this.version = version;
    this.file = file;
    this.section = section;

    this.api_host = 'https://api.grokthedocs.org';
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
    return new Embed(project, version, file, section);
    */
}

Embed.from_global = function () {
    try {
        return new Embed(
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

Embed.prototype.bind = function () {
  $('.readthedocs-help-embed').on('click', function () {
    if (typeof READTHEDOCS_EMBED == 'undefined') {
      console.log('Error, no READTHEDOCS_EMBED variable.')
      return null
    }

    if (typeof readthedocs_embed_active == 'undefined') {
      into(
        READTHEDOCS_EMBED['project'], 
        READTHEDOCS_EMBED['version'], 
        READTHEDOCS_EMBED['doc'], 
        READTHEDOCS_EMBED['section'], 
        function (data) {
          $(".help-embed").html(data['wrapped'])
          $('.help-embed').toggle()
        }
      )
      readthedocs_embed_active = true
      console.log('[Read the Docs] Showing Initial Embed')
    }
    else if (readthedocs_embed_active) {
        $('.help-embed').toggle()
        readthedocs_embed_active = false;
        console.log('[Read the Docs] Hiding Embed')
    }  else {
        $('.help-embed').toggle()
        readthedocs_embed_active = true;
        console.log('[Read the Docs] Showing Embed')
    }

  })
};

Embed.prototype.into = function (callback) {

      if (typeof cache != 'undefined') {
        callback(cache)
      } else {
        $.ajax({
          type: 'GET',
          url: page.grok_host + '/api/v1/embed/',
          crossDomain: true,
          data: {
            project: this.project,
            version: this.version,
            doc: this.doc,
            section: this.section,
          },
          success: function(data, textStatus, request) {
              callback(data)
              cache = data
          },
        });
      }
};

exports.Embed = Embed;
