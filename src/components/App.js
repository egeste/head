import classNames from 'classnames'

import React, {
  useState,
  useEffect
} from 'react'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom'

import Container from 'react-bootstrap/Container'

import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle } from '@fortawesome/free-solid-svg-icons'

import {
  ERROR,
  CONNECTED,
  SERVO_STATUS
} from '../server/socket/events'

import DashboardControls from './Control'
import DirectControls from './Control/Direct'

import AppContext from '../lib/context'

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
        case CONNECTED: {
          return console.info('Received connection message.')
        }

        case SERVO_STATUS: {
          return setServos(servos => ({ ...servos, [payload.name]: payload.status }))
        }

        case ERROR: {
          return console.warn('Received error', payload)
        }

        default: {
          console.warn('Unhandled payload', payload)
        }
      }
    })
  }, [socket, servos])

  return (
    <AppContext.Provider value={{ socket, servos }}>
      <Router>
        <Navbar bg="dark" variant="dark" expand="md">
          <Navbar.Brand as={Link} to="/">
            Project Mímir
          </Navbar.Brand>

          <Nav className="ml-auto mr-3 mr-md-2">
            <Nav.Item>
              <small className={classNames({
                'animate__flash': !socket,
                'animate__animated': !socket,
                'animate__infinite': !socket
              })}>
                <FontAwesomeIcon
                  icon={faCircle}
                  title={socket ? 'Connected' : 'Connecting...'}
                  className={classNames({
                    'text-success': socket,
                    'text-warning': !socket
                  })}
                />
              </small>
            </Nav.Item>
          </Nav>

          <Navbar.Toggle />

          <Navbar.Collapse>
            <Nav className="ml-auto">
              <Nav.Link as={Link} to="/">Control Dashboard</Nav.Link>
              <Nav.Link as={Link} to="/pwm">Direct Controls</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <Container className="my-5">
          <Switch>
            <Route exact path="/" component={DashboardControls} />
            <Route exact path="/pwm" component={DirectControls} />

            <Route>
              <h1>404</h1>
            </Route>
          </Switch>
        </Container>
      </Router>
    </AppContext.Provider>
  )
}

export default App
