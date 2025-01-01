import { ArrowMatchingGame } from "./ArrowMatchingGame.ts";

console.log('App script loading...');

/**
 * Singleton class responsible for managing the game lifecycle.
 * Provides methods for initializing the game, setting up game controls,
 * starting the game, and handling errors.
 */
class GameManager {
  /**
   * Private static instance of the GameManager class.
   * Ensures only one instance of the class is created.
   */
  private static instance: GameManager | null = null;

  /**
   * Instance of the ArrowMatchingGame class.
   * Represents the game being managed.
   */
  private gameInstance: ArrowMatchingGame | null = null;

  /**
   * Reference to the start button HTML element.
   * Used to attach event listeners and update button state.
   */
  private startButton: HTMLButtonElement | null = null;

  /**
   * Private constructor to prevent direct instantiation.
   * Initializes the game by setting up controls.
   */
  private constructor() {
    this.initializeGame();
  }

  /**
   * Retrieve the singleton instance of GameManager.
   * Creates a new instance if one does not exist.
   * @returns {GameManager} The singleton instance of GameManager.
   */
  public static getInstance(): GameManager {
    if (!GameManager.instance) {
      GameManager.instance = new GameManager();
    }
    return GameManager.instance;
  }

  /**
   * Initialize the game by setting up controls.
   * Ensures the DOM is fully loaded before proceeding.
   */
  private initializeGame(): void {
    // Ensure DOM is fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', this.setupGameControls.bind(this));
    } else {
      this.setupGameControls();
    }
  }

  /**
   * Set up game controls and event listeners.
   * Retrieves the start button element and attaches a click event listener.
   * Also adds a global error handler.
   */
  private setupGameControls(): void {
    this.startButton = document.getElementById('start-button') as HTMLButtonElement;
    
    if (!this.startButton) {
      console.error('Start button not found!');
      return;
    }

    this.startButton.addEventListener('click', this.startGame.bind(this));
  }

  /**
   * Start the game by creating an instance of ArrowMatchingGame.
   * Disables the start button to prevent multiple game instances.
   */
  private startGame(): void {
    try {
      if (!this.gameInstance) {
        this.gameInstance = new ArrowMatchingGame();
        this.startButton?.setAttribute('disabled', 'true');
        this.gameInstance.updateLeaderboard();
      }
    } catch (error) {
      this.handleGameError(error);
    }
  }

  /**
   * Handle errors during game initialization.
   * Logs error details and stack trace to the console.
   * @param {unknown} error The error that occurred during game initialization.
   */
  private handleGameError(error: unknown): void {
    console.error('Game initialization error:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      console.error('Stack trace:', error.stack);
    }
  }

  /**
   * Handle global errors.
   * Logs error details to the console.
   * @param {ErrorEvent} event The error event that occurred.
   */
  private handleGlobalError(event: ErrorEvent): void {
    console.error('Global error:', event.error);
  }
}

// Initialize the game manager
GameManager.getInstance();
