import get from 'lodash/get'

import React, { Fragment, useContext, useCallback } from 'react'

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import Form from 'react-bootstrap/Form'
import Image from 'react-bootstrap/Image'
import Button from 'react-bootstrap/Button'

import Slider from 'react-input-slider'

import {
  SERVO_POSITION
} from '../../server/socket/events'

import {
  // JAW_SERVO_NAME,
  // NECK_X_SERVO_NAME,
  EYES_X_SERVO_NAME,
  EYES_Y_SERVO_NAME
} from '../../server/servos/constants'

import AppContext from '../../lib/context'

export const DashboardControls = () => {
  const { socket, servos } = useContext(AppContext)

  const onChangeEyesXY = useCallback(({ x, y }) => {
    if (!socket) return
    socket.send(JSON.stringify({ event: SERVO_POSITION, name: EYES_X_SERVO_NAME, position: x }))
    socket.send(JSON.stringify({ event: SERVO_POSITION, name: EYES_Y_SERVO_NAME, position: y }))
  }, [socket])

  return (
    <Fragment>
      <Row>
        <Col xs={5}>
          <Image fluid className="w-100" src="/cameras/left_eye" />
        </Col>

        <Col as={Form.Group} xs={2} className="mb-0">
          <Form.Control
            className="w-100 h-100"

            as={Slider}
            axis="xy"

            x={servos[EYES_X_SERVO_NAME]}
            xmin={0}
            xmax={1}
            xstep={0.01}

            y={servos[EYES_Y_SERVO_NAME]}
            ymin={0}
            ymax={1}
            ystep={0.01}

            onChange={onChangeEyesXY}
          />
        </Col>

        <Col xs={5}>
          <Image fluid className="w-100" src="/cameras/right_eye" />
        </Col>
      </Row>

      <Row>
        <Col className="py-5" xs={{ span: 6, offset: 3 }}>
          <Slider
            className="w-100"

            axis="x"

            x={get('servos, jawYServo')}
            xmin={0}
            xmax={1}
            xstep={0.01}
          />
        </Col>
      </Row>

      <Row>
        <Col xs={{ span: 6, offset: 3 }}>
          <Button block variant="primary" size="lg">
            Mouth
          </Button>
        </Col>
      </Row>
    </Fragment>
  )
}

export default DashboardControls
