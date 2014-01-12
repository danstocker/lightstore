/*global dessert, troop, sntls, lightstore */
troop.postpone(lightstore, 'Utils', function () {
    "use strict";

    var base = troop.Base,
        self = base.extend(),
        DIGITS_BASE64 = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S',
            'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
            'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8',
            '9', '+', '/'];

    /**
     * Static class for utility methods.
     * @class
     * @extends troop.Base
     */
    lightstore.Utils = self
        .addConstants(/** @lends lightstore.Utils */{
            /** @constant */
            DIGITS_BASE64: DIGITS_BASE64,

            /** @constant */
            POSITIONS_BASE64: DIGITS_BASE64
                .toStringDictionary()
                .reverse()
                .toCollection()
                .mapValues(function (position) {
                    return parseInt(position, 10);
                })
                .items
        })
        .addMethods(/** @lends lightstore.Utils */{
            /**
             * Left pads specified string with to the specified length with the (optionally) specified character.
             * @param {string} shortString
             * @param {number} length
             * @param {string} [padChar]
             * @returns {string}
             */
            leftPad: function (shortString, length, padChar) {
                if (shortString.length < length) {
                    return new Array(length - shortString.length + 1).join(padChar || ' ') + shortString;
                } else {
                    return shortString;
                }
            },

            /**
             * Generates a unique identifier.
             * @return {string}
             */
            generateUid: function () {
                var time = new Date().getTime().toString(),
                    salt = Math.floor(Math.random() * 10e10).toString();
                return (time + salt).toBase64FromDecimal();
            }
        });
});

troop.postpone(lightstore, 'generateUid', function () {
    "use strict";
    lightstore.generateUid = lightstore.Utils.generateUid;
});

(function () {
    "use strict";

    troop.Properties.addProperties.call(
        String.prototype,
        /** @lends String# */{
            /**
             * Converts string containing huge decimal value to base64 value.
             * Number is converted in segments of 9 decimal digits to 5 base64 digits starting
             * from least significant digit. Not equivalent to number system conversion.
             * @returns {string}
             */
            toBase64FromDecimal: function () {
                if (parseInt(this, 10) === 0) {
                    // handling special case of 0
                    return lightstore.Utils.DIGITS_BASE64[0];
                }

                var Utils = lightstore.Utils,
                    DIGITS_BASE64 = Utils.DIGITS_BASE64,
                    tmp = this,
                    segment, i,
                    result = [];

                while (tmp.length > 9) {
                    // for segments before last segment

                    // taking segment numeric value
                    segment = parseInt(tmp.substr(-9), 10);

                    // processing segment
                    for (i = 0; i < 5; i++) {
                        // adding base64 segment digit to result
                        result.unshift(DIGITS_BASE64[segment % 64]);
                        segment = Math.floor(segment / 64);
                    }

                    // removing segment from input string
                    tmp = tmp.substr(0, tmp.length - 9);
                }

                // processing last segment
                segment = parseInt(tmp.substr(-9), 10);
                while (segment > 0) {
                    // adding base64 segment digit to result
                    result.unshift(DIGITS_BASE64[segment % 64]);
                    segment = Math.floor(segment / 64);
                }

                return result.join('');
            },

            /**
             * Converts base64 string to decimal string.
             * String is converted in segments of 5 base64 digits to 9 decimal digits starting from
             * least significant digit.
             * Conversion is lossy, except when converting the output of .toBae64FromDecimal().
             * @returns {string}
             */
            toDecimalFromBase64: function () {
                var Utils = lightstore.Utils,
                    POSITIONS_BASE64 = Utils.POSITIONS_BASE64,
                    tmp = this,
                    segment, i,
                    segmentValue,
                    result = [];

                while (tmp.length > 5) {
                    // for segments before last segment

                    // taking segment base64 value
                    segment = tmp.substr(-5).split('');

                    // calculating segment numeric value
                    segmentValue = 0;
                    for (i = 0; i < 5; i++) {
                        segmentValue = segmentValue * 64 + POSITIONS_BASE64[segment.shift()];
                    }

                    // adding segment value to result
                    result.unshift(Utils.leftPad(segmentValue.toString(), 9, '0'));

                    // removing segment from input string
                    tmp = tmp.substr(0, tmp.length - 5);
                }

                // processing last segment
                segment = tmp.substr(-5, 5).split('');

                // calculating last segment numeric value
                segmentValue = 0;
                while (segment.length) {
                    segmentValue = segmentValue * 64 + POSITIONS_BASE64[segment.shift()];
                }

                // adding segment value to result
                result.unshift(segmentValue.toString());

                return result.join('');
            }
        },
        false, false, false
    );
}());