import "./start-screen.css";

import MenuScreen from "../menu-screen/menu-screen";

interface GameRules {
  title: string;
  description: string;
  rules: string[];
}

class StartScreen {
  private readonly menuScreen: MenuScreen;
  private readonly gameRules: GameRules = {
    title: "Welcome to English Puzzle Game!",
    description:
      "Build English phrases and watch them transform into beautiful images!",
    rules: [
      "You will see scrambled English phrases",
      "Drag and drop words to form correct sentences",
      "Each correct phrase reveals a part of the hidden image",
      "Complete all phrases to see the full picture",
      "Learn English while having fun!",
    ],
  };

  constructor(private readonly container: HTMLElement) {
    this.menuScreen = new MenuScreen(this.container);
  }

  private readonly changeToGameScreen = (): void => {
    this.menuScreen.init();
    this.container.style.transform = "translateY(-100vh)";
  };

  private createHeader(): HTMLElement {
    const header = document.createElement("h1");

    header.textContent = this.gameRules.title;

    return header;
  }

  private createRulesList(): HTMLElement {
    const rulesList = document.createElement("ol");
    rulesList.classList.add("game-rules-list");

    this.gameRules.rules.forEach((rule) => {
      const listItem = document.createElement("li");
      listItem.textContent = rule;
      rulesList.appendChild(listItem);
    });

    return rulesList;
  }

  private createElements(): void {
    const container = document.createElement("div");
    container.classList.add("start-screen", "full-screen", "screen");
    this.container.append(container);

    const wrapper = document.createElement("div");
    wrapper.classList.add("start-screen-wrapper");
    container.append(wrapper);

    wrapper.append(this.createHeader());

    const description = document.createElement("p");
    description.textContent = this.gameRules.description;
    wrapper.append(description);

    wrapper.append(this.createRulesList());

    const button = document.createElement("button");
    button.classList.add("start-screen-btn");
    button.textContent = "Start Game";
    button.addEventListener("click", this.changeToGameScreen);
    wrapper.append(button);
  }

  public init = (): void => {
    this.createElements();
  };
}

export default StartScreen;
