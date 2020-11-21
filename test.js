import driverPromise from './src/server/pca9685/driver'
import { scaleLinear } from 'd3-scale'

driverPromise.then(driver => {

  driver.setDutyCycle(0, 0.25)
  driver.setPulseLength(0, (
    scaleLinear()
      .domain([ 0, 1 ])
      .range([ 556, 2420 ])
  )(0.5))

  driver.setDutyCycle(1, 0.25)
  driver.setPulseLength(1, (
    scaleLinear()
      .domain([ 0, 1 ])
      .range([ 400, 1600 ])
  )(0.5))

//   driver.setDutyCycle(0, 0.25)
//   driver.setPulseLength(0, (
//     scaleLinear()
//       .domain([ 0, 180 ])
//       .range([ 556, 2420 ])
//   )(90))
//
//   driver.setDutyCycle(0, 0.25)
//   driver.setPulseLength(0, (
//     scaleLinear()
//       .domain([ 0, 180 ])
//       .range([ 556, 2420 ])
//   )(90))
})
