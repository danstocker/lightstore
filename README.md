LightStore
==========

File-based key-value store. LightStore uses a quasi-JSON file as persistent storage for append-only, read-once use.

Rjson
-----

The redundant JSON format is the most basic file format that LightStore supports. It associates keys and values, keys being arbitrary strings, possibly repeated over the file. The format omits the closing curly brace or bracket, making it easily appendable.

Upon parsing, the closing brace or bracket is restored, and redundant key-value pairs will be reduced to the last key occurrence. For example, `{"foo":"bar","hello":"world","foo":"BAR"` will be parsed as `{foo:"BAR", "hello":"world"}`.

KeyValueStore
-------------

For storing more complex data formats, LightStore introduces a key-value store with a fixed key format. In a LightStore key-value store, Keys represent tree paths, in particular, serialized versions of `sntls.Path`. Changes made to the tree are simply appended to the file that builds on the previously introduced Rjson format. Upon parsing, the tree is re-constructed by applying the recorded changes in identical order.

    lightStore.KeyValueStore.create('store.ls')
        .write('foo>bar'.toPath(), {my: "value"});

PersistedTree
-------------

For logical data manipulation, LightStore extends the versatile tree data structure from [Sntls](https://github.com/danstocker/sntls) ([`sntls.Tree`](http://danstocker.github.io/sntls/sntls.Tree.html)). Persisted trees behave the exact same way as ordinary *Sntls* trees in terms of querying and modification, the only difference being that changes by `.setNode()` will be appended to the specified file.

###Example

The following sample code loads a LS file, then (assuming loading has finished) queries employee keys grouped by first names and saves the results to 'firstNames.ls'.

    var tree = lightstore.PersistedTree.create('employees.ls')
        .load();
    // ...
    tree.queryPathValuePairsAsHash('|>firstName'.toQuery())
        .toStringDictionary()
        .reverse()
        .toPersistedTree('firstNames.ls')
        .save();
