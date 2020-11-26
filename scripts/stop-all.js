import driverPromise from '../src/server/servos/driver'

driverPromise.then(driver => {
  driver.dispose()
})
