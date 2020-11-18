# HS-805BB

* Max PWM Signal Range: 556μsec - 2420μsec
* It’s important that the servo have downtime.
** a duty cycle of about 20-25% is ideal.
* Set the PWM refresh rate with `pwmSetClockDivider()`
** This is a power-of-two divisor of the base 19.2MHz rate, with a maximum value of 4096.

```es6
const rpioFrequency = 1.92e+7 9.2MHz
const microsendsPerHertz = 1000000

const frequencyToPWMClock = frequency => {
  return rpioFrequency / frequency
}

const microsecondsToPWMClock = microseconds => {
  return frequencyToPWMClock()
}
```
