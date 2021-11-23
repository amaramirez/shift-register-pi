const gpio = require('onoff').Gpio;
const {LE,BE,sleep,sendShift} = require('./utils');

// Define stop process 'ctrl+c', EOP
process.on('SIGINT', function() {
	console.log("SIGINT detected, cleaning up...");
	ePin.writeSync(0);
	dPin.unexport();
	lPin.unexport();
	cPin.unexport();
	ePin.unexport();
	console.log("Done.");
	process.exit();
});

// Before main loop, setup
const dPin = new gpio(22, 'out');
const lPin = new gpio(27, 'out');
const cPin = new gpio(17, 'out');
const ePin = new gpio(4, 'out');

let i = 0;

const mainLoop = () => {
	i++;
	i%=8;
	lPin.writeSync(0);
	sendShift(dPin,cPin,BE,0x01 << i);
	lPin.writeSync(1);
}

setInterval(mainLoop, 500);












const main = async () => {
	let i = 0;
	let k = 0;

	let pattern1 = [0xC3, 0x3C];

	// Main loop
	while(true){
		for (i = 0; i < 7; i++) {
			lPin.writeSync(0);
			sendShift(dPin, cPin, BE, 0x01 << i);
			lPin.writeSync(1);
			await sleep(60);
		}

		for (i = 0; i < 7; i++) {
			lPin.writeSync(0);
			sendShift(dPin, cPin, LE, 0x01 << i);
			lPin.writeSync(1);
			await sleep(60);
		}
	}

}

main();
