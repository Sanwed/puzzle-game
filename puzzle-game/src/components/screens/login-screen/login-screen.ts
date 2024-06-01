import "./login-screen.css";

import { id } from "../../constants/constants";
import MenuScreen from "../menu-screen/menu-screen";

class LoginScreen {
  private menuScreen: MenuScreen;

  constructor(private container: HTMLElement) {
    this.menuScreen = new MenuScreen(this.container);
  }

  private createElements = () => {
    const container = document.createElement("div");
    container.classList.add("login-screen", "full-screen", "screen");
    this.container.append(container);

    const form = document.createElement("form");
    container.append(form);

    const message = document.createElement("span");
    message.classList.add("form-message");
    message.textContent = "All fields must begin with a capital letter";
    form.append(message);

    const nameLabel = document.createElement("label");
    form.addEventListener("submit", this.changeToMenuScreen);
    form.append(nameLabel);

    const namePlaceholder = document.createElement("span");
    nameLabel.append(namePlaceholder);

    const nameInput = document.createElement("input");
    nameInput.setAttribute("placeholder", "Enter your name");
    nameInput.setAttribute("required", "true");
    nameInput.setAttribute("id", "name-input");
    nameLabel.append(nameInput);

    const surnameLabel = document.createElement("label");
    form.append(surnameLabel);

    const surnamePlaceholder = document.createElement("span");
    surnameLabel.append(surnamePlaceholder);

    const surnameInput = document.createElement("input");
    surnameInput.setAttribute("placeholder", "Enter your surname");
    surnameInput.setAttribute("required", "true");
    surnameInput.setAttribute("id", "surname-input");
    surnameLabel.append(surnameInput);

    const button = document.createElement("button");
    button.classList.add("login-screen-btn");
    button.textContent = "Login";
    form.append(button);
  };

  private onLogoutButtonClick = () => {
    localStorage.removeItem(`${id}-name`);
    localStorage.removeItem(`${id}-surname`);

    this.container.style.transform = "translateY(-100vh)";

    setTimeout(() => {
      this.menuScreen.remove();
    }, 1000);

    const btn = document.querySelector(".logout") as HTMLButtonElement;
    btn.remove();
  };

  private changeToMenuScreen = (evt: Event) => {
    function isValidName(name: string, minLength: number): boolean {
      return !(
        name.length > 8 ||
        name.length < minLength ||
        !/[a-zA-Z-]/.test(name) ||
        !/[A-Z]/.test(name[0])
      );
    }

    evt.preventDefault();
    const inputName = document.querySelector("#name-input") as HTMLInputElement;
    const name = inputName.value;

    const inputSurname = document.querySelector(
      "#surname-input",
    ) as HTMLInputElement;
    const surname = inputSurname.value;
    if (isValidName(name, 3)) {
      localStorage.setItem(`${id}-name`, name);

      if (isValidName(surname, 4)) {
        localStorage.setItem(`${id}-surname`, surname);
        this.menuScreen.init();
        this.container.style.transform = "translateY(-200vh)";

        inputName.value = "";
        inputSurname.value = "";

        const logoutButton = document.createElement("button");
        logoutButton.classList.add("logout");
        logoutButton.textContent = "Log out";
        logoutButton.addEventListener("click", this.onLogoutButtonClick);
        document.body.append(logoutButton);
      } else {
        inputName.style.outline = "none";
        inputSurname.style.outline = "1px solid #f00";
      }
    } else {
      inputName.style.outline = "1px solid #f00";
    }
  };

  public init = () => {
    this.createElements();
  };
}

export default LoginScreen;
