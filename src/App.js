import React, { useState, useEffect } from 'react';
import './App.css';
import ColorPickerModal from './ColorPickerModal';

function App() {
    const [board, setBoard] = useState(
        Array(9).fill({ player: null, color: 'white' })
    );
    const [isPlayerOneNext, setIsPlayerOneNext] = useState(true);
    const [winner, setWinner] = useState(null);
    const [winningCombination, setWinningCombination] = useState([]);
    const [playerOneColor, setPlayerOneColor] = useState('red');
    const [playerTwoColor, setPlayerTwoColor] = useState('blue');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const AVAILABLE_COLORS = ['red', 'blue', 'green', 'yellow'];

    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6], // Diagonals
    ];

    const hasGameStarted = () => board.some((cell) => cell.player !== null);

    const handleCellClick = (index) => {
        if (board[index].player || winner) return;

        const playerColor = isPlayerOneNext ? playerOneColor : playerTwoColor;

        const updatedBoard = board.map((cell, idx) =>
            idx === index ? { player: isPlayerOneNext ? 'Player One' : 'Player Two', color: playerColor } : cell
        );

        setBoard(updatedBoard);
        checkWinner(updatedBoard);
        setIsPlayerOneNext(!isPlayerOneNext);
    };

    const checkWinner = (board) => {
        for (const combination of winningCombinations) {
            const [a, b, c] = combination;
            if (
                board[a].player &&
                board[a].player === board[b].player &&
                board[a].player === board[c].player
            ) {
                setWinner(board[a].player);
                setWinningCombination(combination);
                return;
            }
        }
        if (board.every((cell) => cell.player !== null)) {
            setWinner('Tie');
        }
    };

    const handleReset = () => {
        setBoard(Array(9).fill({ player: null, color: 'white' }));
        setIsPlayerOneNext(true);
        setWinner(null);
        setWinningCombination([]);
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleColorSelect = (color, player) => {
        if (player === 'playerOne') {
            setPlayerOneColor(color);
        } else if (player === 'playerTwo') {
            setPlayerTwoColor(color);
        }
        setIsModalOpen(false);
    };

    
    useEffect(() => {
        if (winner && winner !== 'Tie') {
            const winnerColor = winner === 'Player One' ? playerOneColor : playerTwoColor;
    
            let orderedCombination = [...winningCombination];
            console.log("Original Combination:", orderedCombination);
    
            // Check for diagonals and verticals
            if (JSON.stringify(orderedCombination) === JSON.stringify([2, 4, 6])) {
                console.log("Bottom-left to top-right diagonal: Reversing order");
                orderedCombination.reverse();
            } else if (JSON.stringify(orderedCombination) === JSON.stringify([0, 4, 8])) {
                console.log("Top-left to bottom-right diagonal: Reversing order");
                orderedCombination.reverse();
            } else if (orderedCombination[0] + 3 === orderedCombination[1] && 
                       orderedCombination[1] + 3 === orderedCombination[2]) {
                console.log("Vertical line: Reversing order for bottom-to-top animation");
                orderedCombination.reverse();
            } else {
                console.log("Horizontal line or no specific adjustment needed");
            }
    
            console.log("Adjusted Combination:", orderedCombination);
    
            // Set the initial flicker
            setBoard((prevBoard) =>
                prevBoard.map((cell, idx) =>
                    orderedCombination.includes(idx)
                        ? idx === orderedCombination[0]
                            ? { ...cell, color: 'gold' }
                            : { ...cell, color: winnerColor }
                        : cell
                )
            );
    
            let currentIndex = 0;
    
            // Start the flicker animation
            const interval = setInterval(() => {
                setBoard((prevBoard) =>
                    prevBoard.map((cell, idx) =>
                        orderedCombination.includes(idx)
                            ? idx === orderedCombination[currentIndex]
                                ? { ...cell, color: 'gold' }
                                : { ...cell, color: winnerColor }
                            : cell
                    )
                );
    
                currentIndex = (currentIndex + 1) % orderedCombination.length;
            }, 500);
    
            return () => clearInterval(interval); // Cleanup the interval
        }
    }, [winner, winningCombination, playerOneColor, playerTwoColor]);
    
    return (
        <div>
            <div className="button-controls">
                <button
                    className={`color-button ${hasGameStarted() ? 'disabled-button' : ''}`}
                    onClick={handleOpenModal}
                    disabled={hasGameStarted()}
                >
                    {hasGameStarted() ? 'Colors Locked' : 'Choose Colors'}
                </button>
            </div>

            <div className="tic-tac-toe">
                {board.map((cell, index) => (
                    <div
                        key={index}
                        className={`cell ${cell.player || winner ? 'non-clickable' : ''}`}
                        style={{ backgroundColor: cell.color }}
                        onClick={() => handleCellClick(index)}
                    ></div>
                ))}
            </div>

            <div className="game-info">
                {winner ? (
                    winner === 'Tie' ? (
                        <p>It's a Tie!</p>
                    ) : (
                        <p>{winner === 'Player One' ? 'Player One Wins!' : 'Player Two Wins!'}</p>
                    )
                ) : (
                    <p>Next Player: {isPlayerOneNext ? 'Player One' : 'Player Two'}</p>
                )}
            </div>

            <div className="reset-button">
                <button className="black-button" onClick={handleReset}>Reset Game</button>
            </div>

            {isModalOpen && (
                <ColorPickerModal
                    availableColors={AVAILABLE_COLORS}
                    onClose={() => setIsModalOpen(false)}
                    onColorSelect={handleColorSelect}
                    playerOneColor={playerOneColor}
                    playerTwoColor={playerTwoColor}
                />
            )}
        </div>
    );
}

export default App;
