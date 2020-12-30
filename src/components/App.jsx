import React, { useCallback, useEffect, useState } from 'react'
import { Chessground } from './Chessground.jsx'
import { RepertoireNavigator } from './RepertoireNavigator.jsx'
import Chess from 'chess.js'
import { RepertoireWalker } from '../../lib/RepertoireWalker.js'
import repertoire from '../repertoire.js'
import { Comments } from './Comments.jsx'
import { OpeningRepertoire } from 'corf'

export function App () {
  const [ chess, _ ] = useState(new Chess())
  const [ line, setLine ] = useState([])
  const [comments, setComments] = useState(null)
  const storedComments = repertoire.at(line)?.node?.meta?.comments ?? ''
  if (comments !== storedComments) {
    setComments(storedComments)
  }

  const onMove = useCallback(() => {
    setLine(chess.history())
  })

  useEffect(() => {
    function onKeyDown (e) {
      if (e.key.startsWith('Arrow')) {
        const direction = e.key.replace('Arrow', '').toLowerCase()
        const walker = new RepertoireWalker(repertoire, chess.history())
        walker.move(direction)
        chess.reset()
        for (const san of walker.line) {
          chess.move(san)
        }
        setLine(walker.line)
      }
    }
    
    document.body.addEventListener('keydown', onKeyDown)
    
    // clear
    return () => {
      document.body.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  const onCommentChange = useCallback(e => {
    // TODO: debounce
    const value = e.target.value
    setComments(value)
    const node = repertoire.at(line)?.node
    if (node) {
      node.meta.comments = value
    } else {
      repertoire.add({
        line,
        meta: {
          comments: value
        }
      })
    }
    localStorage.setItem('repertoire', repertoire.toJSON())
  })

  const onJSONChange = useCallback(e => {
    const value = e.target.value
    repertoire.tree = OpeningRepertoire.fromJSON(value).tree
    localStorage.setItem('repertoire', value)
  })

  const removeLine = useCallback(e => {
    const base = repertoire.at(line)
    if (base === null) return
    const parent = repertoire.at(line.slice(0, -1))
    if (parent === null) throw new Error('Cannot remove root')
    parent.children.delete(line.slice(-1)[0])
    setComments('')
    localStorage.setItem('repertoire', repertoire.toJSON())
  })

  return <div className="container mx-auto py-8">
    <div className="grid grid-cols-2">
      <div className="flex flex-col">
        <div className="mx-auto mb-8">
          <Chessground chess={ chess } onMove={ onMove } />
        </div>
        <div>
          <textarea className="w-full border border-black p-2" value={ repertoire.toJSON() } onChange={ onJSONChange }></textarea>
        </div>
      </div>
      <div>
        <div className="mb-4">
          <RepertoireNavigator repertoire={ repertoire } line={ line } />
        </div>
        <div className="border border-black p-2">
          <div className="mb-4">
            <Comments comments={ comments } onChange={ onCommentChange }></Comments>
          </div>
          <div>
            <button className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-500" onClick={ removeLine }>Supprimer la variante</button>
          </div>
        </div>
      </div>
    </div>
  </div>
}
