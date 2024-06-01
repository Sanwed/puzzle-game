import "./start-screen.css";

import { id } from "../../constants/constants";
import LoginScreen from "../login-screen/login-screen";

class StartScreen {
  private loginScreen: LoginScreen;

  constructor(private container: HTMLElement) {
    this.loginScreen = new LoginScreen(this.container);
  }

  private changeToLoginScreen = () => {
    this.loginScreen.init();
    this.container.style.transform = "translateY(-100vh)";
  };

  private createElements = () => {
    const container = document.createElement("div");
    container.classList.add("start-screen", "full-screen", "screen");
    this.container.append(container);

    const wrapper = document.createElement("div");
    wrapper.classList.add("start-screen-wrapper");
    container.append(wrapper);

    const header = document.createElement("h1");

    if (
      localStorage.getItem(`${id}-name`) &&
      localStorage.getItem(`${id}-surname`)
    ) {
      header.textContent = `Welcome again, ${localStorage.getItem(`${id}-name`)} ${localStorage.getItem(`${id}-surname`)}!`;
    } else {
      header.textContent = "Welcome!";
    }
    wrapper.append(header);

    const paragraph = document.createElement("p");
    paragraph.textContent =
      "Here you would play a puzzle game, where you need to build English phrases, an then they will become a full image";
    wrapper.append(paragraph);

    const button = document.createElement("button");
    button.classList.add("start-screen-btn");
    button.textContent = "Start";
    button.addEventListener("click", this.changeToLoginScreen);
    wrapper.append(button);
  };

  public init = () => {
    this.createElements();
  };
}

export default StartScreen;
