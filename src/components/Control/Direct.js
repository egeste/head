import debounce from 'lodash/debounce'

import React, { useContext, useMemo } from 'react'

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'

import Slider from 'react-input-slider'

import {
  SERVO_POSITION
} from '../../server/socket/events'

import AppContext from '../../lib/context'

export const DirectControls = () => {
  const { socket, servos } = useContext(AppContext)

  return (
    <Row className="direct-controls">
      <Col xs={12} md={6} lg={4}>
        <Card className="direct-controls__pwm_sliders">

          <Card.Body>
            <Card.Title>
              Direct PWM Controls
            </Card.Title>
          </Card.Body>

          <Card.Body as={Row}>
            {useMemo(() => {
              return Object.entries(servos).map(([ name, position ]) => (
                <Col key={`pwm-control-${name}`}
                  as={Form.Group}
                  xs={Math.floor(servos.length / 12)}
                  className="text-center"
                >
                  <Form.Group>
                    <Form.Label>
                      {name} : {position}
                    </Form.Label>

                    <Form.Control
                      as={Slider}
                      axis="x"

                      xmin={0}
                      xmax={3000}
                      xstep={1}

                      onChange={debounce(({ x: pulse }) => {
                        socket.send(JSON.stringify({ event: SERVO_POSITION, name, pulse }))
                      }, 100)}
                    />
                  </Form.Group>
                </Col>
              ))
            }, [socket, servos])}
          </Card.Body>

        </Card>
      </Col>
    </Row>
  )
}

export default DirectControls
