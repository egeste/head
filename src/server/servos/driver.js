import I2cBus from 'i2c-bus'
import { Pca9685Driver } from 'pca9685'

const options = {
  i2c: I2cBus.openSync(1),
  debug: true
}

export default new Promise((resolve, reject) => {
  try {
    const pca9685 = new Pca9685Driver(options, error => {
      if (error) {
        console.error('Error initializing pca9685 driver')
        return process.exit(1)
      }

      console.log('Initialized pca9685 driver')
      return resolve(pca9685)
    })
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
})
