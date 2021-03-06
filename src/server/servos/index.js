import Servo from './Servo'

import {
  JAW_SERVO_NAME,
  JAW_SERVO_CHANNEL,
  JAW_SERVO_POSITION,
  JAW_SERVO_PWM_RANGE,

  NECK_X_SERVO_NAME,
  NECK_X_SERVO_CHANNEL,
  NECK_X_SERVO_POSITION,
  NECK_X_SERVO_PWM_RANGE,

  EYES_X_SERVO_NAME,
  EYES_X_SERVO_CHANNEL,
  EYES_X_SERVO_POSITION,
  EYES_X_SERVO_PWM_RANGE,

  EYES_Y_SERVO_NAME,
  EYES_Y_SERVO_CHANNEL,
  EYES_Y_SERVO_POSITION,
  EYES_Y_SERVO_PWM_RANGE
} from './constants'

export default {
  [JAW_SERVO_NAME]: new Servo({
    channel: JAW_SERVO_CHANNEL,
    position: JAW_SERVO_POSITION,
    pwmRange: JAW_SERVO_PWM_RANGE
  }),
  [NECK_X_SERVO_NAME]: new Servo({
    channel: NECK_X_SERVO_CHANNEL,
    position: NECK_X_SERVO_POSITION,
    pwmRange: NECK_X_SERVO_PWM_RANGE
  }),
  [EYES_X_SERVO_NAME]: new Servo({
    channel: EYES_X_SERVO_CHANNEL,
    position: EYES_X_SERVO_POSITION,
    pwmRange: EYES_X_SERVO_PWM_RANGE
  }),
  [EYES_Y_SERVO_NAME]: new Servo({
    channel: EYES_Y_SERVO_CHANNEL,
    position: EYES_Y_SERVO_POSITION,
    pwmRange: EYES_Y_SERVO_PWM_RANGE
  })
}
