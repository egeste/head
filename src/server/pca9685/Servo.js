import EventEmitter from 'events'
import { scaleLinear } from 'd3-scale'

import driverPromise from './driver'

export const MIN_POSITION = 0
export const MAX_POSITION = 180

export default class Servo extends EventEmitter {

  constructor(channel, position=90, pulseRange=[0, 180], dutyCycle=0.25) {
    this._channel = channel
    this._position = position

    this._scalePosition = scaleLinear()
      .domain([ 0, 180 ])
      .range(pulseRange)

    driverPromise.then(driver => {
      driver.setDutyCycle(channel, dutyCycle)
    })
  }

  getPosition = () => {
    return this._position
  }

  // getPulseWidth = () => {
  //   return positionToPulseWidth(this._position)
  // }

  /*
  readPulseWidth = () => {
    const pulseWidth = this.pca9685.getServoPulseWidth()
    this._position = pulseWidthToPosition(pulseWidth)
    this.fire('read', this)
    return pulseWidth
  }

  readPosition = () => {
    return pulseWidthToPosition(this.readPulseWidth())
  }

  setPosition = (position = 90) => {
    const sanitizedPosition = Math.max(Math.min(position, MAX_POSITION), MIN_POSITION)
    this._position = position
    this.save()
  }

  save = () => {
    this.fire('write', this)
    return this.pca9685.servoWrite(this.getPulseWidth())
  }
  */
}
