import classNames from 'classnames'
import get from 'lodash/get'

import React, { Fragment, useState, useEffect } from 'react'

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
  SERVO_POSITION
} from './server/socket/events'

export const App = () => {
  const [ servos, setServos ] = useState({})
  const [ socket, setSocket ] = useState(undefined)

  useEffect(() => {
    if (socket) return

    const newSocket = new WebSocket(`ws://${window.location.host}/socket`)

    newSocket.addEventListener('open', () => setSocket(newSocket))
    newSocket.addEventListener('close', () => setSocket(undefined))

    newSocket.addEventListener('message', ({ data }) => {
      let message
      try { message = JSON.parse(data) }
      catch (e) { return console.error(e.message) }

      switch(message.event) {
        case SERVO_POSITION: {
          return setServos({ ...servos, [message.name]: message.position })
        }
        default: {
          console.warn('Unhandled message', message)
        }
      }
    })
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
          <Col xs={5}>
            <Image fluid src="/cameras/left_eye" />
          </Col>

          <Col as={Form.Group} xs={2} className="mb-0">
            <Form.Control
              className="w-100 h-100"

              as={Slider}
              axis="xy"

              x={get(servos, 'eyesXServo')}
              xmin={0}
              xmax={180}
              xstep={1}

              y={get(servos, 'eyesYServo')}
              ymin={0}
              ymax={180}
              ystep={1}
            />
          </Col>

          <Col xs={5}>
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
              xmax={180}
              xstep={1}
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
