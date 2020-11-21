import Servo from './Servo'

import {
  JAW_SERVO_NAME,
  NECK_X_SERVO_NAME,
  EYES_X_SERVO_NAME,
  EYES_Y_SERVO_NAME
} from './constants'

export default {
  [JAW_SERVO_NAME]: new Servo({ channel: 4, position: 0.5 }),
  [NECK_X_SERVO_NAME]: new Servo({ channel: 0, position: 0.5, pwmRange: [556, 2420] }),
  [EYES_X_SERVO_NAME]: new Servo({ channel: 14, position: 0.5 }),
  [EYES_Y_SERVO_NAME]: new Servo({ channel: 15, position: 0.5 })
}
