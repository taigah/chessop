import React from 'react'
import ReactDOM from 'react-dom'
import OpeningNavigator from './OpeningNavigator.jsx'
import './app.pcss'

function App () {
  return <React.Fragment>
    <h1>Chessop</h1>
    <OpeningNavigator />
  </React.Fragment>
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
)
