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
  CONNECTED,
  SERVO_POSITION
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

        case SERVO_POSITION: {
          return setServos(servos => ({  ...servos, [payload.name]: payload.position }))
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
          <Navbar.Brand href="/">
            <span>Project Mímir</span>
          </Navbar.Brand>

          <Nav className="ml-auto mr-3 mr-md-2">
            <Nav.Item>
              <small>
                <FontAwesomeIcon
                  icon={faCircle}
                  title={socket ? 'Connected' : 'Connecting...'}
                  className={classNames({
                    'text-warning': !socket,
                    'text-success': socket
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
