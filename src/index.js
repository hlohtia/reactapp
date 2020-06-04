import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
function Square(props) {    
      return (
        <button className="square" onClick={props.onClick}>   
          {props.value} {/*passing a prop- numbers onto the board, display current state's value when clicked*/}
        </button>
      );
    }
  
  class Board extends React.Component {
    renderSquare(i) {
      return (
        <Square 
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
        />
        ); //each square receives value prop
    }
  
    render() {
      return (
        <div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          history: [{
            squares: Array(9).fill(null),
          }],
          stepNumber: 0,
          xIsNext: true
        };
      }
    handleClick(i) { //able to fill the squares, but the state is now stored in Board component (determine winner)
        const history = this.state.history.slice(0, this.state.stepNumber + 1); //throws away future history if you make a change at prev point
        const current = history[history.length - 1];
        const squares = current.squares.slice(); //create a copy of the squares array to modify
        if (calculateWinner(squares) || squares[i]) { //ignores click if there is a winner or if the square is filled
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext, //flips value
        });
      }  
    jumpTo(step){
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0, //set xIsNext to true if the number that we’re changing stepNumber to is even
        });
    }
      render() { //use the most recent history entry to determine and display the game’s status
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        const moves = history.map((step,move) =>{ //maps the history of moves
            const desc = move ?
                'Go to move #' + move:
                'Go to game start';
            return(
                //list item that contains button to call jumpTo through onClick
                <li key={move}> 
                <button onClick={() => this.jumpTo(move)}>{desc}</button> 
              </li>
            );
        });
        let status;
        if (winner) {
          status = 'Winner: ' + winner;
        } else {
          status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
        return (
        <div className="game">
          <div className="game-board">
            <Board 
                squares={current.squares}
                onClick={(i) => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );

  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) { //returns X, O, or null
        return squares[a];
      }
    }
    return null;
  }