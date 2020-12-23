import React from 'react'
import repertoire from '../repertoire.js'

export default class OpeningNavigator extends React.Component {
  
  constructor(props) {
    super(props)
    this.state = {
      line: []
    }
    document.body.addEventListener('keydown', this.onKeyDown.bind(this))
  }

  preline () {
    return this.state.line.slice(0, -1)
  }

  currentMove () {
    return this.state.line[this.state.line.length - 1]
  }

  /**
   * 
   * @param {KeyboardEvent} event 
   */
  onKeyDown (event) {
    if (event.key === 'ArrowLeft') {
      this.setState(state => {
        return {
          line: state.line.slice(0, -1)
        }
      })
    } else if (event.key === 'ArrowRight') {
      const { value: nextMove } = this.nextMoves(this.state.line).next()
      if (nextMove) {
        this.setState(state => {
          return {
            line: state.line.concat([ nextMove ])
          }
        })
      }
    } else if (event.key === 'ArrowDown') {
      const it = this.nextMoves(this.preline())
      while (true) {
        const { value } = it.next()
        if (value === undefined) break
        if (value === this.currentMove()) {
          const { value } = it.next()
          if (value !== undefined) {
            this.setState(state => {
              return {
                line: state.line.slice(0, -1).concat([ value ])
              }
            })
          }
          break
        }
      }
    } else if (event.key === 'ArrowUp') {
      const it = this.nextMoves(this.preline())
      let previousValue = undefined
      while (true) {
        const { value } = it.next()
        if (value === this.currentMove()) break
        if (value === undefined) break
        previousValue = value
      }
      if (previousValue !== undefined) {
        this.setState(state => {
          return {
            line: state.line.slice(0, -1).concat([ previousValue ])
          }
        })
      }
    }
  }

  goto (line) {
    this.setState(state => {
      return {
        line
      }
    })
  }

  nextMoves (line) {
    return repertoire.at(line).children.keys()
  }

  render () {
    const breadcrumb = []
    for (const [key, move] of this.state.line.slice(0, -1).entries()) {
      const line = this.state.line.slice(0, key + 1)
      breadcrumb.push(
        <div className="px-4 font-bold cursor-pointer" key={ key } onClick={ this.goto.bind(this, line) }>
          {move}
        </div>
      )
    }

    const current = []
    for (const [key, move] of Array.from(this.nextMoves(this.state.line.slice(0, -1))).entries()) {
      const line = this.state.line.concat([ move ])
      const classList = [ "mb-4", "cursor-pointer" ]
      if (move === this.state.line[this.state.line.length - 1]) {
        classList.push('font-bold')
      }
      current.push(
        <div className={ classList.join(' ') } key={ key } onClick={ this.goto.bind(this, line) }>
          {move}
        </div>
      )
    }

    const next = []
    if (this.state.line.length !== 0) {
      for (const [key, move] of Array.from(this.nextMoves(this.state.line)).entries()) {
        const line = this.state.line.concat([ move ])
        next.push(
          <div className="mb-4 cursor-pointer" key={ key } onClick={ this.goto.bind(this, line) }>
            {move}
          </div>
        )
      }
    }

    return <div className="flex">
      {breadcrumb}
      <div className="flex flex-col px-4">
        {current}
      </div>
      <div className="flex flex-col px-4">
        {next}
      </div>
    </div>
  }

}
