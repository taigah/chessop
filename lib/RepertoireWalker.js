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

  suggestions (line) {
    return this.repertoire.at(line)?.children?.keys() ?? [].values()
  }

  goto (line) {
    this.line = line
  }

}
