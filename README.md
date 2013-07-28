LightStore
==========

File-based key-value store. LightStore uses a quasi-JSON file as persistent storage for append-only, read-once use.

Rjson
-----

The redundant JSON format is the most basic file format that LightStore supports. It associates keys and values, keys being arbitrary strings, possibly repeated over the file. The format omits the enclosing curly braces, and leaves a comma at the end of the file, making it easily appendable.

Upon parsing, the enclosing curly braces are restored, and redundant key-value pairs will be reduced to the last key occurrence. For example, `"foo":"bar","hello":"world","foo":"BAR",` will be parsed as `{foo:"BAR", "hello":"world"}`.

KeyValueStore
-------------

For storing more complex data formats, LightStore introduces a key-value store with a fixed key format. In a LightStore key-value store, Keys represent tree paths, in particular, serialized versions of `sntls.Path`. Changes made to the tree are simply appended to the file that builds on the previously introduced Rjson format. Upon parsing, the tree is re-constructed by applying the these changes in the same order as they were issued.

    lightStore.KeyValueStore.create('store.ls')
        .write('foo>bar'.toPath(), {my: "value"});
