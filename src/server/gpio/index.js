import pigpio from 'pigpio'
import { scaleLinear } from 'd3-scale'

import Servo from './Servo'

/** Define our servo pins on the gpio
*    3V3      (1) | (2)  5V
*  GPIO2/JAW  (3) | (4)  5V
*  GPIO3/EYEX (5) | (6)  GND
*  GPIO4/EYEY (7) | (8)  GPIO14
*    GND      (9) | (10) GPIO15
* GPIO17     (11) | (12) GPIO18
* GPIO27     (13) | (14) GND
* GPIO22     (15) | (16) GPIO23/NECKX
*    3V3     (17) | (18) GPIO24
* GPIO10     (19) | (20) GND
*  GPIO9     (21) | (22) GPIO25
* GPIO11     (23) | (24) GPIO8
*    GND     (25) | (26) GPIO7
*  GPIO0     (27) | (28) GPIO1
*  GPIO5     (29) | (30) GND
*  GPIO6     (31) | (32) GPIO12
* GPIO13     (33) | (34) GND
* GPIO19     (35) | (36) GPIO16
* GPIO26     (37) | (38) GPIO20
*    GND     (39) | (40) GPIO21
*/

;(() => {
  // https://github.com/fivdi/pigpio/blob/master/doc/configuration.md#clock_pwm
  try { pigpio.configureClock(5, pigpio.CLOCK_PWM) }
  catch (e) { return console.error('pigpio misconfigured') }

  return {
    jawYServo: new Servo(3, 1000, 90),
    eyesXServo: new Servo(5, 50, 90),
    eyesYServo: new Servo(7, 50, 90),
    neckXServo: new Servo(16, 2000, 90)
  }
})()
