Read the Docs Client
====================

Usage
-----

Embedding Content
~~~~~~~~~~~~~~~~~

To embed content from existing documentation on Read the Docs, use this library
with a call similar to this::

    <script src="readthedocs-client.js"></script>
    <script>
        var embed = new Embed(),
            wrapper = document.getElementById('wrapper');

        embed.section(
            'requests', 'latest', 'index', 'Testimonials',
            function (section) {
                section.insertContent(wrapper);
            }
        ),
    </script>

Development
-----------

Installing development dependencies::

    npm install

This will install needed libraries/applications for development. This library
uses `Gulp`_ and `Browserify`_ to form releases. Releases will be packaged up
for use with `Bower`_. Files in @lib/@ are the source files. On @gulp build@,
these files are passed through `Browserify`_ to create bundles in @dist/@. The
bundles in @dist/@ are now usable in browsers and will be the files `Bower`_
installs for client use.

To watch files and continually build on changes::

    gulp dev

To run the test suite in @tests/@ via `Nodeunit`_::

    gulp test

.. _`Gulp`: http://gulpjs.com
.. _`Browserify`: http://browserify.org
.. _`Bower`: http://bower.io
.. _`Nodeunit`: https://github.com/caolan/nodeunit
