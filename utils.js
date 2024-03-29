// Enumerators
const BE = 1;
const LE = 0;

// Deprecated
//const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// Function to interface with 74HC595 shift register
const sendShift = (data, clock, order, value) => {
	// Send 8 bits recursively
  for (let i = 0; i < 8; i++) {
    clock.writeSync(0);

    if (order === BE) {
      data.writeSync(((value << i) & 0x80) >> 7);
    } else if (order === LE) {
      data.writeSync((value >> i) & 0x01);
    }

    clock.writeSync(1);
  }

  clock.writeSync(0);
  data.writeSync(0);
}

module.exports = {
  BE, LE,
  sendShift
}
