// ArrowMatchingGame class manages the game logic for the Arrow Matching Game.
// It handles the game state, user interactions, and DOM updates.
export class ArrowMatchingGame {
      /**
       * The current score of the game.
       */
      private score: number = 0;

      /**
       * The remaining time in seconds for the game.
       */
      private timeLeft: number = 60;

      /**
       * Flag indicating whether the game is currently running.
       */
      private isGameRunning: boolean = false;

      /**
       * Array of possible arrow characters.
       */
      private arrows: string[] = ['↑', '↓', '←', '→'];

      /**
       * The current arrow character displayed on the screen.
       */
      private currentArrow: string = '';

      /**
       * The interval ID for the countdown timer.
       */
      private timerInterval: number | null = null;

      // DOM Elements
      /**
       * The HTML element displaying the current arrow.
       */
      private arrowDisplay!: HTMLElement;

      /**
       * The HTML element displaying the current score.
       */
      private scoreDisplay!: HTMLElement;

      /**
       * The HTML element displaying the remaining time.
       */
      private timerDisplay!: HTMLElement;

      /**
       * The HTML element displaying the leaderboard entries.
       */
      private leaderboardEntries!: HTMLElement;

      /**
       * The HTML button element to start the game.
       */
      private startButton!: HTMLButtonElement;

      /**
       * Initializes the game by setting up DOM elements, keyboard controls, and starting the game.
       */
      constructor() {
        try {
          this.initializeDOMElements();
          this.setupKeyboardControls();
          this.startGame();
        } catch (error) {
          this.handleGameError(error);
        }
      }

      /**
       * Initialize DOM elements and ensure they exist.
       */
      private initializeDOMElements(): void {
        const requiredElements: { id: string, type: 'arrowDisplay' | 'scoreDisplay' | 'timerDisplay' | 'leaderboardEntries' | 'startButton' }[] = [
          { id: 'arrow-display', type: 'arrowDisplay' },
          { id: 'score', type: 'scoreDisplay' },
          { id: 'timer', type: 'timerDisplay' },
          { id: 'leaderboard-entries', type: 'leaderboardEntries' },
          { id: 'start-button', type: 'startButton' }
        ];

        requiredElements.forEach(element => {
          const domElement = document.getElementById(element.id);
          if (!domElement) {
            throw new Error(`Required element ${element.id} not found`);
          }
          if (element.type === 'startButton') {
            this[element.type] = domElement as HTMLButtonElement;
          } else {
            this[element.type] = domElement as HTMLElement;
          }
        });

        this.startButton.addEventListener('click', () => this.resetGame());
      }

      /**
       * Set up keyboard controls for the game.
       */
      private setupKeyboardControls(): void {
        document.addEventListener('keydown', this.handleKeyPress.bind(this));
      }

      /**
       * Start the game by resetting the game state.
       */
      private startGame(): void {
        if (this.isGameRunning) return;

        this.resetGame();
      }

      /**
       * Reset the game state and start the timer.
       */
      private resetGame(): void {
        this.score = 0;
        this.timeLeft = 60;
        this.isGameRunning = true;
        
        this.updateScore();
        this.startTimer();
        this.showNextArrow();
        
        // Disable start button during game
        this.startButton.disabled = true;
      }

      /**
       * Start the countdown timer for the game.
       */
      private startTimer(): void {
        this.stopTimer(); // Clear any existing timer
        
        this.timerInterval = globalThis.setInterval(() => {
          this.timeLeft--;
          this.timerDisplay.textContent = this.timeLeft.toString();
          
          if (this.timeLeft <= 0) {
            this.endGame();
          }
        }, 1000);
      }

      /**
       * Stop the countdown timer.
       */
      private stopTimer(): void {
        if (this.timerInterval) {
          clearInterval(this.timerInterval);
          this.timerInterval = null;
        }
      }

      /**
       * Display the next random arrow.
       */
      private showNextArrow(): void {
        const randomIndex = Math.floor(Math.random() * this.arrows.length);
        this.currentArrow = this.arrows[randomIndex];
        this.arrowDisplay.textContent = this.currentArrow;
      }

      /**
       * Handle key press events and update score if correct arrow is pressed.
       * @param event The KeyboardEvent object.
       */
      private handleKeyPress(event: KeyboardEvent): void {
        if (!this.isGameRunning) return;

        const keyToArrow: { [key: string]: string } = {
          'ArrowUp': '↑',
          'ArrowDown': '↓',
          'ArrowLeft': '←',
          'ArrowRight': '→'
        };

        if (keyToArrow[event.key] === this.currentArrow) {
          this.score += 10;
          this.updateScore();
          this.showNextArrow();
        }
      }

      /**
       * Update the score display.
       */
      private updateScore(): void {
        this.scoreDisplay.textContent = this.score.toString();
      }

      /**
       * End the game, save the score, and update the leaderboard.
       */
      private endGame(): void {
        this.stopTimer();
        this.isGameRunning = false;
        this.currentArrow = '';
        this.arrowDisplay.textContent = '';
        this.startButton.disabled = false;

        this.saveScore();
        this.updateLeaderboard();
        
        alert(`Game Over! Your score: ${this.score}`);
      }

      /**
       * Save the current score to local storage.
       */
      private saveScore(): void {
        const scores = JSON.parse(localStorage.getItem('arrowGameScores') || '[]');
        if (!Array.isArray(scores)) {
          console.error("Invalid data in localStorage:", scores);
          return;
        }
        scores.push(this.score);
        scores.sort((a: number, b: number) => b - a);
        localStorage.setItem('arrowGameScores', JSON.stringify(scores.slice(0, 5)));
      }

      /**
       * Update the leaderboard display with top scores.
       */
      private updateLeaderboard(): void {
        const scores = JSON.parse(localStorage.getItem('arrowGameScores') || '[]');
        if (!Array.isArray(scores)) {
          console.error("Invalid data in localStorage:", scores);
          return;
        }
        this.leaderboardEntries.innerHTML = scores
          .map((score: number, index: number) => `
              <div class="leaderboard-entry">
                  <span>#${index + 1}</span>
                  <span>${score}</span>
              </div>
          `)
          .join('');
      }

      /**
       * Handle errors during game initialization.
       * @param error The error object.
       */
      private handleGameError(error: unknown): void {
        console.error('Game initialization error:', error);
        if (error instanceof Error) {
          alert(`Game Error: ${error.message}`);
        }
      }
    }
