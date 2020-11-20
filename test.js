import driverPromise from './src/server/pca9685/driver'
import { scaleLinear } from 'd3-scale'

const positionToPulse = scaleLinear()
  .domain([ 0, 180 ])
  .range([ 0, 180 ])

driverPromise.then(driver => {
  driver.setDutyCycle(0, 0.25)
  driver.setPulseLength(0, 90)
})
