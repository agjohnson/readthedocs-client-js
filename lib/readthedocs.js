/* Read the Docs Client */

var embed = require('./embed');

exports.Embed = embed.Embed;

if (typeof window != 'undefined') {
    window.Embed = embed.Embed;
}
