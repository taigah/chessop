import React from 'react'
import { RepertoireWalker } from '../../lib/RepertoireWalker.js'
import repertoire from '../repertoire.js'

function MoveItem (props) {
  let className = "mb-4 cursor-pointer"
  if (props.active) {
    className += ' font-bold'
  }
  return <div className={ className } onClick={ props.goto.bind(null, props.preline.concat([ props.move ]) )}>
    { props.move }
  </div>
}

function MoveColumn (props) {
  if (props.moves.length === 0) return<React.Fragment />
  const items = props.moves.map((move, key) => <MoveItem
  move={ move }
  key={ key }
  active={ move === props.active }
  preline={ props.preline }
  goto={ props.goto }
  />)
  return <div className="flex flex-col px-4">
    {items}
  </div>
}

export default class OpeningNavigator extends React.Component {
  
  constructor(props) {
    super(props)

    this.walker = new RepertoireWalker(repertoire)

    this.state = {
      line: []
    }
  }
  
  componentDidMount () {
    this.goto([ 'e4', 'e5', 'e6', 'e7' ])
    // TODO: enlever l'event listener à l'unmount
    document.body.addEventListener('keydown', this.onKeyDown.bind(this))
  }

  setLine (line) {
    this.setState(state => {
      return {
        line
      }
    })
  }

  /**
   * @param {KeyboardEvent} event 
   */
  onKeyDown (event) {
    switch (event.key) {
      case 'ArrowLeft':
        this.walker.moveLeft()
        break
      case 'ArrowRight':
        this.walker.moveRight()
        break
      case 'ArrowDown':
        this.walker.moveDown()
        break
      case 'ArrowUp':
        this.walker.moveUp()
        break
    }
    this.setLine(this.walker.line)
  }

  goto (line) {
    this.walker.goto(line)
    this.setLine(line)
  }

  render () {
    const tail = this.walker.preline().map((move, key) => {
      return <MoveColumn moves={ [ move ] }
        active={ move }
        preline={ this.walker.line.slice(0, key) }
        goto={ this.goto.bind(this) }
        key={ key } />
    })

    const alternatives = this.walker.line.length === 0 ? [] : Array.from(
      this.walker.suggestions(this.walker.preline())
    )
    
    const suggestions = Array.from(
      this.walker.suggestions(this.walker.line)
    )

    return <div className="flex">
      { tail }
      <MoveColumn moves={ alternatives } active={ this.walker.current() } preline={ this.walker.preline() } goto={ this.goto.bind(this) } />
      <MoveColumn moves={ suggestions } preline={ this.walker.line } goto={ this.goto.bind(this) } />
    </div>
  }

}
