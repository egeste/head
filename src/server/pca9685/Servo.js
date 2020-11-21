import EventEmitter from 'events'
import { scaleLinear } from 'd3-scale'

import driverPromise from './driver'

export const MIN_POSITION = 0
export const MAX_POSITION = 1

const sanitizePosition = (input = 0.5) => {
  return Math.max(Math.min(position, MAX_POSITION), MIN_POSITION)
}

export default class Servo extends EventEmitter {

  constructor(channel, position=0.5, pulseRange=[0, 400], dutyCycle=0.25) {
    this._channel = channel
    this._position = position

    this._scalePosition = scaleLinear()
      .domain([ MIN_POSITION, MAX_POSITION ])
      .range(pulseRange)

    driverPromise.then(driver => {
      driver.setDutyCycle(channel, dutyCycle)
    })
  }

  getPosition = () => {
    return this._position
  }

  setPosition = (position = 0.5) => {
    const sanitizedPosition = Math.max(Math.min(position, MAX_POSITION), MIN_POSITION)
    this._position = position
    return this.save()
  }

  save = () => {
    return driverPromise.then(driver => {
      const pulseLength = this._scalePosition(this._position)
      return driver.setPulseLength(this._channel, pulseLength)
    })
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
