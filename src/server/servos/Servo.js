import debounce from 'lodash/debounce'

import EventEmitter from 'events'
import { scaleLinear } from 'd3-scale'

import driverPromise from './driver'

export default class Servo extends EventEmitter {

  static const MIN_POSITION = 0
  static const MAX_POSITION = 1
  static sanitizePosition = (input = 0.5) => {
    return Math.max(
      Math.min(
        position,
        Servo.MAX_POSITION
      ),
      Servo.MIN_POSITION
    )
  }

  blocked = true

  constructor(channel, position=0.5, pulseRange=[600, 2400], dutyCycle=0.25) {
    this.save = debounce(this.save, 10)

    this._channel = channel
    this._position = position

    this._scalePosition = scaleLinear()
      .domain([ MIN_POSITION, MAX_POSITION ])
      .range(pulseRange)

    driverPromise.then(driver => {
      blocked = false
      driver.setDutyCycle(channel, dutyCycle)
    })
  }

  getPosition = () => {
    return this._position
  }

  setPosition = (position = 0.5) => {
    this._position = Servo.sanitizePosition(position)
    return this.save()
  }

  save = () => {
    if (blocked) return Promise.reject('blocked')

    blocked = true
    return driverPromise.then(driver => {
      blocked = false
      const pulseLength = this._scalePosition(this._position)
      driver.setPulseLength(this._channel, pulseLength)
    }).catch(() => blocked = false)
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
