import Servo from './Servo'

export const servos = {
  jawYServo: new Servo(1, 0.5, [10, 400]),
  neckXServo: new Servo(2, 0.5, [556, 2420]),
  eyesXServo: new Servo(3, 0.5, [10, 400]),
  eyesYServo: new Servo(4, 0.5, [10, 400])
}
