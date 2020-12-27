import ChessgroundRaw from 'react-chessground'
import React, { useCallback, useState } from 'react'
import 'react-chessground/dist/styles/chessground.css'

export function ChessgroundBase (props) {
  const chess = props.chess

  const onMove = useCallback((from, to) => {
    const result = chess.move({ from, to })
    if (result) {
      props.onMove()
    }
  })

  const fen = chess.fen()
  const turnColor = chess.turn() === 'w' ? 'white' : 'black'
  const check = chess.in_check() ? turnColor : ''

  let lastMove = []
  if (chess.history().length !== 0) {
    const last = chess.history({ verbose: true }).slice(-1)[0]
    lastMove = [ last.from, last.to ]
  }

  const dests = new Map()
  for (const s of chess.SQUARES) {
    const ms = chess.moves({ square: s, verbose: true })
    if (ms.length) dests.set(s, ms.map(m => m.to))
  }
  const movable = {
    free: false,
    dests,
    color: turnColor
  }

  return <ChessgroundRaw
    fen={ fen }
    movable={ movable }
    onMove={ onMove }
    check={ check }
    turnColor={ turnColor }
    lastMove={ lastMove }
  />
}

export const Chessground = React.memo(ChessgroundBase)

