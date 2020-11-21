import debounce from 'lodash/debounce'

import EventEmitter from 'events'
import { scaleLinear } from 'd3-scale'

import driverPromise from './driver'

export const MIN_POSITION = 0
export const MAX_POSITION = 1
export const sanitizePosition = (input = 0.5) => {
  return Math.max(Math.min(position, MAX_POSITION), MIN_POSITION)
}

export default class Servo extends EventEmitter {

  constructor({
    channel,
    position=0.5,
    frequency=50,
    dutyCycle=0.25,
    pulseRange=[600, 2400]
  }) {
    this._blocked = true
    this._channel = channel
    this._position = position

    // this.save = debounce(this.save, 10)
    this._scalePosition = scaleLinear()
      .domain([ MIN_POSITION, MAX_POSITION ])
      .range(pulseRange)

    driverPromise.then(driver => {
      this._blocked = false
      driver.setDutyCycle(channel, dutyCycle)
    })
  }

  getPosition = () => {
    return this._position
  }

  setPosition = (position = 0.5) => {
    this._position = sanitizePosition(position)
    return this.save()
  }

  save = () => {
    if (this._blocked) return Promise.reject('blocked')

    this._blocked = true
    return driverPromise.then(driver => {
      this._blocked = false
      const pulseLength = this._scalePosition(this._position)
      driver.setPulseLength(this._channel, pulseLength)
    }).catch(() => this._blocked = false)
  }

  // readPulseWidth = () => {
  //   const pulseWidth = this.pca9685.getServoPulseWidth()
  //   this._position = pulseWidthToPosition(pulseWidth)
  //   this.fire('read', this)
  //   return pulseWidth
  // }

  // readPosition = () => {
  //   return pulseWidthToPosition(this.readPulseWidth())
  // }
}
