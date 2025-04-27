import "./menu-screen.css";

import LevelSelect from "../../game/level-select/level-select";

class MenuScreen {
  private readonly levelSelect: LevelSelect;

  constructor(private readonly container: HTMLElement) {
    this.levelSelect = new LevelSelect();
  }

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

    const wrongText = document.createElement("span");
    wrongText.setAttribute("id", "wrong");
    container.append(wrongText);

    const buttonWrapper = document.createElement("div");
    buttonWrapper.classList.add("game-button-wrapper");
    container.append(buttonWrapper);

    const checkBtn = document.createElement("button");
    checkBtn.classList.add("check-button");
    checkBtn.textContent = "Check";
    buttonWrapper.append(checkBtn);

    const pieces = document.createElement("div");
    pieces.classList.add("pieces");
    container.append(pieces);
  };

  public init = () => {
    this.createElements();
    this.levelSelect.init();
  };

  public remove = () => {
    const menuScreen = document.querySelector(".menu-screen") as HTMLElement;
    menuScreen.remove();
  };
}

export default MenuScreen;
