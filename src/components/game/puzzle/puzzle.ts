import "./puzzle.css";

import type { WordCollection } from "../../interfaces/interfaces";
import { shuffleArr } from "../../utils/utils";
import { BASE_IMAGE_URL } from "../../constants/constants";
import type LevelSelect from "../level-select/level-select";

class Puzzle {
  private dragged: HTMLElement;
  private cutHeight = 0;
  private correctAnswers = 0;
  private isDragging = false;
  private isAnimating = false;
  private rowTilesCount: number[] = [];

  constructor() {
    this.dragged = document.createElement("canvas");
  }

  private readonly setSizes = (
    field: HTMLElement,
    pieces: HTMLElement,
    image: HTMLImageElement
  ) => {
    field.style.maxWidth = `${image.naturalWidth}px`;
    field.style.maxHeight = `${image.naturalHeight}px`;
    pieces.style.maxWidth = `${image.naturalWidth}px`;
    pieces.style.maxHeight = `${image.naturalHeight}px`;

    image.width = field.clientWidth;
    image.height = field.clientHeight;

    const rows = document.querySelectorAll(
      ".game-row"
    ) as NodeListOf<HTMLElement>;

    rows.forEach((row, index) => {
      row.style.height = `${Math.floor(image.height / 10)}px`;

      const cells = row.querySelectorAll(
        ".game-cell"
      ) as NodeListOf<HTMLElement>;
      cells.forEach((cell) => {
        cell.style.width = `${Math.ceil(image.width / cells.length)}px`;
        cell.style.height = `${Math.ceil(image.height / 10)}px`;
      });

      const rowTiles = row.querySelectorAll(
        ".tile"
      ) as NodeListOf<HTMLCanvasElement>;
      const piecesTiles = pieces.querySelectorAll(
        ".tile"
      ) as NodeListOf<HTMLCanvasElement>;
      const tiles = [...rowTiles, ...piecesTiles];

      if (tiles.length > 0) {
        const tilesCount = this.rowTilesCount[index] || tiles.length;
        tiles.forEach((tile) => {
          const context = tile.getContext("2d") as CanvasRenderingContext2D;
          const newWidth = Math.floor(image.width / tilesCount);
          const newHeight = Math.floor(image.height / 10);

          const text = tile.dataset.text;

          tile.width = newWidth;
          tile.height = newHeight;

          const sourceX = parseInt(tile.dataset.sourceX || "0");
          const sourceY = parseInt(tile.dataset.sourceY || "0");
          const sourceWidth = parseInt(tile.dataset.sourceWidth || "0");
          const sourceHeight = parseInt(tile.dataset.sourceHeight || "0");

          context.drawImage(
            image,
            sourceX,
            sourceY,
            sourceWidth,
            sourceHeight,
            0,
            0,
            newWidth,
            newHeight
          );

          if (text) {
            const fontSize = Math.min(newWidth, newHeight) * 0.4;
            context.font = `bold ${fontSize}px sans-serif`;
            context.textAlign = "center";
            context.textBaseline = "middle";

            context.strokeStyle = "#000";
            context.lineWidth = fontSize * 0.1;
            context.strokeText(text, newWidth / 2, newHeight / 2);

            context.fillStyle = "#FFF";
            context.fillText(text, newWidth / 2, newHeight / 2);

            context.shadowColor = "transparent";
            context.shadowBlur = 0;
            context.shadowOffsetX = 0;
            context.shadowOffsetY = 0;
          }
        });
      }
    });
  };

  private setDropZone = (container: HTMLElement) => {
    container.addEventListener("dragover", (evt) => {
      evt.preventDefault();
      if (this.isDragging && !this.isAnimating) {
        container.classList.add("drag-over");
      }
    });

    container.addEventListener("dragleave", () => {
      container.classList.remove("drag-over");
    });

    container.addEventListener("drop", (evt) => {
      evt.preventDefault();
      if (this.isAnimating) return;

      container.classList.remove("drag-over");
      const target = evt.target as HTMLElement;

      if (target.className === "game-cell" || target.className === "pieces") {
        this.isAnimating = true;
        this.dragged.classList.add("dropped");
        setTimeout(() => {
          this.dragged.classList.remove("dropped");
          this.dragged.remove();
          target.append(this.dragged);
          this.isAnimating = false;
        }, 300);
      }

      if (target.className === "tile") {
        const draggedParent = this.dragged.parentNode as ParentNode;
        const targetParent = target.parentNode as ParentNode;

        this.isAnimating = true;
        this.dragged.classList.add("swapped");
        target.classList.add("swapped");

        setTimeout(() => {
          this.dragged.classList.remove("swapped");
          target.classList.remove("swapped");
          this.dragged.remove();
          target.remove();

          draggedParent.append(target);
          targetParent.append(this.dragged);
          this.isAnimating = false;
        }, 300);
      }
    });
  };

  private readonly createRow = (image: HTMLImageElement, length: number) => {
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
    wordsData: WordCollection
  ) => {
    image.addEventListener("load", () => {
      const gameField = document.querySelector(".game") as HTMLElement;
      const pieces = document.querySelector(".pieces") as HTMLElement;

      this.makePiecesRow(image, wordsData);
      this.setSizes(gameField, pieces, image);

      setTimeout(() => {
        this.setSizes(gameField, pieces, image);
      }, 300);

      window.addEventListener("resize", () => {
        this.setSizes(gameField, pieces, image);
      });

      this.setDropZone(pieces);
    });
  };

  private setText = (text: string, wordsData: WordCollection) => {
    const textContainer = document.querySelector(".phrase") as HTMLElement;
    textContainer.innerHTML = "";

    const audio = new Audio(
      `./assets/${wordsData.words[this.correctAnswers].audioExample}`
    );

    const btn = document.createElement("button");
    btn.addEventListener("click", () => {
      audio.play().catch((error) => {
        console.error("Error playing audio:", error);
      });
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

  private findFirstEmptySlot = (): HTMLElement | null => {
    const rows = document.querySelectorAll(
      ".game-row"
    ) as NodeListOf<HTMLElement>;
    const lastRow = Array.from(rows).at(-1);
    if (!lastRow) return null;

    const cells = lastRow.children;
    for (let i = 0; i < cells.length; i++) {
      const cell = cells[i] as HTMLElement;
      if (!cell.querySelector(".tile")) {
        return cell;
      }
    }
    return null;
  };

  private readonly clearErrorMessage = () => {
    const wrongText = document.querySelector("#wrong") as HTMLElement;
    wrongText.textContent = "";
  };

  private handleTileClick = (canvas: HTMLCanvasElement) => {
    if (this.isAnimating) return;
    this.clearErrorMessage();

    if (canvas.parentElement?.classList.contains("pieces")) {
      const emptySlot = this.findFirstEmptySlot();
      if (emptySlot) {
        this.isAnimating = true;
        canvas.classList.add("fade-out");
        setTimeout(() => {
          canvas.classList.remove("fade-out");
          canvas.remove();
          emptySlot.append(canvas);
          canvas.classList.add("fade-in");
          setTimeout(() => {
            canvas.classList.remove("fade-in");
            this.isAnimating = false;
          }, 300);
        }, 300);
      }
    } else if (canvas.parentElement?.classList.contains("game-cell")) {
      const pieces = document.querySelector(".pieces") as HTMLElement;
      this.isAnimating = true;
      canvas.classList.add("fade-out");
      setTimeout(() => {
        canvas.classList.remove("fade-out");
        canvas.remove();
        pieces.append(canvas);
        canvas.classList.add("fade-in");
        setTimeout(() => {
          canvas.classList.remove("fade-in");
          this.isAnimating = false;
        }, 300);
      }, 300);
    }
  };

  private readonly makePiecesRow = (
    image: HTMLImageElement,
    wordsData: WordCollection
  ) => {
    const pieces = document.querySelector(".pieces") as HTMLElement;

    if (this.correctAnswers >= wordsData.words.length) {
      return;
    }

    const words = wordsData.words[this.correctAnswers].textExample.split(" ");
    const length = words.length;
    this.rowTilesCount.push(length);

    this.setText(
      wordsData.words[this.correctAnswers].textExampleTranslate,
      wordsData
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

      canvas.dataset.sourceX = sourceX.toString();
      canvas.dataset.sourceY = sourceY.toString();
      canvas.dataset.sourceWidth = sourceWidth.toString();
      canvas.dataset.sourceHeight = sourceHeight.toString();

      context.drawImage(
        image,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
        destX,
        destY,
        destWidth,
        destHeight
      );

      const fontSize = Math.min(canvas.width, canvas.height) * 0.4;
      context.font = `bold ${fontSize}px sans-serif`;
      context.textAlign = "center";
      context.textBaseline = "middle";

      context.strokeStyle = "#000";
      context.lineWidth = fontSize * 0.1;
      context.strokeText(words[i], canvas.width / 2, canvas.height / 2);

      context.fillStyle = "#FFF";
      context.fillText(words[i], canvas.width / 2, canvas.height / 2);
      canvas.dataset.text = words[i];

      canvas.addEventListener("click", () => this.handleTileClick(canvas));

      canvas.addEventListener("dragstart", (evt) => {
        this.isDragging = true;
        this.dragged = evt.target as HTMLElement;
        canvas.classList.add("dragging");
      });

      canvas.addEventListener("dragend", () => {
        this.isDragging = false;
        canvas.classList.remove("dragging");
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
    let hasEmptyCells = false;

    const cells = row.children;
    Array.from(cells).forEach((cell: Element) => {
      const tile: HTMLElement | null = cell.querySelector(".tile");
      if (tile) {
        result += `${tile.dataset.text} `;
      } else {
        hasEmptyCells = true;
      }
    });

    return { result: result.trim(), hasEmptyCells };
  };

  public clear = () => {
    const phrase = document.querySelector(".phrase") as HTMLElement;
    const game = document.querySelector(".game") as HTMLElement;
    const pieces = document.querySelector(".pieces") as HTMLElement;
    phrase.innerHTML = "";
    game.innerHTML = "";
    pieces.innerHTML = "";
    this.clearErrorMessage();

    this.correctAnswers = 0;
    this.rowTilesCount = [];
  };

  public init = (
    wordsData: WordCollection,
    levelSelect: LevelSelect,
    wholeLevel: WordCollection[]
  ) => {
    this.clear();
    const image = new Image();
    image.src = `${BASE_IMAGE_URL}${wordsData.levelData.imageSrc}`;

    this.initGameField(image, wordsData);

    const btn = document.querySelector(".check-button") as HTMLButtonElement;
    btn.addEventListener("click", () => {
      const rows = document.querySelectorAll(
        ".game-row"
      ) as NodeListOf<HTMLElement>;

      const row = Array.from(rows).at(-1);

      if (row) {
        const { result, hasEmptyCells } = this.getResultPhrase(row);
        const expected = wordsData.words[this.correctAnswers].textExample;

        if (hasEmptyCells) {
          const wrongText = document.querySelector("#wrong") as HTMLElement;
          wrongText.textContent = "Please fill in all cells";
          return;
        }

        if (result === expected) {
          this.clearErrorMessage();
          row.style.pointerEvents = "none";
          row.classList.add("correct");
          this.correctAnswers++;
          this.makePiecesRow(image, wordsData);

          if (rows.length === 10) {
            const overlay = document.createElement("div");
            overlay.classList.add("level-complete-overlay");

            const completeImage = document.createElement("img");
            completeImage.classList.add("level-complete-image");
            completeImage.src = `./assets/images/${wordsData.levelData.imageSrc}`;

            overlay.appendChild(completeImage);
            document.body.appendChild(overlay);

            setTimeout(() => {
              overlay.classList.add("visible");
            }, 100);

            completeImage.addEventListener("click", () => {
              overlay.classList.remove("visible");
              setTimeout(() => {
                overlay.remove();
                levelSelect.nextLevel(wholeLevel);
              }, 300);
            });
          }
        } else {
          const wrongText = document.querySelector("#wrong") as HTMLElement;
          wrongText.textContent = "Not all parts stay in place";
          wrongText.classList.add("shake");
          setTimeout(() => {
            wrongText.classList.remove("shake");
          }, 500);
        }
      }
    });
  };
}

export default Puzzle;
