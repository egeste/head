import driverPromise from '../src/server/servos/driver'
import servos from './src/server/servos'

driverPromise.then(driver => {
  Object.values(servos).map(servo => {
    servo.setPosition(0.5)
  })

  driver.dispose()
})
