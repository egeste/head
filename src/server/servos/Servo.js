import debounce from 'lodash/debounce'

import EventEmitter from 'events'
import { scaleLinear } from 'd3-scale'

import driverPromise from './driver'

export const MIN_POSITION = 0
export const MAX_POSITION = 1

export const sanitizePosition = (input = 0.5) => {
  return Math.max(Math.min(input, MAX_POSITION), MIN_POSITION)
}

export default class Servo extends EventEmitter {

  constructor({
    channel,
    position=0.5,
    dutyCycle=0.25,
    pwmRange=[600, 2400]
  }) {
    super()

    this.blocked = true
    this.channel = channel
    this.position = position

    this.positionToPulseWidth = scaleLinear()
      .domain([ MIN_POSITION, MAX_POSITION ])
      .range(pwmRange)

    driverPromise.then(driver => {
      driver.setDutyCycle(channel, dutyCycle, 0, () => {
        this.blocked = false
        this.setPosition()
      })
    })
  }

  getPosition = () => {
    return this.position
  }

  getPulseWidth = () => {
    return this.positionToPulseWidth(this.position)
  }

  setBlocked = (blocked = this.blocked) => {
    this.blocked = blocked
    return this.emit('blocked', this)
  }

  setPosition = (position = this.position) => {
    this.position = sanitizePosition(position)
    return this.setPulseWidth(this.positionToPulseWidth(this.position))
  }

  setPulseWidth = (pulseLength = this.positionToPulseWidth(this.position)) => {
    if (this.blocked) return

    this.setBlocked(true)

    return driverPromise.then(driver => {
      return new Promise((resolve, reject) => {
        driver.setPulseLength(this.channel, Math.round(pulseLength), 0, error => {
          this.setBlocked(false)

          if (error) return reject(error)

          this.emit('pulse', this)
          return resolve(driver)
        })
      })
    })
  }

}
