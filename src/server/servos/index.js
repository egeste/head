import Servo from './Servo'

export const NECK_X_SERVO = new Servo(0, 0.5, [556, 2420])
export const NECK_Y_SERVO = new Servo(1, 0.5, [556, 2420])

export const JAW_SERVO = new Servo(4, 0.5)

export const EYES_X_SERVO = new Servo(14, 0.5)
export const EYES_Y_SERVO = new Servo(15, 0.5)
