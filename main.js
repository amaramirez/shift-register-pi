const gpio = require('onoff').Gpio;

const BE = 1;
const LE = 0;

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const sendShift = (data, clock, latch, order, value) => {
	latch.writeSync(0);

  for (let i = 0; i < 8; i++) {
    clock.writeSync(0);

    if (order === BE) {
      data.writeSync(((value << i) & 0x80) >> 7);
    } else if (order === LE) {
      data.writeSync((value >> i) & 0x01);
    }
    clock.writeSync(1);
  }

  latch.writeSync(1);
  clock.writeSync(0);
  data.writeSync(0);
}

const main = async () => {
	let i = 0;
	let k = 0;

	let pattern1 = [0xC3, 0x3C];

	// Before main loop, setup
	const dPin = new gpio(22, 'out');
	const lPin = new gpio(27, 'out');
	const cPin = new gpio(17, 'out');

	// Define stop process, EOP
	process.on('SIGINT', function() {
		console.log("SIGINT detected, cleaning up...");
		dPin.unexport();
		lPin.unexport();
		cPin.unexport();
		console.log("Done.");
		process.exit();
	});

	// Main loop
	while(true){

		console.log("Big Endian...");
		for (i = 0; i < 10; i++) {
			sendShift(dPin, cPin, lPin, BE, pattern1[0]);
	    await sleep(500);
			pattern1 = [pattern1[1], pattern1[0]];
		}

		for (i = 0; i < 10; i++) {
			for (k = 0; k < 8; k++) {
				sendShift(dPin, cPin, lPin, BE, 0x01 << k);
	  	  await sleep(60);
			}
		}

		for (i = 0; i < 10; i++) {
			sendShift(dPin, cPin, lPin, BE, 0xAA >> i % 2);
  	  await sleep(500);
		}

		console.log("Little Endian");
		for (i = 0; i < 10; i++) {
			sendShift(dPin, cPin, lPin, LE, 0xAA >> i % 2);
  	  await sleep(500);
		}

		for (i = 0; i < 10; i++) {
			for (k = 0; k < 8; k++) {
				sendShift(dPin, cPin, lPin, LE, 0x01 << k);
	  	  await sleep(60);
			}
		}

		for (i = 0; i < 10; i++) {
			sendShift(dPin, cPin, lPin, LE, pattern1[0]);
	    await sleep(500);
			pattern1 = [pattern1[1], pattern1[0]];
		}
	}

}

main();
