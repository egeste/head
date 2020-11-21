import Servo from './Servo'

// Neck control
export const NECK_X_SERVO = new Servo({
  channel: 0,
  position: 0.5,
  pwmRange: [556, 2420]
})

// export const NECK_Y_SERVO = new Servo({
//   channel: 1,
//   position: 0.5,
//   pwmRange: [556, 2420]
// })

// Jaw control
export const JAW_SERVO = new Servo({
  channel: 4,
  position: 0.5
})

// Eye control
export const EYES_X_SERVO = new Servo({
  channel: 14,
  position: 0.5
})

export const EYES_Y_SERVO = new Servo({
  channel: 15,
  position: 0.5
})
