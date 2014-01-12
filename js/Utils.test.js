/*global lightstore */
/*global module, test, expect, ok, equal, notEqual, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("Utils");

    test("Decimal to Base 64", function () {
        equal('0'.toBase64FromDecimal(), 'A', "Zero");
        equal('1'.toBase64FromDecimal(), 'B', "One");
        equal('000000001'.toBase64FromDecimal(), 'B', "One, padded to full segment");
        equal('100000001'.toBase64FromDecimal(), 'F9eEB', "Full segment value");
        equal('1000000001'.toBase64FromDecimal(), 'BAAAAB', "Incomplete last segment");
        equal('46578463259746382564325432'.toBase64FromDecimal(), 'CxrsfPe2pOhouw4', "Arbitrary long number");
    });

    test("Base 64 to Decimal", function () {
        equal('A'.toDecimalFromBase64(), '0', "Zero");
        equal('B'.toDecimalFromBase64(), '1', "One");
        equal('AAAAB'.toDecimalFromBase64(), '1', "One, padded to full segment");
        equal('F9eEB'.toDecimalFromBase64(), '100000001', "Full segment value");
        equal('BAAAAB'.toDecimalFromBase64(), '1000000001', "Incomplete last segment");
        equal('CxrsfPe2pOhouw4'.toDecimalFromBase64(), '46578463259746382564325432', "Arbitrary long number");
    });

    test("Left padding", function () {
        equal(lightstore.Utils.leftPad("hello", 4), "hello", "Already has requested length");
        equal(lightstore.Utils.leftPad("hello", 10), "     hello", "Padded w/ default char");
        equal(lightstore.Utils.leftPad("123", 10, '0'), "0000000123", "Padded w/ specified char");
    });

    test("UID", function () {
        var uid1 = lightstore.Utils.generateUid(),
            uid2 = lightstore.Utils.generateUid(),
            uid3 = lightstore.Utils.generateUid(),
            uid4 = lightstore.Utils.generateUid();

        notEqual(uid1, uid2);
        notEqual(uid2, uid3);
        notEqual(uid3, uid4);
    });
}());
