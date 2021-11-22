const gpio = require('onoff').Gpio;
const dPin = new gpio(22, 'out');
const lPin = new gpio(27, 'out');
const cPin = new gpio(17, 'out');

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const sendShift = async (data, clock, latch, order, value) => {
  for (let i = 0; i < 8; i++) {
    clock.writeSync(0);

    if (order === "be") {
      data.writeSync(((value << i) & 0x80) >> 7);
    } else if (order === "le") {
      data.writeSync((value >> i) & 0x01);
    }

		await sleep(1000);

    clock.writeSync(1);

		await sleep(1000);
  }
  latch.writeSync(1);
  clock.writeSync(0);
  data.writeSync(0);
}

const main = async () => {
	console.log("Big Endian... ");
//console.log("Little Endian... ");
	await sendShift(dPin,cPin, lPin, 'le',0x35);

//while(true){}
	dPin.unexport();
	lPin.unexport();
	cPin.unexport();
}

main();
