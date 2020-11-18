import classNames from 'classnames'

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

export default () => {
  const [ eyes, setEyes ] = useState({ x: 90, y: 90 })
  const [ neck, setNeck ] = useState({ x: 90, y: 90 })

  const [ socket, setSocket ] = useState(undefined)

  useEffect(() => {
    if (socket) return
    const newSocket = new WebSocket(`ws://${window.location.host}/socket`)
    newSocket.onopen = () => setSocket(newSocket)
    newSocket.onclose = () => setSocket(undefined)
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

              x={eyes.x}
              xmin={0}
              xmax={180}
              xstep={1}

              y={eyes.y}
              ymin={0}
              ymax={180}
              ystep={1}

              onChange={setEyes}
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

              x={neck.x}
              xmin={0}
              xmax={180}
              xstep={1}

              onChange={setNeck}
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
