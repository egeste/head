import pigpio from 'pigpio'
import { scaleLinear } from 'd3-scale'

export const MIN_POSITION = 0
export const MAX_POSITION = 180

export const MIN_PULSE_WIDTH = 500
export const MAX_PULSE_WIDTH = 2500

export const positionToPulseWidth = scaleLinear()
  .domain([ MIN_POSITION, MAX_POSITION ])
  .range([ MIN_PULSE_WIDTH, MAX_PULSE_WIDTH ])

export const pulseWidthToPosition = scaleLinear()
  .domain([ MIN_PULSE_WIDTH, MAX_PULSE_WIDTH ])
  .range([ MIN_POSITION, MAX_POSITION ])

export default class Servo {

  constructor(pin, frequency, position=90, dutyCycle=20) {
    this.gpio = new pigpio.Gpio(pin, { mode: Gpio.OUTPUT })
    this.gpio.pwmFrequency(frequency)
    this.gpio.pwmWrite(dutyCycle)

    this._position = position
    this.save()
  }

  setPosition = (position = 90) => {
    const sanitizedPosition = Math.max(Math.min(position, MAX_POSITION), MIN_POSITION)
    this._position = position
    this.save()
  }

  getPosition = () => {
    return this._position
  }

  getPulseWidth = () => {
    return positionToPulseWidth(this._position)
  }

  readPosition = () => {
    return pulseWidthToPosition(this.readPulseWidth())
  }

  readPulseWidth = () => {
    const pulseWidth = this.gpio.getServoPulseWidth()
    this._position = pulseWidthToPosition(pulseWidth)
    return pulseWidth
  }

  save = () => {
    return this.gpio.servoWrite(this.getPulseWidth())
  }
}
