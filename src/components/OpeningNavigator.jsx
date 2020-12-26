import React from 'react'

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

    const line = props.line

    this.state = {
      line
    }
  }
  
  componentDidMount () {
    // TODO: enlever l'event listener à l'unmount
    document.body.addEventListener('keydown', this.onKeyDown.bind(this))
  }

  componentDidUpdate (previousProps) {
    if (previousProps.line !== this.props.line) {
      this.setLine(this.props.line)
    }
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
        this.props.walker.moveLeft()
        break
      case 'ArrowRight':
        this.props.walker.moveRight()
        break
      case 'ArrowDown':
        this.props.walker.moveDown()
        break
      case 'ArrowUp':
        this.props.walker.moveUp()
        break
    }
    this.setLine(this.props.walker.line)
  }

  goto (line) {
    this.props.walker.setLine(line)
    this.setLine(line)
  }

  render () {
    const tail = this.props.walker.preline().map((move, key) => {
      return <MoveColumn moves={ [ move ] }
        active={ move }
        preline={ this.props.walker.line.slice(0, key) }
        goto={ this.goto.bind(this) }
        key={ key } />
    })

    const alternatives = Array.from(
      this.props.walker.alternatives(this.props.walker.line)
    )

    const suggestions = Array.from(
      this.props.walker.suggestions(this.props.walker.line)
    )

    return <div className="flex">
      { tail }
      <MoveColumn moves={ alternatives } active={ this.props.walker.current() } preline={ this.props.walker.preline() } goto={ this.goto.bind(this) } />
      <MoveColumn moves={ suggestions } preline={ this.props.walker.line } goto={ this.goto.bind(this) } />
    </div>
  }

}
