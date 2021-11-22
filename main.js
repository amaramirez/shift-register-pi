const gpio = require('onoff').Gpio;
const dPin = 22;
const lPin = 27;
const cPin = 17;

const sendShift = (data, clock, order, value) => {
  for (let i = 0; i < 8; i++) {
    if (order === "be") {
      console.log(((value << i) & 0x80) >> 7);
    } else if (order === "le") {
      console.log((value >> i) & 0x01);
    }
  }
}

console.log("Big Endian: ");
sendShift(0,0,'be',0x33);
console.log("Little Endian: ");
sendShift(0,0,'le',0x33);
