import React from 'react'
import './Game.css'
class Square extends React.Component<
  { className: string; position: number; value: string; onClick: () => void },
  { value: string }
> {
  render() {
    return (
      <button
        key={this.props.position}
        className={this.props.className}
        onClick={this.props.onClick}
      >
        {this.props.value}
      </button>
    )
  }
}

class Board extends React.Component<
  {
    squares: Array<string>
    resultCellPosition: Array<number> | null
    onClick: (i: number) => void
  },
  { xIsNext: boolean }
> {
  renderSquare(i: number, className: string) {
    return (
      <Square
        key={i}
        className={className}
        position={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    )
  }
  render() {
    const squares = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
    ]
    const board = squares.map((row, index1) => (
      <div key={index1} className="board-row">
        {row.map((value1, index2) => {
          if (this.props.resultCellPosition === null) {
            return this.renderSquare(value1, 'square')
          }
          if (
            this.props.resultCellPosition.includes(
              this.getPositionByRowAndCol(index1, index2)
            )
          ) {
            return this.renderSquare(value1, 'win-square')
          }
          return this.renderSquare(value1, 'square')
        })}
      </div>
    ))
    return <div>{board}</div>
  }
  getPositionByRowAndCol(row: number, col: number): number {
    if (row === 0 && col === 0) return 0
    if (row === 0 && col === 1) return 1
    if (row === 0 && col === 2) return 2
    if (row === 1 && col === 0) return 3
    if (row === 1 && col === 1) return 4
    if (row === 1 && col === 2) return 5
    if (row === 2 && col === 0) return 6
    if (row === 2 && col === 1) return 7
    if (row === 2 && col === 2) return 8
    return 9
  }
}
type History = {
  squares: Array<string>
  checkCell: string
}
class Game extends React.Component<
  {},
  {
    history: Array<History>
    stepNumber: number
    xIsNext: boolean
    resultCellPosition: Array<number>
    sort: 'asc' | 'desc'
  }
> {
  constructor(props: Readonly<{}>) {
    super(props)
    this.state = {
      history: [
        {
          squares: Array(9).fill(this.defaultStr),
          checkCell: '',
        },
      ],
      stepNumber: 0,
      xIsNext: true,
      resultCellPosition: [],
      sort: 'asc',
    }
  }
  defaultStr: string = '-'

  jumpTo(step: number) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    })
  }
  render() {
    const history = this.state.history
    const current = history[this.state.stepNumber]
    const winner = this.calculateWinner(current.squares)
    const moves = history.map((step, move) => {
      const desc = move
        ? 'Go to move #' + move + step.checkCell
        : 'Go to game start'
      return (
        <li key={move}>
          <button
            className={this.getHistoryClass(move, this.state.stepNumber)}
            onClick={() => this.jumpTo(move)}
          >
            {desc}
          </button>
        </li>
      )
    })
    let status: string
    let resultCellPosition: Array<number> = []
    if (winner) {
      status = 'Winner: ' + winner
      resultCellPosition = this.getWinCellPosition(current.squares)
    } else if (this.isFinished(current.squares)) {
      status = 'Draw'
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O')
    }
    let sortButton: JSX.Element
    let displayMoves: JSX.Element[]
    if (this.state.sort === 'asc') {
      displayMoves = moves
      sortButton = (
        <div className="sort-button-area">
          <button className="sort-button" onClick={() => this.switchSort()}>
            {this.state.sort}
          </button>
        </div>
      )
    } else {
      displayMoves = moves.reverse()
      sortButton = (
        <div className="sort-button-area">
          <button className="sort-button-2" onClick={() => this.switchSort()}>
            {this.state.sort}
          </button>
        </div>
      )
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            resultCellPosition={resultCellPosition}
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div className="game-status">
            <p>{status}</p>
          </div>
          {sortButton}
          <ol>{displayMoves}</ol>
        </div>
      </div>
    )
  }
  switchSort() {
    if (this.state.sort === 'asc') {
      this.setState({ sort: 'desc' })
      this.render()
      return
    }
    this.setState({ sort: 'asc' })
    this.render()
    return
  }
  getHistoryClass(move: number, stepNumber: number) {
    if (move === stepNumber) {
      return 'selected-history'
    }
    return 'game-history'
  }
  calculateWinner(squares: Array<string>) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ]
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i]
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c] &&
        squares[a] !== this.defaultStr
      ) {
        return squares[a]
      }
    }
    return null
  }
  getWinCellPosition(squares: Array<string>) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ]
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i]
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c] &&
        squares[a] !== this.defaultStr
      ) {
        return lines[i]
      }
    }
    return []
  }
  handleClick(i: number) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1)
    const current = history[history.length - 1]
    const squares = current.squares.slice()
    if (
      (this.calculateWinner(squares) !== this.defaultStr &&
        this.calculateWinner(squares) !== null) ||
      squares[i] !== this.defaultStr
    ) {
      return
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O'
    const checkCell: string = this.getCellPosition(i)
    this.setState({
      history: history.concat([
        {
          squares: squares,
          checkCell: checkCell,
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    })
  }
  getCellPosition(i: number): string {
    switch (i) {
      case 0:
        return '(0,0)'
      case 1:
        return '(0,1)'
      case 2:
        return '(0,2)'
      case 3:
        return '(1,0)'
      case 4:
        return '(1,1)'
      case 5:
        return '(1,2)'
      case 6:
        return '(2,0)'
      case 7:
        return '(2,1)'
      case 8:
        return '(2,2)'
      default:
        return 'unknown'
    }
  }
  isFinished(squares: Array<string>): boolean {
    for (const square of squares) {
      if (square !== 'X' && square !== 'O') {
        return false
      }
    }
    return true
  }
}

export default Game
