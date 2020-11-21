import debounce from 'lodash/debounce'

import EventEmitter from 'events'
import { scaleLinear } from 'd3-scale'

export const MIN_POSITION = 0
export const MAX_POSITION = 1
export const sanitizePosition = (input = 0.5) => {
  return Math.max(Math.min(input, MAX_POSITION), MIN_POSITION)
}

const driverPromise = (() => {
  try { return require('./driver').default }
  catch (e) {
    console.warn('Could not load o2c driver. Using mocked driver.')
    return Promise.resolve({
      setDutyCycle: (() => {}),
      setPulseLength: ((a, b, c, cb) => cb())
    })
  }
})()

export default class Servo extends EventEmitter {

  constructor({
    channel,
    position=0.5,
    frequency=50,
    dutyCycle=0.25,
    pulseRange=[600, 2400]
  }) {
    super()

    this.blocked = true
    this.channel = channel
    this.position = position

    this.positionToPulse = scaleLinear()
      .domain([ MIN_POSITION, MAX_POSITION ])
      .range(pulseRange)

    driverPromise.then(driver => {
      driver.setDutyCycle(channel, dutyCycle)
      this.blocked = false
    })
  }

  getPosition = () => {
    return this.position
  }

  setPosition = input => {
    this.position = sanitizePosition(input)
    return this.setPulseLength(this.positionToPulse(this.position))
  }

  setBlocked = blocked => {
    this.blocked = blocked
    return this.emit('blocked', this.blocked, this)
  }

  setPulseLength = pulseLength => {
    if (this.blocked) return

    this.setBlocked(true)

    return driverPromise.then(driver => {
      return new Promise((resolve, reject) => {
        driver.setPulseLength(this.channel, pulseLength, 0, error => {
          this.setBlocked(false)

          if (error) return reject(error)

          this.emit('position', this.position, this)
          return resolve(driver)
        })
      })
    })
  }
}
