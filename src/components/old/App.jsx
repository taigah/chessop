import React from 'react'
import ReactDOM from 'react-dom'
import OpeningNavigator from './OpeningNavigator.jsx'
import Chessground from 'react-chessground'
import Chess from 'chess.js'
import 'react-chessground/dist/styles/chessground.css'
import './app.pcss'
import repertoire from '../../repertoire.js'
import { RepertoireWalker } from '../../../lib/RepertoireWalker.js'

class App extends React.Component {

  constructor (props) {
    super(props)

    this.chess = new Chess()
    this.walker = new RepertoireWalker(repertoire)
    this.walker.addEventListener('change', this.walkerChange.bind(this))

    this.state = {
      fen: this.chess.fen(),
      history: [],
      turnColor: 'white',
      check: false,
      lastMove: undefined
    }
  }

  setFen (fen) {
    this.setState(state => {
      return {
        ...state,
        fen
      }
    })
  }

  setHistory (history) {
    this.setState(state => {
      return {
        ...state,
        history
      }
    })
  }

  setCheck (check) {
    this.setState(state => {
      return {
        ...state,
        check
      }
    })
  }

  setTurnColor (turnColor) {
    this.setState(state => {
      return {
        ...state,
        turnColor
      }
    })
  }

  setLastMove (lastMove) {
    this.setState(state => {
      return {
        ...state,
        lastMove
      }
    })
  }

  walkerChange () {
    this.chess.reset()
    for (const san of this.walker.line) {
      this.chess.move(san)
    }
    this.refreshState()
  }

  refreshState () {
    this.setFen(this.chess.fen())
    this.setHistory(this.chess.history())
    this.setCheck(this.chess.in_check())
    this.setTurnColor(this.chess.turn() === 'w' ? 'white' : 'black')
  }
  
  onMove (from, to) {
    const result = this.chess.move({ from, to })
    if (result !== null) {
      this.setLastMove([ from, to ])
      this.walker.setLine(this.chess.history())
      this.refreshState()
    }
  }

  render () {
    return <React.Fragment>
      <h1>Chessop</h1>
      <div className="flex">
        <Chessground
          width="26vw"
          height="26vw"
          onMove={ this.onMove.bind(this) }
          fen={this.state.fen}
          check={ this.state.check }
          turnColor={ this.state.turnColor }
          lastMove={ this.state.lastMove }
        />
        <OpeningNavigator walker={ this.walker } line={ this.state.history } />
      </div>
    </React.Fragment>
  }

}

ReactDOM.render(
  <App />,
  document.getElementById('app')
)
