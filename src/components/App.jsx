import React, { useCallback, useEffect, useState } from 'react'
import { Chessground } from './Chessground.jsx'
import { RepertoireNavigator } from './RepertoireNavigator.jsx'
import Chess from 'chess.js'
import { RepertoireWalker } from '../../lib/RepertoireWalker.js'
import repertoire from '../repertoire.js'

export function App () {
  const [ chess, _ ] = useState(new Chess())
  const [ line, setLine ] = useState([])

  const onMove = useCallback(() => {
    setLine(chess.history())
  })

  useEffect(() => {
    function onKeyDown (e) {
      if (e.key.startsWith('Arrow')) {
        const direction = e.key.replace('Arrow', '').toLowerCase()
        const walker = new RepertoireWalker(repertoire, chess.history())
        walker.move(direction)
        setLine(walker.line)
        chess.reset()
        for (const san of walker.line) {
          chess.move(san)
        }
        onMove()
      }
    }

    document.body.addEventListener('keydown', onKeyDown)

    // clear
    return () => {
      document.body.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  return <div className="container mx-auto py-8">
    <div className="grid grid-cols-2">
      <div className="flex">
        <div className="mx-auto">
          <Chessground chess={ chess } onMove={ onMove } />
        </div>
      </div>
      <div>
        <RepertoireNavigator repertoire={ repertoire } line={ line } />
      </div>
    </div>
  </div>
}
