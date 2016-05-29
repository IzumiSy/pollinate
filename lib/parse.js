/*  __  __    _    _  _______    ____ _   _    _    _   _  ____ _____ ____  _
   |  \/  |  / \  | |/ / ____|  / ___| | | |  / \  | \ | |/ ___| ____/ ___|| |
   | |\/| | / _ \ | ' /|  _|   | |   | |_| | / _ \ |  \| | |  _|  _| \___ \| |
   | |  | |/ ___ \| . \| |___  | |___|  _  |/ ___ \| |\  | |_| | |___ ___) |_|
   |_|  |_/_/   \_\_|\_\_____|  \____|_| |_/_/   \_\_| \_|\____|_____|____/(_)

   There is a 100% chance that this project can use improvements.
   Pull requests are ALWAYS welcome, even if just amounts to a conversation.  */

var fs = require('fs')
var path = require('path')
var fileExists = require('file-exists')
var dir = require('node-dir')
var nunjucks = require('nunjucks')

module.exports = function (state, callback, error) {

    var env = nunjucks.configure(state.template.tmp, { autoescape: false })

    var filters = state.data.filters

    if(typeof filters != 'undefined') {
        for(var i = 0; i < Object.keys(filters).length; i++) {
            var filterName = Object.keys(filters)[i]
            var filter = path.join(state.template.tmp, filters[filterName])
            env.addFilter(filterName, require(filter))
        }
    }

    var parse = state.data.parse

    // First parse the data for any template tags
    state.data = JSON.parse(nunjucks.renderString(JSON.stringify(state.data), state.data))

    // If parse is "*" then parse all files
    if(parse == '*') {
        dir.readFiles(state.template.tmp,
            function(err, content, fileToParse, next) {
                if(err) {
                    error(err)
                }
                var renderedContent = nunjucks.renderString(content, state.data)
                fs.writeFileSync(fileToParse, renderedContent)
                next()
            },
            function(err, files){
                if(err) {
                    error(err)
                }
                callback(state)
            }
        )

        return
    }

    // Loop through any files specified for parsing
    for(i = 0; i < parse.length; i++) {
        var fileToParse = state.template.tmp + '/' + parse[i]
        var renderedContent = nunjucks.render(parse[i], state.data)
        fs.writeFileSync(fileToParse, renderedContent)
    }

    callback(state)
}
