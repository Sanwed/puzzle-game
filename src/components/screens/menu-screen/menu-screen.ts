import "./menu-screen.css";

import LevelSelect from "../../game/level-select/level-select";

class MenuScreen {
  private readonly levelSelect: LevelSelect;
  private isManuallyToggled = false;

  constructor(private readonly container: HTMLElement) {
    this.levelSelect = new LevelSelect();
  }

  private handleMouseMove = (event: MouseEvent) => {
    if (this.isManuallyToggled) return;

    const pieces = document.querySelector(".pieces") as HTMLElement;
    if (!pieces) return;

    const threshold = window.innerHeight - 100;
    if (event.clientY >= threshold) {
      pieces.classList.add("visible");
    } else {
      pieces.classList.remove("visible");
    }
  };

  private handleKeyDown = (event: KeyboardEvent) => {
    if (event.code === "Space") {
      event.preventDefault();
      const pieces = document.querySelector(".pieces") as HTMLElement;
      if (!pieces) return;

      pieces.classList.toggle("visible");
      this.isManuallyToggled = pieces.classList.contains("visible");
    }
  };

  private readonly createElements = () => {
    const container = document.createElement("div");
    container.classList.add("menu-screen", "full-screen", "screen");
    this.container.append(container);
    const phrase = document.createElement("div");
    phrase.classList.add("phrase");
    container.append(phrase);

    const numbers = document.createElement("div");
    numbers.classList.add("numbers");
    for (let i = 1; i <= 10; i++) {
      const num = document.createElement("span");
      num.textContent = `${i}`;
      numbers.append(num);
    }
    container.append(numbers);

    const game = document.createElement("div");
    game.classList.add("game");
    container.append(game);

    const pieces = document.createElement("div");
    pieces.classList.add("pieces");

    const tileContainer = document.createElement("div");
    tileContainer.classList.add("tile-container");
    pieces.append(tileContainer);

    const checkBtn = document.createElement("button");
    checkBtn.classList.add("check-button");
    checkBtn.textContent = "Check";
    pieces.append(checkBtn);

    container.append(pieces);
  };

  public init = () => {
    this.createElements();
    this.levelSelect.init();

    window.addEventListener("mousemove", this.handleMouseMove);
    window.addEventListener("keydown", this.handleKeyDown);
  };

  public remove = () => {
    const menuScreen = document.querySelector(".menu-screen") as HTMLElement;
    menuScreen.remove();

    window.removeEventListener("mousemove", this.handleMouseMove);
    window.removeEventListener("keydown", this.handleKeyDown);
  };
}

export default MenuScreen;
