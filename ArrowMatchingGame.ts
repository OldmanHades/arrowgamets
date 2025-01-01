export class ArrowMatchingGame {
      private score: number = 0;
      private timeLeft: number = 60;
      private isGameRunning: boolean = false;
      private arrows: string[] = ['↑', '↓', '←', '→'];
      private currentArrow: string = '';
      private timerInterval: number | null = null;

      private arrowDisplay!: HTMLElement;
      private scoreDisplay!: HTMLElement;
      private timerDisplay!: HTMLElement;
      private leaderboardEntries!: HTMLElement;
      private startButton!: HTMLButtonElement;

      constructor() {
        try {
          this.initializeDOMElements();
          this.updateLeaderboard();
          this.setupKeyboardControls();
        } catch (error) {
          this.handleGameError(error);
        }
      }

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

      private setupKeyboardControls(): void {
        document.addEventListener('keydown', this.handleKeyPress.bind(this));
      }

      private startGame(): void {
        if (this.isGameRunning) return;

        this.resetGame();
      }

      private resetGame(): void {
        this.score = 0;
        this.timeLeft = 60;
        this.isGameRunning = true;
        
        this.updateScore();
        this.startTimer();
        this.showNextArrow();
        
        this.startButton.disabled = true;
      }

      private startTimer(): void {
        this.stopTimer();
        
        this.timerInterval = globalThis.setInterval(() => {
          this.timeLeft--;
          this.timerDisplay.textContent = this.timeLeft.toString();
          
          if (this.timeLeft <= 0) {
            this.endGame();
          }
        }, 1000);
      }

      private stopTimer(): void {
        if (this.timerInterval) {
          clearInterval(this.timerInterval);
          this.timerInterval = null;
        }
      }

      private showNextArrow(): void {
        const randomIndex = Math.floor(Math.random() * this.arrows.length);
        this.currentArrow = this.arrows[randomIndex];
        this.arrowDisplay.textContent = this.currentArrow;
      }

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

      private updateScore(): void {
        this.scoreDisplay.textContent = this.score.toString();
      }

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

      private handleGameError(error: unknown): void {
        console.error('Game initialization error:', error);
        if (error instanceof Error) {
          alert(`Game Error: ${error.message}`);
        }
      }
    }
