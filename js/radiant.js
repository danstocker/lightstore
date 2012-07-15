/**
 * Command line tool for accessing RJSON databases.
 */
var troop = require('troop-0.1.3').troop,
    rjson = require('./rjson').rjson,
    stdout = process.stdout,
    argv = process.argv,
    fileName = argv[2],
    dataStore = rjson.create(fileName),
    command = argv[3],
    data = argv[4];

//////////////////////////////
// Utils

/**
 * Outputs an error message to stdio.
 * @static
 * @param err {Error|string}
 */
function error(err) {
    if (typeof err === 'string') {
        err = new Error(err);
    }
    stdout.write(err.toString() + "\n");
}

/**
 * Outputs a message to stdio.
 * @static
 * @param message {string}
 */
function ok(message) {
    stdout.write(message + "\n");
}

//////////////////////////////
// Parameter check

if (!fileName) {
    ok("Usage: node radiant fileName [command] [data]");
    process.exit();
}

//////////////////////////////
// Datastore access

switch (command) {
case 'compact':
    /**
     * Compacting database.
     */
    dataStore.compact(function (err) {
        if (err) {
            error(err);
        } else {
            ok("Datastore compacted.");
        }
    });
    break;

case 'write':
    /**
     * Writing data to database.
     */
    if (typeof data !== 'undefined') {
        var parsed;
        try {
            parsed = JSON.parse(data);
            dataStore.write(parsed, function () {
                ok("Data written.");
            });
        } catch (e) {
            error("Invalid JSON");
        }
    }
    break;

default:
case 'read':
    /**
     * Reading database and outputs contents.
     */
    dataStore.read(function (err, data) {
        if (err) {
            error(err);
        } else {
            ok(JSON.stringify(data, null, 2));
        }
    });
    break;
}
