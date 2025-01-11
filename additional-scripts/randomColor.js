// Simple color randomizer

let currentColor = "#0095DD";

function randomChangeColor() {
    const letters = '0123456789ABCDEF';
    currentColor = '#';
    for (let i = 0; i < 6; i++) {
        currentColor += letters[Math.floor(Math.random() * 16)];
    }
}