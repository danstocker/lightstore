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

if (fileName) {
    dataStore = rjson.create(fileName);

    switch (command) {
    case 'compact':
        dataStore.compact(function () {
            stdout.write("Datastore compacted.\n");
        });
        break;
    case 'write':
        if (typeof data !== 'undefined') {
            dataStore.write(JSON.parse(data), function () {
                stdout.write("Data written.\n");
            });
        }
        break;
    default:
    case 'read':
        dataStore.read(function (err, data) {
            if (err) {
                console.log(err);
            } else {
                stdout.write(JSON.stringify(data, null, 2) + "\n");
            }
        });
        break;
    }
} else {
    stdout.write("Usage: node radiant fileName [command] [data]\n");
}
