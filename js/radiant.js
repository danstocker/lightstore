var app = require('./app').app,
    argv = process.argv,
    fileName = argv[2],
    command = argv[3],
    data = argv[4],
    radiant;

radiant = app.create(fileName);

switch (command) {
case 'compact':
    radiant.compact();
    break;

case 'write':
    radiant.write(data);
    break;

default:
case 'read':
    radiant.read();
    break;
}
