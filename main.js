const gpio = require('onoff').Gpio;
const dPin = new gpio(22, 'out');
const lPin = new gpio(27, 'out');
const cPin = new gpio(17, 'out');

const sendShift = (data, clock, order, value) => {
  for (let i = 0; i < 8; i++) {
    clock.writeSync(0);

    if (order === "be") {
      data.writeSync(((value << i) & 0x80) >> 7);
    } else if (order === "le") {
      data.writeSync((value >> i) & 0x01);
    }

    clock.writeSync(1);
  }
}

lPin.writeSync(0);
console.log("Big Endian... ");
sendShift(0,0,'be',0x33);
// console.log("Little Endian... ");
// sendShift(0,0,'le',0x33);
lPin.writeSync(1);

dPin.unexport();
lPin.unexport();
cPin.unexport();
