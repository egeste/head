import get from 'lodash/get'
import debounce from 'lodash/debounce'

import React, { Fragment, useContext, useCallback } from 'react'

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import Form from 'react-bootstrap/Form'
import Image from 'react-bootstrap/Image'
// import Button from 'react-bootstrap/Button'

import Slider from 'react-input-slider'

import {
  SERVO_POSITION
} from '../../server/socket/events'

import {
  JAW_SERVO_NAME,
  JAW_SERVO_POSITION,

  NECK_X_SERVO_NAME,
  NECK_X_SERVO_POSITION,

  EYES_X_SERVO_NAME,
  EYES_X_SERVO_POSITION,

  EYES_Y_SERVO_NAME,
  EYES_Y_SERVO_POSITION
} from '../../server/servos/constants'

import AppContext from '../../lib/context'

export const DashboardControls = () => {
  const { socket, servos } = useContext(AppContext)

  const onChangeEyesXY = debounce(useCallback(({ x, y }) => {
    if (!socket) return
    socket.send(JSON.stringify({ event: SERVO_POSITION, name: EYES_X_SERVO_NAME, position: x }))
    socket.send(JSON.stringify({ event: SERVO_POSITION, name: EYES_Y_SERVO_NAME, position: y }))
  }, [socket]), 10)

  const onChangeNeckXY = debounce(useCallback(({ x, y }) => {
    if (!socket) return
    socket.send(JSON.stringify({ event: SERVO_POSITION, name: NECK_X_SERVO_NAME, position: x }))
  }, [socket]), 10)

  const onChangeJaw = debounce(useCallback(({ y }) => {
    if (!socket) return
    socket.send(JSON.stringify({ event: SERVO_POSITION, name: JAW_SERVO_NAME, position: y }))
  }, [socket]), 10)

  return (
    <Fragment>
      <Row>
        <Col xs={6}>
          <Image fluid className="w-100" src="/cameras?action=stream_0" />
        </Col>
        <Col xs={6}>
          <Image fluid className="w-100" src="/cameras?action=stream_0" />
        </Col>
      </Row>

      <Row className="my-4">
        <Col xs={5} style={{ minHeight: '30vh' }}>
          <Form.Control
            className="w-100 h-100"

            as={Slider}
            axis="xy"

            x={get(servos, 'NECK_X_SERVO_NAME.position', NECK_X_SERVO_POSITION)}
            xmin={0}
            xmax={1}
            xstep={0.01}
            xreverse

            y={NECK_X_SERVO_POSITION}
            ymin={0}
            ymax={1}
            ystep={0.01}

            onChange={onChangeNeckXY}
          />
        </Col>
        <Col xs={2}>
          <Form.Control
            className="w-100 h-100"

            as={Slider}
            axis="y"

            y={get(servos, 'JAW_SERVO_NAME.position', JAW_SERVO_POSITION)}
            ymin={0}
            ymax={1}
            ystep={0.01}

            onChange={onChangeJaw}
          />
        </Col>
        <Col xs={5} style={{ minHeight: '30vh' }}>
          <Form.Control
            className="w-100 h-100"

            as={Slider}
            axis="xy"

            x={get(servos, 'EYES_X_SERVO_NAME.position', EYES_X_SERVO_POSITION)}
            xmin={0}
            xmax={1}
            xstep={0.01}
            xreverse

            y={get(servos, 'EYES_Y_SERVO_NAME.position', EYES_Y_SERVO_POSITION)}
            ymin={0}
            ymax={1}
            ystep={0.01}

            onChange={onChangeEyesXY}
          />
        </Col>
      </Row>

    </Fragment>
  )
}

export default DashboardControls
