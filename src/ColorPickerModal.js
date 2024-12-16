import React from 'react';
import './ColorPickerModal.css';

function ColorPickerModal({ availableColors, playerOneColor, playerTwoColor, onColorSelect, onClose }) {
    return (
        <div className="modal">
            <h3>Choose Player Colors</h3>
            <div className="color-options">
                {/* Player One Color Picker */}
                <div>
                    <h4>Player One</h4>
                    {availableColors.map((color) => (
                        <label
                            key={color}
                            className={`radio-label ${color === playerTwoColor ? 'disabled' : ''}`}
                        >
                            <input
                                type="radio"
                                name="playerOneColor"
                                value={color}
                                checked={playerOneColor === color}
                                onChange={() => onColorSelect(color, 'playerOne')}
                                disabled={color === playerTwoColor} // Prevent selection if taken by Player Two
                            />
                            {color}
                        </label>
                    ))}
                </div>

                {/* Player Two Color Picker */}
                <div>
                    <h4>Player Two</h4>
                    {availableColors.map((color) => (
                        <label
                            key={color}
                            className={`radio-label ${color === playerOneColor ? 'disabled' : ''}`}
                        >
                            <input
                                type="radio"
                                name="playerTwoColor"
                                value={color}
                                checked={playerTwoColor === color}
                                onChange={() => onColorSelect(color, 'playerTwo')}
                                disabled={color === playerOneColor} // Prevent selection if taken by Player One
                            />
                            {color}
                        </label>
                    ))}
                </div>
            </div>
            <button className="close-button" onClick={onClose}>
                Close
            </button>
        </div>
    );
}

export default ColorPickerModal;
