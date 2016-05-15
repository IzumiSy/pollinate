/*  __  __    _    _  _______    ____ _   _    _    _   _  ____ _____ ____  _
   |  \/  |  / \  | |/ / ____|  / ___| | | |  / \  | \ | |/ ___| ____/ ___|| |
   | |\/| | / _ \ | ' /|  _|   | |   | |_| | / _ \ |  \| | |  _|  _| \___ \| |
   | |  | |/ ___ \| . \| |___  | |___|  _  |/ ___ \| |\  | |_| | |___ ___) |_|
   |_|  |_/_/   \_\_|\_\_____|  \____|_| |_/_/   \_\_| \_|\____|_____|____/(_)

   There is a 100% chance that this project can use improvements.
   Pull requests are ALWAYS welcome, even if just amounts to a conversation.  */

function runPollinate(input, callback) {
    var error = function(result) {
        callback('', result)
    }
    require('./fetch.js')(input, function(state) {
        require('./extend.js')(state, function(state) {
            require('./discard.js')(state, function(state) {
                require('./parse.js')(state, function(state) {
                    require('./move.js')(state, function(state) {
                        require('./complete.js')(state, function(result) {
                            callback(result)
                        }, error)
                    }, error)
                }, error)
            }, error)
        }, error)
    }, error)
}

module.exports = runPollinate
