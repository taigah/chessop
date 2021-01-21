import React from 'react'
import PropTypes from 'prop-types'
import { Chessground as NativeChessground } from 'chessground'

export class Chessground extends React.Component {

  static propTypes = {
    fen: PropTypes.string,
    lastMove: PropTypes.array,
    turnColor: PropTypes.string,
    shapes: PropTypes.any, // TODO
    onMove: PropTypes.func,
    onDrawableChange: PropTypes.func,
    check: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    orientation: PropTypes.string,
    movable: PropTypes.any, // TODO

    // selected: PropTypes.string,
    // coordinates: PropTypes.bool,
    // autoCastle: PropTypes.bool,
    // viewOnly: PropTypes.bool,
    // disableContextMenu: PropTypes.bool,
    // resizable: PropTypes.bool,
    // addPieceZIndex: PropTypes.bool,
    // highlight: PropTypes.object,
    // animation: PropTypes.object,
    // premovable: PropTypes.object,
    // predroppable: PropTypes.object,
    // draggable: PropTypes.object,
    // selectable: PropTypes.object,
    // onChange: PropTypes.func,
    // onDropNewPiece: PropTypes.func,
    // onSelect: PropTypes.func,
    // items: PropTypes.object,
    // drawable: PropTypes.object
  }

  componentDidMount() {
    /** @type {import('chessground/config').Config} */
    const config = {
      fen: this.props.fen,
      lastMove: this.props.lastMove,
      turnColor: this.props.turnColor,
      check: this.props.check,
      orientation: this.props.orientation ?? 'white',
      movable: this.props.movable,
      drawable: {
        eraseOnClick: false,
        onChange: this.props.onDrawableChange
      },
      events: {
        move: this.props.onMove,
      },
    }

    this.cg = NativeChessground(this.el, config)
    this.cg.setShapes(this.props.shapes)
  }

  componentWillReceiveProps(nextProps) {
    /** @type {import('chessground/config').Config} */
    const changes = {}

    const dynamicProps = [
      'fen', 'lastMove', 'turnColor', 'check', 'orientation', 'movable'
    ]

    for (const prop of dynamicProps) {
      if (this.props[prop] !== nextProps[prop]) {
        changes[prop] = nextProps[prop]
      }
    }
    
    changes.drawable = {
      eraseOnClick: false,
    }

    this.cg.set(changes)

    if (this.props.shapes !== nextProps.shapes) {
      this.cg.setShapes(nextProps.shapes)
    }
  }

  componentWillUnmount() {
    this.cg.destroy()
  }

  render() {
    const props = { style: { ...this.props.style } }
    return <div ref={el => this.el = el} {...props} />
  }
}
