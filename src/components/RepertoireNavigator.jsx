import React from 'react'
import { RepertoireWalker } from '../../lib/RepertoireWalker.js'

function MoveItem (props) {
  let className = "py-4 cursor-pointer"
  if (props.active) {
    className += ' font-bold'
  }
  return <div className={ className }>
    { props.move }
  </div>
}

function MoveColumn (props) {
  if (props.moves.length === 0) return<React.Fragment />
  const items = props.moves.map((move, key) => <MoveItem
  move={ move }
  key={ key }
  active={ move === props.active }
  />)
  return <div className="flex flex-col px-4">
    {items}
  </div>
}

export function RepertoireNavigator ({ repertoire, line }) {
  const walker = new RepertoireWalker(repertoire, line)

  return <div className="border border-black h-full flex flex-col">
    <div className="w-full border-b border-gray-500 px-4 py-2 font-bold">
      Explorateur
    </div>
    <div className="flex overflow-auto mx-4 flex-grow">
      { walker.preline().map((san, key) => <MoveColumn moves={ [san] } active={ san } key={ key } />)}
      <MoveColumn moves={ Array.from(walker.alternatives(walker.line)) } active={ walker.current() } />
      <MoveColumn moves={ Array.from(walker.suggestions(walker.line)) } />
    </div>
  </div>
}
