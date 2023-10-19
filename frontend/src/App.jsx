import React, { Component } from 'react'
import './App.css'
import MovieListContainer from './containers/MovieListContainer'
import Schedule from './containers/ScheduleContainer'
import MovieEditingListContainer from './containers/MovieEditingListContainer'
import MovieEditingFormContainer from './containers/MovieEditingFormContainer'
import LoginFormContainer from './containers/LoginFormContainer'
import { BrowserRouter as Router, Route, Redirect, Switch, NavLink } from 'react-router-dom'
import { Sidebar, Segment, Button, Menu, Icon } from 'semantic-ui-react'

function adminLoggedIn () {
  // eslint-disable-next-line
  const user = JSON.parse(sessionStorage.getItem('user'))
  return (user && user.admin)
}

class App extends Component {
  constructor (props) {
    super(props)
    this.state = { sidebarVisible: false }
  }

  toggleSidebarVisibility () {
    this.setState({ sidebarVisible: !this.state.sidebarVisible })
  }

  render () {
    return (
      <Router>
        <div className='main'>
          <div className='headerArea'>
            <div className='titleArea'>
              <div className='mainTitle'>
                <span>Kriitikon valinta</span>
              </div>
              <div className='secondaryTitle'>
                <span>
                  Elokuva-arvostelut <br className='secondaryTitleBr' />
                  kootusti yhdessä paikassa
                </span>
              </div>
            </div>

            <ul className='navbar'>
              <li><NavLink exact to='/' activeClassName='activeTab'>Ohjelmistossa nyt</NavLink></li>
              <li><NavLink to='/naytosajat' activeClassName='activeTab'>Näytösajat</NavLink></li>
              {/*
              <li><NavLink to='/arkisto' activeClassName='activeTab'>Arkisto</NavLink></li>
              */}
            </ul>

            <div className='toggleSidebarButton'>
              <Button size='massive' onClick={this.toggleSidebarVisibility.bind(this)}>
                <Icon name='content' />
              </Button>
            </div>
          </div>

          <Sidebar.Pushable as={Segment} inverted className='push'>
            <Sidebar
              className='navigationSidebar'
              as={Menu}
              direction='right'
              animation='push'
              width='thin'
              visible={this.state.sidebarVisible}
              icon='labeled'
              vertical>

              <Menu.Item name='ohjelmistossa'>
                <Icon name='film' />
                <NavLink exact to='/' onClick={this.toggleSidebarVisibility.bind(this)}>Ohjelmistossa</NavLink>
              </Menu.Item>
              <Menu.Item name='näytökset'>
                <Icon name='time' />
                <NavLink to='/naytosajat' onClick={this.toggleSidebarVisibility.bind(this)}>Näytösajat</NavLink>
              </Menu.Item>
              {/*
              <Menu.Item name='arkisto'>
                <Icon name='archive' />
                <NavLink to='/poistuneet' onClick={this.toggleSidebarVisibility.bind(this)}>Arkisto</NavLink>
              </Menu.Item>
              */}
            </Sidebar>

            <Sidebar.Pusher>
              <Segment inverted>
                <div className='contentArea'>
                  <Switch>
                    <Route exact path='/' component={MovieListContainer} />
                    <Route path='/naytosajat' component={Schedule} />
                    <Route path='/login' component={LoginFormContainer} />
                    <Route path='/edit/:movieId' render={({ match }) => (
                        adminLoggedIn() ? (
                          <MovieEditingFormContainer match={match} />
                        ) : (
                          <Redirect to='/login' />
                        ))}
                    />
                    <Route path='/edit' render={() => (
                        adminLoggedIn() ? (
                          <MovieEditingListContainer />
                        ) : (
                          <Redirect to='/login' />
                        ))}
                    />
                  </Switch>
                </div>
              </Segment>
            </Sidebar.Pusher>
          </Sidebar.Pushable>
        </div>
      </Router>
    )
  }
}

export default App
