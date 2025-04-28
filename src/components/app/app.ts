import StartScreen from "../screens/start-screen/start-screen";

class App {
  public start = () => {
    const mainContainer = document.createElement("div");
    mainContainer.classList.add("page-wrapper");

    document.body.append(mainContainer);

    const startScreen = new StartScreen(mainContainer);

    startScreen.init();
  };
}

export default App;
