export default new Promise((resolve, reject) => {
  try {
    const i2c = require('i2c-bus')
    const { Pca9685Driver } = require('pca9685')

    const pca9685 = new Pca9685Driver({
      i2c: i2c.openSync(1),
      debug: true
    }, error => {
      if (error) {
        console.error('Error initializing pca9685 driver')
        return process.exit(1)
      }

      console.log('Initialized pca9685 driver')
      return resolve(pca9685)
    })
  } catch (e) {
    console.error(e)
    return resolve({
      channelOn: ((channel, cb) => {
        cb(console.info('channelOn', channel))
      }),

      channelOff: ((channel, cb) => {
        cb(console.info('channelOff', channel))
      }),

      setDutyCycle: ((channel, percentage, onStep, cb) => {
        cb(console.info('setDutyCycle', channel, percentage, onStep))
      }),

      setPulseRange: ((channel, from, to, cb) => {
        cb(console.info('setPulseRange', channel, from, to))
      }),

      setPulseLength: ((channel, pulse, onStep, cb) => {
        console.info('setPulseLength', channel, pulse, onStep)
      })
    })
  }
})
