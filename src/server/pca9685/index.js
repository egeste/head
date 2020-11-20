import Servo from './Servo'

export const servos = {
  jawYServo: new Servo(1, 90, [10, 400]),
  neckXServo: new Servo(2, 90, [556, 2420]),
  eyesXServo: new Servo(3, 90, [0, 180]),
  eyesYServo: new Servo(4, 90, [0, 180])
}
