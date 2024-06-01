import "./puzzle.css";

import type { WordCollection } from "../../interfaces/interfaces";
import { shuffleArr } from "../../utils/utils";
import type LevelSelect from "../level-select/level-select";

class Puzzle {
  private dragged: HTMLElement;
  private cutHeight = 0;
  private correctAnswers = 0;

  constructor() {
    this.dragged = document.createElement("canvas");
  }

  private setSizes = (
    field: HTMLElement,
    pieces: HTMLElement,
    image: HTMLImageElement,
  ) => {
    field.style.maxWidth = `${image.naturalWidth}px`;
    field.style.maxHeight = `${image.naturalHeight}px`;

    pieces.style.maxWidth = `${image.naturalWidth}px`;
    pieces.style.maxHeight = `${image.naturalHeight}px`;

    image.width = field.clientWidth;
    image.height = field.clientHeight;
  };

  private setDropZone = (container: HTMLElement) => {
    container.addEventListener("dragover", (evt) => {
      evt.preventDefault();
    });

    container.addEventListener("drop", (evt) => {
      evt.preventDefault();
      const target = evt.target as HTMLElement;
      if (target.className === "game-cell" || target.className === "pieces") {
        this.dragged.remove();
        target.append(this.dragged);
      }

      if (target.className === "tile") {
        const draggedParent = this.dragged.parentNode as ParentNode;
        const targetParent = target.parentNode as ParentNode;

        this.dragged.remove();
        target.remove();

        draggedParent.append(target);
        targetParent.append(this.dragged);
      }
    });
  };

  private createRow = (image: HTMLImageElement, length: number) => {
    const gameField = document.querySelector(".game") as HTMLElement;
    const gameRow = document.createElement("div");
    gameRow.classList.add("game-row");
    gameRow.style.height = `${Math.floor(image.width / 10)}`;

    gameField.append(gameRow);
    for (let j = 0; j < length; j++) {
      const gameCell = document.createElement("div");
      gameCell.style.width = `${Math.ceil(image.width / length)}px`;
      gameCell.style.height = `${Math.ceil(image.height / 10)}px`;
      gameCell.classList.add("game-cell");

      this.setDropZone(gameCell);
      gameRow.append(gameCell);
    }
  };

  private initGameField = (
    image: HTMLImageElement,
    wordsData: WordCollection,
  ) => {
    image.addEventListener("load", () => {
      const gameField = document.querySelector(".game") as HTMLElement;
      const pieces = document.querySelector(".pieces") as HTMLElement;

      this.setSizes(gameField, pieces, image);

      this.setDropZone(pieces);

      this.makePiecesRow(image, wordsData);
    });
  };

  private setText = (text: string, wordsData: WordCollection) => {
    const textContainer = document.querySelector(".phrase") as HTMLElement;
    textContainer.innerHTML = "";

    const audio = new Audio(
      `./assets/${wordsData.words[this.correctAnswers].audioExample}`,
    );

    const btn = document.createElement("button");
    btn.addEventListener("click", () => {
      audio.play().then(() => {});
    });

    const btnIcon = document.createElement("img");
    btnIcon.src = "./assets/images/voice-icon.png";
    btnIcon.width = 20;
    btnIcon.height = 20;
    btn.append(btnIcon);

    const textTag = document.createElement("p");
    textTag.textContent = text;
    textContainer.append(btn, textTag);
  };

  private makePiecesRow = (
    image: HTMLImageElement,
    wordsData: WordCollection,
  ) => {
    const pieces = document.querySelector(".pieces") as HTMLElement;

    const words = wordsData.words[this.correctAnswers].textExample.split(" ");

    const length = words.length;

    this.setText(
      wordsData.words[this.correctAnswers].textExampleTranslate,
      wordsData,
    );

    this.createRow(image, length);

    const piecesArr: HTMLCanvasElement[] = [];
    let width = 0;
    for (let i = 0; i < length; i++) {
      const canvas = document.createElement("canvas");
      canvas.classList.add("tile");
      const context = canvas.getContext("2d") as CanvasRenderingContext2D;

      canvas.width = Math.floor(image.width / length);
      canvas.height = Math.floor(image.height / 10);
      canvas.setAttribute("draggable", "true");

      const sourceX = width;
      const sourceY = this.cutHeight;
      const sourceWidth = canvas.width;
      const sourceHeight = canvas.height;
      const destWidth = sourceWidth;
      const destHeight = sourceHeight;
      const destX = 0;
      const destY = 0;

      context.drawImage(
        image,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
        destX,
        destY,
        destWidth,
        destHeight,
      );
      const fontSize = canvas.width - (canvas.width * 80) / 100;

      context.font = `${fontSize}px sans-serif`;
      context.textAlign = "center";
      context.strokeStyle = "#000";
      context.strokeText(words[i], canvas.width / 2, canvas.height / 2);
      context.fillStyle = "#FFF";
      context.fillText(words[i], canvas.width / 2, canvas.height / 2);
      canvas.dataset.text = words[i];
      canvas.addEventListener("dragstart", (evt) => {
        this.dragged = evt.target as HTMLElement;
      });
      piecesArr.push(canvas);

      width += Math.floor(image.width / length);
    }

    shuffleArr(piecesArr);
    piecesArr.forEach((canvas) => {
      pieces.append(canvas);
    });

    this.cutHeight += Math.floor(image.height / 10);
  };

  private getResultPhrase = (row: HTMLElement) => {
    let result = "";

    const cells = row.children;
    Array.from(cells).forEach((cell: Element) => {
      const tile: HTMLElement | null = cell.querySelector(".tile");
      if (tile) {
        result += `${tile.dataset.text} `;
      }
    });

    return result.trim();
  };

  public clear = () => {
    const phrase = document.querySelector(".phrase") as HTMLElement;
    const game = document.querySelector(".game") as HTMLElement;
    const pieces = document.querySelector(".pieces") as HTMLElement;
    phrase.innerHTML = "";
    game.innerHTML = "";
    pieces.innerHTML = "";

    this.cutHeight = 0;
    this.correctAnswers = 0;
  };

  public init = (
    wordsData: WordCollection,
    levelSelect: LevelSelect,
    wholeLevel: WordCollection[],
  ) => {
    const image = new Image();
    image.src = `./assets/images/${wordsData.levelData.imageSrc}`;

    this.initGameField(image, wordsData);

    const btn = document.querySelector(".check-button") as HTMLButtonElement;
    btn.addEventListener("click", () => {
      const rows = document.querySelectorAll(
        ".game-row",
      ) as NodeListOf<HTMLElement>;
      const row = Array.from(rows).at(-1);

      if (row) {
        if (
          this.getResultPhrase(row) ===
          wordsData.words[this.correctAnswers].textExample
        ) {
          const wrongText = document.querySelector("#wrong") as HTMLElement;
          wrongText.textContent = "";
          row.style.pointerEvents = "none";
          this.correctAnswers++;
          this.makePiecesRow(image, wordsData);

          if (rows.length === 10) {
            levelSelect.nextLevel(wholeLevel);
          }
        } else {
          const wrongText = document.querySelector("#wrong") as HTMLElement;
          wrongText.textContent = "Not all parts stay in place";
        }
      }
    });
  };
}

export default Puzzle;
