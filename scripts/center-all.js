import servos from './src/server/servos'

Object.entries(servos).map(([ servoName, servo ]) => {
  servo.setPosition(0.5)
})
