import "./level-select.css";

import wordsLevel1 from "../../../assets/data/wordCollectionLevel1.json";
import wordsLevel2 from "../../../assets/data/wordCollectionLevel2.json";
import wordsLevel3 from "../../../assets/data/wordCollectionLevel3.json";
import wordsLevel4 from "../../../assets/data/wordCollectionLevel4.json";
import wordsLevel5 from "../../../assets/data/wordCollectionLevel5.json";
import wordsLevel6 from "../../../assets/data/wordCollectionLevel6.json";
import { levelsCount } from "../../constants/constants";
import type { WordCollection } from "../../interfaces/interfaces";
import Puzzle from "../puzzle/puzzle";

class LevelSelect {
  private readonly puzzle: Puzzle;

  constructor() {
    this.puzzle = new Puzzle();
  }

  private readonly setRounds = (levelData: WordCollection[]) => {
    const container = document.querySelector(".round-select") as HTMLElement;
    container.innerHTML = "";

    const levelSelect = document.querySelector("#level") as HTMLSelectElement;

    const roundSelect = document.createElement("select");
    roundSelect.setAttribute("id", "round");

    for (let i = 1; i <= levelData.length; i++) {
      const option = document.createElement("option");
      const value = i < 10 ? `0${i}` : `${i}`;
      option.value = value;
      option.textContent = value;
      if (i === 1) {
        option.setAttribute("selected", "true");
      }

      roundSelect.append(option);
    }

    const roundPlaceholder = document.createElement("span");
    roundPlaceholder.textContent = "Round: ";

    container.append(roundPlaceholder, roundSelect);

    roundSelect.addEventListener("change", () => {
      switch (levelSelect.value) {
        case "1":
          this.changeLevel(wordsLevel1.rounds);
          break;
        case "2":
          this.changeLevel(wordsLevel2.rounds);
          break;
        case "3":
          this.changeLevel(wordsLevel3.rounds);
          break;
        case "4":
          this.changeLevel(wordsLevel4.rounds);
          break;
        case "5":
          this.changeLevel(wordsLevel5.rounds);
          break;
        case "6":
          this.changeLevel(wordsLevel6.rounds);
          break;
      }
    });
  };

  public nextLevel = (levelData: WordCollection[]) => {
    const levelSelect = document.querySelector("#level") as HTMLSelectElement;
    const roundSelect = document.querySelector("#round") as HTMLSelectElement;

    const levelValue = Number(levelSelect.value);
    const roundValue = Number(roundSelect.value);

    if (roundValue === levelData.length) {
      levelSelect.value = `${levelValue + 1}`;
      roundSelect.value = `${1}`;
    } else {
      roundSelect.value =
        roundValue + 1 < 10 ? `0${roundValue + 1}` : `${roundValue + 1}`;
    }

    if (levelValue === 6 && roundValue === levelData.length) {
      levelSelect.value = `${1}`;
      roundSelect.value = `${1}`;
    }

    this.changeLevel(levelData);
  };

  private readonly changeLevel = (levelData: WordCollection[]) => {
    const levelSelect = document.querySelector("#level") as HTMLSelectElement;
    const roundSelect = document.querySelector("#round") as HTMLSelectElement;

    const currLevel = levelSelect.value;
    const currRound = roundSelect.value;
    const level = levelData.find(
      (el: WordCollection) => el.levelData.id === `${currLevel}_${currRound}`,
    ) as WordCollection;

    this.puzzle.init(level, this, levelData);
  };

  private readonly createElements = () => {
    const menuScreen = document.querySelector(".menu-screen") as HTMLElement;

    const container = document.createElement("div");
    container.classList.add("level-select");
    menuScreen.prepend(container);

    const levelLabel = document.createElement("label");
    container.append(levelLabel);

    const levelPlaceholder = document.createElement("span");
    levelPlaceholder.textContent = "Level: ";
    levelLabel.append(levelPlaceholder);

    const levelSelect = document.createElement("select");
    levelSelect.setAttribute("id", "level");
    levelLabel.append(levelSelect);

    const roundLabel = document.createElement("label");
    roundLabel.classList.add("round-select");
    container.append(roundLabel);

    const roundPlaceholder = document.createElement("span");
    roundPlaceholder.textContent = "Round: ";
    roundLabel.append(roundPlaceholder);
  };

  public init = () => {
    this.createElements();
    const levelSelect = document.querySelector("#level") as HTMLSelectElement;

    for (let i = 1; i <= levelsCount; i++) {
      const option = document.createElement("option");
      option.value = `${i}`;
      option.textContent = `${i}`;
      if (i === 1) {
        option.setAttribute("selected", "true");
      }

      levelSelect.append(option);
    }

    this.setRounds(wordsLevel1.rounds);

    this.changeLevel(wordsLevel1.rounds);

    levelSelect.addEventListener("change", () => {
      switch (levelSelect.value) {
        case "1":
          this.setRounds(wordsLevel1.rounds);
          this.changeLevel(wordsLevel1.rounds);
          break;
        case "2":
          this.setRounds(wordsLevel2.rounds);
          this.changeLevel(wordsLevel2.rounds);
          break;
        case "3":
          this.setRounds(wordsLevel3.rounds);
          this.changeLevel(wordsLevel3.rounds);
          break;
        case "4":
          this.setRounds(wordsLevel4.rounds);
          this.changeLevel(wordsLevel4.rounds);
          break;
        case "5":
          this.setRounds(wordsLevel5.rounds);
          this.changeLevel(wordsLevel5.rounds);
          break;
        case "6":
          this.setRounds(wordsLevel6.rounds);
          this.changeLevel(wordsLevel6.rounds);
          break;
      }
    });
  };
}

export default LevelSelect;
