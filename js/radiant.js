/**
 * Radiant - Simple RJSON Datastore.
 */
var rjson = require('./rjson').rjson,
    argv = process.argv,
    stdout = process.stdout,
    fileName = argv[2],
    command = argv[3],
    data = argv[4],
    dataStore;

/**
 * Outputs an error message to stdio.
 * @param err {Error|string}
 */
function error(err) {
    if (typeof err === 'string') {
        err = new Error(err);
    }
    stdout.write(err.toString() + "\n");
}

/**
 * Ouputs a message to stdio.
 * @param message {string}
 */
function ok(message) {
    stdout.write(message + "\n");
}

if (!fileName) {
    ok("Usage: node radiant fileName [command] [data]");
} else {
    dataStore = rjson.create(fileName);

    switch (command) {
    case 'compact':
        dataStore.compact(function (err) {
            if (err) {
                error(err);
            } else {
                ok("Datastore compacted.");
            }
        });
        break;

    case 'write':
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
        dataStore.read(function (err, data) {
            if (err) {
                error(err);
            } else {
                ok(JSON.stringify(data, null, 2));
            }
        });
        break;
    }
}
