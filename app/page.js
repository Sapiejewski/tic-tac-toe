"use client"
import { useState, useEffect } from "react"
import "./App.css"

function Square({ value, onSquareClick }) {
	return (
		<button className="square" onClick={onSquareClick}>
			{value}
		</button>
	)
}

function Board({ xIsNext, squares, onPlay }) {
	function handleClick(i) {
		if (calculateWinner(squares) || squares[i]) {
			return
		}
		const nextSquares = squares.slice()
		if (xIsNext) {
			nextSquares[i] = "X"
		} else {
			nextSquares[i] = "O"
		}
		onPlay(nextSquares)
	}

	const winner = calculateWinner(squares)
	let status
	if (winner) {
		status = "Winner: " + winner
	} else if (isBoardFull(squares)) {
		status = "It's a tie!"
	} else {
		status = "Next player: " + (xIsNext ? "X" : "O")
	}

	return (
		<>
			<div className="status">{status}</div>
			<div className="board-row">
				<Square value={squares[0]} onSquareClick={() => handleClick(0)} />
				<Square value={squares[1]} onSquareClick={() => handleClick(1)} />
				<Square value={squares[2]} onSquareClick={() => handleClick(2)} />
			</div>
			<div className="board-row">
				<Square value={squares[3]} onSquareClick={() => handleClick(3)} />
				<Square value={squares[4]} onSquareClick={() => handleClick(4)} />
				<Square value={squares[5]} onSquareClick={() => handleClick(5)} />
			</div>
			<div className="board-row">
				<Square value={squares[6]} onSquareClick={() => handleClick(6)} />
				<Square value={squares[7]} onSquareClick={() => handleClick(7)} />
				<Square value={squares[8]} onSquareClick={() => handleClick(8)} />
			</div>
		</>
	)
}

export default function Game() {
	const [history, setHistory] = useState([Array(9).fill(null)])
	const [currentMove, setCurrentMove] = useState(0)
	const [mode, setMode] = useState("friend")
	const [showRestart, setShowRestart] = useState(false)

	const xIsNext = currentMove % 2 === 0
	const currentSquares = history[currentMove]

	useEffect(() => {
		if (mode === "computer" && !xIsNext) {
			setTimeout(() => {
				const availableMoves = currentSquares.reduce((acc, val, index) => {
					if (!val) acc.push(index)
					return acc
				}, [])
				const randomIndex = Math.floor(Math.random() * availableMoves.length)
				const computerMove = availableMoves[randomIndex]
				const nextSquares = currentSquares.slice()
				nextSquares[computerMove] = "O"
				handlePlay(nextSquares)
			}, 50)
		}
	}, [mode, xIsNext, currentSquares])

	function handlePlay(nextSquares) {
		const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]
		setHistory(nextHistory)
		setCurrentMove(nextHistory.length - 1)
	}

	function jumpTo(nextMove) {
		setCurrentMove(nextMove)
	}

	function handleModeChange(newMode) {
		setMode(newMode)
		setHistory([Array(9).fill(null)])
		setCurrentMove(0)
		setShowRestart(false) // Reset restart button
	}

	function isBoardFull(squares) {
		return squares.every(square => square !== null)
	}

	const moves = history.map((squares, move) => {
		const description = move ? `Go to move #${move}` : "Go to game start"
		return (
			<li key={move}>
				<button onClick={() => jumpTo(move)}>{description}</button>
			</li>
		)
	})

	const handleRestart = () => {
		setHistory([Array(9).fill(null)])
		setCurrentMove(0)
		setShowRestart(false)
	}

	useEffect(() => {
		if (!calculateWinner(currentSquares) && isBoardFull(currentSquares)) {
			setShowRestart(true)
		} else if (calculateWinner(currentSquares)) {
			setShowRestart(true)
		} else {
			setShowRestart(false)
		}
	}, [currentSquares])

	return (
		<div className="game">
			<div className="game-options">
				<button
					className={mode === "friend" ? "button" : "button2"}
					onClick={() => handleModeChange("friend")}
					disabled={mode === "friend"}>
					Play with Friend
				</button>
				<button
					className={mode === "computer" ? "button" : "button2"}
					onClick={() => handleModeChange("computer")}
					disabled={mode === "computer"}>
					Play with Computer
				</button>
				{showRestart && <button className="restart"
        onClick={handleRestart}>Restart</button>}
			</div>
			<div className="game-board">
				<Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
			</div>
		</div>
	)
}

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
	]
	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i]
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return squares[a]
		}
	}
	return null
}
function isBoardFull(squares) {
	return squares.every(square => square !== null)
}
