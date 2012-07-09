var troop = require('troop-0.1.3').troop,
    prime = require('prime-latest').prime,
    node = prime.node,
    app = require('./app').app,
    argv = process.argv,
    ae, i;

ae = app.create('ae.rjson');

prime.Node.handler = function (data) {
    ae.write(JSON.stringify(data));
};

if (argv.length < 3) {
    // reading and printing datastore contents
    ae.read();
} else {
    ae.dataStore.read(function (err, data) {
        if (!err) {
            prime.Graph.fromJSON(data);
        }

        argv = argv.slice(2);
        for (i = 0; i < argv.length; i++) {
            argv[i] = node(argv[i]);
        }

        if (argv.length === 1) {
            // querying graph
            ae.ok(argv[0].hop().load);
        } else {
            // connecting / strengthening connection(s)
            prime.Node.to.apply(argv.shift(), argv);
        }
    });
}
