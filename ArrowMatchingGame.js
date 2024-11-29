// ArrowMatchingGame class controls the game logic for the Arrow Matching Game.
// It manages the game state, score, timer, and user interactions.
export class ArrowMatchingGame {
    /**
     * Initializes the game state variables and sets up event listeners.
     */
    constructor() {
        // Initialize game state variables
        this.score = 0;
        this.timeLeft = 60;
        this.isGameRunning = false;
        this.arrows = ['↑', '↓', '←', '→'];
        this.currentArrow = '';
        this.timerInterval = null;
        // DOM elements for displaying game info
        this.arrowDisplay = document.getElementById('arrow-display');
        this.scoreDisplay = document.getElementById('score');
        this.timerDisplay = document.getElementById('timer');
        this.leaderboardEntries = document.getElementById('leaderboard-entries');
        this.setupEventListeners();
    }

    /**
     * Sets up event listeners for user input.
     */
    setupEventListeners() {
        document.addEventListener('keydown', (event) => {
            if (!this.isGameRunning) {
                this.startGame();
                return;
            }
            this.handleKeyPress(event.key);
        });
    }

    /**
     * Starts the game and initializes the game state.
     */
    startGame() {
        this.isGameRunning = true;
        this.score = 0;
        this.timeLeft = 60;
        this.updateScore();
        this.startTimer();
        this.showNextArrow();
    }

    /**
     * Handles key press events and updates score if correct arrow is pressed.
     * @param {string} key - The key pressed by the user.
     */
    handleKeyPress(key) {
        const keyToArrow = {
            'ArrowUp': '↑',
            'ArrowDown': '↓',
            'ArrowLeft': '←',
            'ArrowRight': '→'
        };

        if (keyToArrow[key] === this.currentArrow) {
            this.score += 10;
            this.updateScore();
            this.showNextArrow();
        }
    }

    /**
     * Displays the next random arrow.
     */
    showNextArrow() {
        const randomIndex = Math.floor(Math.random() * this.arrows.length);
        this.currentArrow = this.arrows[randomIndex];
        this.arrowDisplay.textContent = this.currentArrow;
    }

    /**
     * Updates the score display.
     */
    updateScore() {
        this.scoreDisplay.textContent = this.score;
    }

    /**
     * Starts the countdown timer.
     */
    startTimer() {
        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            this.timerDisplay.textContent = this.timeLeft;
            
            if (this.timeLeft <= 0) {
                this.endGame();
            }
        }, 1000);
    }

    /**
     * Ends the game, saves the score, and updates the leaderboard.
     */
    endGame() {
        clearInterval(this.timerInterval);
        this.isGameRunning = false;
        this.saveScore();
        alert(`Game Over! Your score: ${this.score}`);
    }

    /**
     * Saves the current score to local storage and updates leaderboard.
     */
    saveScore() {
        const scores = JSON.parse(localStorage.getItem('arrowGameScores') || '[]');
        scores.push(this.score);
        scores.sort((a, b) => b - a);
        localStorage.setItem('arrowGameScores', JSON.stringify(scores.slice(0, 5)));
        this.updateLeaderboard();
    }

    /**
     * Updates the leaderboard display with top scores.
     */
    updateLeaderboard() {
        const scores = JSON.parse(localStorage.getItem('arrowGameScores') || '[]');
        this.leaderboardEntries.innerHTML = scores
            .map((score, index) => `
                <div class="leaderboard-entry">
                    <span>#${index + 1}</span>
                    <span>${score}</span>
                </div>
            `)
            .join('');
    }
}
