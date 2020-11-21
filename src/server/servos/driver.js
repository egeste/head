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
