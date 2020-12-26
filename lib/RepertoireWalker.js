export class RepertoireWalker {

  /**
   * 
   * @param {import('corf').OpeningRepertoire} repertoire 
   * @param {import('corf').Line} line 
   */
  constructor (repertoire, line = []) {
    this.repertoire = repertoire
    this.line = line
    this.listeners = new Map()
  }

  setLine (line) {
    this.line = line
    this.emit('change')
  }

  preline () {
    return this.line.slice(0, -1)
  }

  current () {
    return this.line[this.line.length - 1]
  }

  setCurrent (move) {
    return this.line[this.line.length - 1] = move
  }

  moveLeft () {
    this.line.pop()
    this.emit('change')
  }

  moveRight () {
    const { value } = this.suggestions(this.line).next()
    if (value !== undefined) {
      this.line.push(value)
      this.emit('change')
    }
  }

  moveDown () {
    const it = this.suggestions(this.preline())
    while (true) {
      const { value } = it.next()
      if (value === undefined) break
      if (value === this.current()) {
        const { value } = it.next()
        if (value !== undefined) {
          this.setCurrent(value)
          this.emit('change')
          return
        }
        break
      }
    }
  }

  moveUp () {
    const it = this.suggestions(this.preline())
    let previousValue = undefined
    while (true) {
      const { value } = it.next()
      if (value === this.current()) break
      if (value === undefined) break
      previousValue = value
    }
    if (previousValue !== undefined) {
      this.setCurrent(previousValue)
      this.emit('change')
      return
    }
  }

  /**
   * Get alternatives for the latest move in a line
   * @param {import('corf').Line} line 
   */
  alternatives (line) {
    if (line.length === 0) return [].values()
    const suggestions = Array.from(this.suggestions(line.slice(0, -1)))
    const latest = line[line.length - 1]
    if (suggestions.includes(latest)) {
      return suggestions.values()
    } else {
      return [ ...suggestions, latest ].values()
    }
  }

  suggestions (line) {
    return this.repertoire.at(line)?.children?.keys() ?? [].values()
  }

  addEventListener (name, cb) {
    if (this.listeners.has(name)) {
      this.listeners.get(name).add(cb)
    } else {
      const listeners = new Set()
      listeners.add(cb)
      this.listeners.set(name, listeners)
    }
  }

  emit (name, value) {
    if (this.listeners.has(name)) {
      for (const listener of this.listeners.get(name)) {
        listener(value)
      }
    }
  }

}
