import React, { useCallback, useEffect, useMemo, useReducer, useState } from 'react'
import { Chessground } from './Chessground.jsx'
import 'react-chessground/dist/styles/chessground.css'
import Chess from 'chess.js'
import { repertoire as localRepertoire } from '../repertoire.js'

const initialFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

function chessReducer (chess, action) {
  action(chess)
  return Object.assign({}, chess)
}

function repertoireReducer (repertoire, action) {
  action(repertoire)
  return Object.create(repertoire)
}

export function App () {
  const [ repertoire, repertoireDispatch ] = useReducer(repertoireReducer, localRepertoire)
  const [ chess, chessDispatch ] = useReducer(chessReducer, new Chess())
  const [ shapes, setShapes ] = useState([])
  const [ orientation, setOrientation ] = useState('white')

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

  const meta = useMemo(() => {
    return repertoire.at(chess.history())?.node?.meta ?? {}
  }, [ chess, repertoire ])

  useEffect(() => {
    function onKeyDown (event) {
      if (event.key === 'ArrowLeft') {
        chessDispatch(chess => chess.undo())
      } else if (event.key === 'ArrowRight') {
        const currentNode = repertoire.at(chess.history())
        const nextMove = Array.from(currentNode.children.keys())[0]
        if (nextMove) {
          chessDispatch(chess => chess.move(nextMove))
        }
      } else if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        const history = chess.history()
        if (history.length === 0) return
        const previousNode = repertoire.at(history.slice(0, -1))
        const currentMove = history[history.length - 1]
        const alternatives = Array.from(previousNode.children.keys())
        const currentMoveIndex = alternatives.indexOf(currentMove)
        const delta = event.key === 'ArrowUp' ? 1 : -1
        const nextAlternativeIndex = (alternatives.length + currentMoveIndex + delta) % alternatives.length
        const nextAlternative = alternatives[nextAlternativeIndex]
        debugger
        chessDispatch(chess => {
          chess.undo()
          chess.move(nextAlternative)
        })
      }
    }

    document.body.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('repertoire', repertoire.toJSON())
  }, [ repertoire ])

  const onMove = useCallback((from, to)=> {
    chessDispatch(chess => chess.move({ from, to }))
  })

  const onDrawableChange = useCallback((shapes) => {
    setShapes([ ...shapes ])
  })

  const toggleOrientation = useCallback(event => {
    setOrientation(orientation === 'white' ? 'black' : 'white')
  })

  const onCommentsChange = useCallback(event => {
    const comments = event.target.value
    repertoireDispatch(() => {
      repertoire.at(chess.history()).node.meta.comments = comments
    })
  })
  
  return <div className="flex justify-center pt-8">
    <div>
      <div className="flex">
        <Chessground
          fen={ fen }
          lastMove={ lastMove }
          turnColor={ turnColor }
          check={ check }
          movable={ movable }
          shapes={ shapes }
          orientation={ orientation }
          onMove={ onMove }
          onDrawableChange={ onDrawableChange }
          />
        <div className="mx-4">
          <button
            className="px-2 border bg-blue-500 text-white rounded"
            onClick={ toggleOrientation }>Orientation</button>
        </div>
      </div>
    </div>
    <div>
      <textarea value={ meta.comments ?? '' } onChange={ onCommentsChange }></textarea>
    </div>
  </div>
}
