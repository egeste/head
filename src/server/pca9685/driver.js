import I2cBus from 'i2c-bus'
import { Pca9685Driver } from 'pca9685'

const options = {
  i2c: I2cBus.openSync(1),
  debug: true
}

export default new Promise((resolve, reject) => {
  const pca9685 = new Pca9685Driver(options, error => {
    if (error) {
      console.error('Error initializing Pca9685Driver')
      return process.exit(1)
    }

    console.log('Initialized Pca9685Driver')
    return resolve(pca9685)
  })
})

/** Examples from the docs

// Set channel 0 to turn on on step 42 and off on step 255
pca9685.setPulseRange(0, 42, 255, () => {
  if (err) { console.error('Error setting pulse range.') }
  else { console.log('Pulse range set.') }
})

// Set the pulse length to 1500 microseconds for channel 2
pca9685.setPulseLength(2, 1500)

// Set the duty cycle to 25% for channel 8
pca9685.setDutyCycle(8, 0.25)

// Turn off all power to channel 6
// (with optional callback)
pca9685.channelOff(6, () => {
  if (err) { console.error('Error turning off channel.') }
  else { console.log('Channel 6 is off.') }
})

// Turn on channel 3 (100% power)
pca9685.channelOn(3)

*/
