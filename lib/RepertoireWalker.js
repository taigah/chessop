export class RepertoireWalker {

  /**
   * 
   * @param {import('corf').OpeningRepertoire} repertoire 
   * @param {import('corf').Line} line 
   */
  constructor (repertoire, line = []) {
    this.repertoire = repertoire
    this.line = line
  }

  setLine (line) {
    this.line = line
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
  }

  moveRight () {
    const { value } = this.suggestions(this.line).next()
    if (value !== undefined) {
      this.line.push(value)
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
      return
    }
  }

  move (direction) {
    switch (direction) {
      case 'up':
        this.moveUp()
        break
      case 'right':
        this.moveRight()
        break
      case 'down':
        this.moveDown()
        break
      case 'left':
        this.moveLeft()
        break
      default:
        throw new Error(`Invalid direction '${direction}'`)
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
}
