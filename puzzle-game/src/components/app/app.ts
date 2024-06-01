import StartScreen from "../screens/start-screen/start-screen";

class App {
  private createMainContainer = () => {
    const body = document.body;

    const mainContainer = document.createElement("div");
    mainContainer.classList.add("page-wrapper");

    body.append(mainContainer);

    return mainContainer;
  };

  public start = () => {
    const mainContainer = this.createMainContainer();

    const startScreen = new StartScreen(mainContainer);

    startScreen.init();
  };
}

export default App;
