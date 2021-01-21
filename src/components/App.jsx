import React, { useCallback, useEffect, useMemo, useReducer, useState } from 'react'
import { Chessground } from './Chessground.jsx'
import 'react-chessground/dist/styles/chessground.css'
import Chess from 'chess.js'

const initialFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

function chessReducer (chess, action) {
  action(chess)
  return Object.assign({}, chess)
}

export function App () {
  const [ chess, chessDispatch ] = useReducer(chessReducer, new Chess())
  const [ shapes, setShapes ] = useState([])

  const fen = useMemo(() => {
    return chess.fen()
  }, [ chess ])

  const turnColor = useMemo(() => {
    return chess.turn() === 'w' ? 'white' : 'black'
  }, [ chess ])

  const lastMove = useMemo(() => {
    const history = chess.history({ verbose: true })
    if (history.length === 0) return undefined
    const lastMove = history[history.length - 1]
    return [ lastMove.from, lastMove.to ]
  }, [ chess ])

  const check = useMemo(() => {
    return chess.in_check() ? turnColor : undefined
  }, [ chess ])

  const movable = useMemo(() => {
    const dests = new Map()
    for (const square of chess.SQUARES) {
      const moves = chess.moves({ square, verbose: true }).map(move => move.to)
      dests.set(square, moves)
    }

    return {
      free: false,
      dests,
      color: turnColor
    }
  }, [ chess ])

  useEffect(() => {
    function onKeyDown (event) {
      if (event.key === 'ArrowLeft') {
        chessDispatch(chess => chess.undo())
      }
    }

    document.body.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  const onMove = useCallback((from, to)=> {
    chessDispatch(chess => chess.move({ from, to }))
  })

  const onDrawableChange = useCallback((shapes) => {
    setShapes([ ...shapes ])
  })

  const onClick = useCallback(event => {
    chessDispatch(chess => {
      chess.reset()
      chess.move('e4')
      chess.move('e5')
      chess.move('Nf3')
      chess.move('Nc6')
    })
  })
  
  return <div className="flex justify-center pt-8">
    <Chessground
      fen={ fen }
      lastMove={ lastMove }
      turnColor={ turnColor }
      check={ check }
      movable={ movable }
      shapes={ shapes }
      onMove={ onMove }
      onDrawableChange={ onDrawableChange }
       />
    <button onClick={ onClick }>click</button>
  </div>
}
