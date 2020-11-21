import classNames from 'classnames'
import get from 'lodash/get'

import React, { Fragment, useState, useEffect, useCallback } from 'react'

import Slider from 'react-input-slider'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'

import Form from 'react-bootstrap/Form'
import Image from 'react-bootstrap/Image'
import Button from 'react-bootstrap/Button'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle } from '@fortawesome/free-solid-svg-icons'

import {
  CONNECTED,
  SERVO_POSITION
} from './server/socket/events'

import {
  // JAW_SERVO_NAME,
  // NECK_X_SERVO_NAME,
  EYES_X_SERVO_NAME,
  EYES_Y_SERVO_NAME
} from './server/servos/constants'

export const App = () => {
  const [ servos, setServos ] = useState({})
  const [ socket, setSocket ] = useState(undefined)

  useEffect(() => {
    if (socket) return

    const newSocket = new WebSocket(`ws://${window.location.host}/socket`)

    newSocket.addEventListener('open', () => setSocket(newSocket))
    newSocket.addEventListener('close', () => setSocket(undefined))

    newSocket.addEventListener('message', message => {
      let payload
      try { payload = JSON.parse(message.data) }
      catch (e) { return console.error(e.message) }

      switch(payload.event) {
        case CONNECTED: return console.info('Received connection message.')
        case SERVO_POSITION: return setServos({ ...servos, [payload.name]: payload.position })
        default: console.warn('Unhandled payload', payload)
      }
    })
  }, [socket, servos])

  const onChangeEyesXY = useCallback(({ x, y }) => {
    if (!socket) return
    socket.send(JSON.stringify({ event: SERVO_POSITION, name: EYES_X_SERVO_NAME, position: x }))
    socket.send(JSON.stringify({ event: SERVO_POSITION, name: EYES_Y_SERVO_NAME, position: y }))
  }, [socket])

  return (
    <Fragment>

      <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="/">
          <span>Project Mimir</span>
        </Navbar.Brand>

        <Nav className="ml-auto">
          <Nav.Item>
            <small>
              <FontAwesomeIcon
                icon={faCircle}
                className={classNames({
                  'text-warning': !socket,
                  'text-success': socket
                })}
              />
            </small>
          </Nav.Item>
        </Nav>
      </Navbar>

      <Container>
        <Row>
          <Col xs={4}>
            <Image fluid src="/cameras/left_eye" />
          </Col>

          <Col as={Form.Group} xs={4} className="mb-0">
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

          <Col xs={4}>
            <Image fluid src="/cameras/right_eye" />
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

      </Container>
    </Fragment>
  )
}

export default App
