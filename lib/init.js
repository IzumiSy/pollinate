/*  __  __    _    _  _______    ____ _   _    _    _   _  ____ _____ ____  _
   |  \/  |  / \  | |/ / ____|  / ___| | | |  / \  | \ | |/ ___| ____/ ___|| |
   | |\/| | / _ \ | ' /|  _|   | |   | |_| | / _ \ |  \| | |  _|  _| \___ \| |
   | |  | |/ ___ \| . \| |___  | |___|  _  |/ ___ \| |\  | |_| | |___ ___) |_|
   |_|  |_/_/   \_\_|\_\_____|  \____|_| |_/_/   \_\_| \_|\____|_____|____/(_)

   There is a 100% chance that this project can use improvements.
   Pull requests are ALWAYS welcome, even if just amounts to a conversation.  */

var isURL = require('valid-url').isUri
var isFile = require('file-exists')
var isDirectory = require('is-directory').sync
var isGitURL = require('is-git-url')
var isGitHub = function(input){return input.match(/^(?!\.)[A-Za-z0-9\-_]+\/[A-Za-z0-9\-_]+$/g)}
var isJSON = function(input){return input.match(/^("(\\.|[^"\\\n\r])*?"|[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t])+?$/g)}
var isGit = function(input){return isGitURL(input) || isURL(input)}

var getTemplateSource = function(input) {
    if(isDirectory(input)) {
        return 'directory'
    } else if(isGitHub(input)) {
        return 'github'
    } else if(isGit(input)) {
        return 'git'
    } else {
        return false
    }
}

var getProjectSource = function(input) {
    if(isFile(input)) {
        return 'file'
    } else if(isURL(input)) {
        return 'url'
    } else if(isJSON(input)) {
        return 'json'
    } else {
        return false
    }
}

module.exports = function (state, callback, error) {
    
    // Always expect to have a template object
    state.template = {}
    state.template.input = state.inputs[0]

    state.template.source = getTemplateSource(state.template.input)

    if(!state.template.source) {
        error({ 'message':'Unable to match "'+state.template.input+'" with an action.' })
    }

    // Set project object if second input source is present 
    if(typeof state.inputs[1] != 'undefined') {
        state.project = {}
        state.project.input = state.inputs[1]

        state.project.source = getProjectSource(state.project.input)

        if(!state.project.source) {
            error({ 'message':'Unable to match "'+state.project.input+'" with an action.' })
        }
    }

    callback(state)
}
