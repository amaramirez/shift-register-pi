const gpio = require('onoff').Gpio;
const {LE,BE,sendShift} = require('./utils');

// Define stop process 'ctrl+c', EOP
process.on('SIGINT', function() {
	console.log("SIGINT detected, cleaning up...");

	// Clear the register
	lPin.writeSync(0);
	sendShift(dPin,cPin,BE,0x00);
	lPin.writeSync(1);

	// Disable the register
	ePin.writeSync(1);

	// Clear the resources
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
let dir = [LE,BE];

const mainLoop = () => {
	i%=7;
	if (i === 0) dir = [dir[1], dir[0]];
	lPin.writeSync(0);
	sendShift(dPin,cPin,dir[0],0x01 << i);
	lPin.writeSync(1);
	i++;
}

ePin.writeSync(0);
setInterval(mainLoop, 60);
