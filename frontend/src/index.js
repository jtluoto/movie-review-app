import './index.css'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import ReduxPromise from 'redux-promise'
import Thunk from 'redux-thunk'
import reducers from './reducers'
import App from './App'

const createStoreWithMiddleware = applyMiddleware(ReduxPromise, Thunk)(createStore)

ReactDOM.render(
  <Provider store={createStoreWithMiddleware(reducers)}>
    <App />
  </Provider>
, document.getElementById('root'))
