import { DESCRIPTORS, GLOBAL, LITTLE_ENDIAN, MAX_SAFE_INTEGER, MIN_SAFE_INTEGER, NATIVE } from '../helpers/constants.js';

if (DESCRIPTORS) QUnit.test('Int8 conversions', assert => {
  const int8array = new Int8Array(1);
  const uint8array = new Uint8Array(int8array.buffer);
  const dataview = new DataView(int8array.buffer);

  function viewFrom(it) {
    return new DataView(new Uint8Array(it).buffer);
  }
  function toString(it) {
    return it === 0 && 1 / it === -Infinity ? '-0' : it;
  }

  const data = [
    [0, 0, [0]],
    [-0, 0, [0]],
    [1, 1, [1]],
    [-1, -1, [255]],
    [1.1, 1, [1]],
    [-1.1, -1, [255]],
    [1.9, 1, [1]],
    [-1.9, -1, [255]],
    [127, 127, [127]],
    [-127, -127, [129]],
    [128, -128, [128]],
    [-128, -128, [128]],
    [255, -1, [255]],
    [-255, 1, [1]],
    [255.1, -1, [255]],
    [255.9, -1, [255]],
    [256, 0, [0]],
    [32767, -1, [255]],
    [-32767, 1, [1]],
    [32768, 0, [0]],
    [-32768, 0, [0]],
    [65535, -1, [255]],
    [65536, 0, [0]],
    [65537, 1, [1]],
    [65536.54321, 0, [0]],
    [-65536.54321, 0, [0]],
    [2147483647, -1, [255]],
    [-2147483647, 1, [1]],
    [2147483648, 0, [0]],
    [-2147483648, 0, [0]],
    [4294967296, 0, [0]],
    [MAX_SAFE_INTEGER + 1, 0, [0]],
    [MIN_SAFE_INTEGER - 1, 0, [0]],
    [Infinity, 0, [0]],
    [-Infinity, 0, [0]],
    [-Number.MAX_VALUE, 0, [0]],
    [Number.MAX_VALUE, 0, [0]],
    [Number.MIN_VALUE, 0, [0]],
    [-Number.MIN_VALUE, 0, [0]],
    [NaN, 0, [0]],
  ];
  // Android 4.3- bug
  if (NATIVE || !/Android [2-4]/.test(GLOBAL.navigator && navigator.userAgent)) {
    data.push(
      [2147483649, 1, [1]],
      [-2147483649, -1, [255]],
      [4294967295, -1, [255]],
      [4294967297, 1, [1]],
      [MAX_SAFE_INTEGER, -1, [255]],
      [MIN_SAFE_INTEGER, 1, [1]],
      [MAX_SAFE_INTEGER + 3, 2, [2]],
      [MIN_SAFE_INTEGER - 3, -2, [254]],
    );
  }
  for (const [value, conversion, little] of data) {
    const big = little.slice().reverse();
    const representation = LITTLE_ENDIAN ? little : big;
    int8array[0] = value;
    assert.same(int8array[0], conversion, `Int8Array ${ toString(value) } -> ${ toString(conversion) }`);
    assert.arrayEqual(uint8array, representation, `Int8Array ${ toString(value) } -> [${ representation }]`);
    dataview.setInt8(0, value);
    assert.arrayEqual(uint8array, big, `dataview.setInt8(0, ${ toString(value) }) -> [${ big }]`);
    assert.same(viewFrom(big).getInt8(0), conversion, `dataview{${ big }}.getInt8(0) -> ${ toString(conversion) }`);
  }
});
