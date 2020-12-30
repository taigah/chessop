import React, { useCallback } from 'react'

export function Comments ({ comments, onChange }) {
  const onKeyDown = useCallback((e) => {
    if (e.key.startsWith('Arrow')) {
      e.stopPropagation()
    }
  })

  return <>
    <div className="font-bold">Commentaires</div>
    <textarea className="block w-full border border-gray-500 p-2" value={ comments } onChange={ onChange } onKeyDown={ onKeyDown }></textarea>
  </>
}

