Radiant
=======

RJSON (redundant JSON) JavaScript persistence for Node (0.8).

Usage
-----

`node radiant fileName [command] [data]`

- `command`:
    - `read`: Reads database contents and outputs to stdout as compacted JSON.
    - `write`: Writes data to database see parameter `data`.
    - `compact`: Compacts database file by reading, parsing, and writing contents back in.
- `data`: Valid JSON string of a single object.

API
---

`Rjson`: [Troop](https://github.com/production-minds/troop)-based class for handling RJSON.

- `.create(fileName)`: Creates a new RJSON instance for the file `fileName`.
- `.read(handler)`: Reads file, then passes error object and contents to `handler`.
- `.write(data, handler)`: Writes `data` and calls `handler`.
- `.compact()`: Compacts database. Removes overwritten keys from file.

Example
-------

```javascript
    var db = require('Rjson').Rjson.create('test.rjson');
    db.write({hello: "world", foo: "bar"});
    db.read(function (err, data) {
        console.log(data);
    });
```
