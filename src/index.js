import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props) {
    return (
        <button
            id={props.id}
            className="square"
            onClick={props.onClick}
        >
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                id={'piece'+i}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        // render a 3x3 chessboard
        return (
            <div>
                {[...Array(3).keys()].map((x) => (
                        <div key={'x' + x} className="board-row">
                            {[...Array(3).keys()].map((y) => this.renderSquare(x * 3 + y))}
                        </div>
                    )
                )}
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
                x: 0, // x of piece last time (FROM 1)
                y: 0, // y of piece last time (FROM 1)
            }],
            step: 0, // number of moves
            xIsNext: true, // the next piece is X (or O)
            displaySort: 'asc', // order of history list
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.step + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                x: parseInt(i / 3) + 1,
                y: i % 3 + 1,
            }]),
            step: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(index) {
        this.setState({
            step: index,
            xIsNext: (index % 2) === 0,
        });
    }

    historyButton(value, index, current) {

        [...Array(9).keys()].map(value => {
            if(document.getElementById('piece' + value)) {
                document.getElementById('piece' + value).style.color = '';
            }
        });

        const desc = index ?
            'Go to move #' + index + ' @(' + value.x + ', ' + value.y + ')' :
            'Go to game start';

        return (
            <li key={index}>
                <button onClick={() => this.jumpTo(index)}>
                    {value === current ? <b>{desc}</b> : desc}
                </button>
            </li>
        )
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.step];

        let moves;
        if (this.state.displaySort === 'desc') {
            const reHistory = history.slice().reverse();
            moves = reHistory.map((value, index) => {
                index = reHistory.length - index - 1;
                return this.historyButton(value, index, current);
            });
        } else {
            moves = history.map((value, index) => {
                return this.historyButton(value, index, current);
            });
        }

        const winner = calculateWinner(current.squares);
        let status;
        if (winner) {
            status = 'Winner: ' + winner.name;
            winner.position.map(value => {
                    document.getElementById('piece' + value).style.color = '#2ae0c8';
            });
        } else if (this.state.step === 9) {
            status = 'Draw'
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
                <div>
                    <select
                        value={this.state.displaySort}
                        onChange={(event) => {
                            this.setState({
                                displaySort: event.target.value,
                            });
                        }}>
                        <option value='asc'>Asc</option>
                        <option value='desc'>Desc</option>
                    </select>
                </div>
            </div>
        );
    }
}

// return winner
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
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return {
                name: squares[a],
                position: lines[i],
            };
        }
    }
    return null;
}

// ========================================

ReactDOM.render(
    <Game/>,
    document.getElementById('root')
);

