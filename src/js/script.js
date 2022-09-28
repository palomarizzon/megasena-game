/*let board = [];
let currentGame = [1, 5, 11, 13, 15, 17];
let savedGames = [];*/

let state = { board: [], currentGame: [], savedGames: [] };

function start() {
  readLocalStorage();
  createBoard();
  newGame();
}

function readLocalStorage() {
  if (!window.localStorage) {
    return;
  }

  let savedGamesLocalStorage = window.localStorage.getItem("saved-games");

  if (savedGamesLocalStorage) {
    state.savedGames = JSON.parse(savedGamesLocalStorage);
  }
}

function writeLocalStorage() {
  window.localStorage.setItem("saved-games", JSON.stringify(state.savedGames));
}

function deleteLocalStorage() {
  window.localStorage.setItem("saved-games", JSON.stringify([]));
  readLocalStorage();
  renderSavedGames();
}

function createBoard() {
  state.board = [];

  for (let i = 1; i <= 60; i++) {
    state.board.push(i);
  }
}

function newGame() {
  resetGame();
  render();
}

function render() {
  renderBoard();
  renderButtons();
  renderSavedGames();
}

function renderBoard() {
  let divBoard = document.querySelector("#megasena-board");
  divBoard.innerHTML = "";

  let ulNumbers = document.createElement("ul");
  ulNumbers.classList.add("numbers");

  for (let i = 0; i < state.board.length; i++) {
    let currentNumber = state.board[i];

    let liNumber = document.createElement("li");
    liNumber.textContent = currentNumber;
    liNumber.classList.add("number");

    liNumber.addEventListener("click", handleNumberClick);

    if (isNumberInGame(currentNumber)) {
      liNumber.classList.add("selected-number");
    }

    ulNumbers.appendChild(liNumber);
  }

  divBoard.appendChild(ulNumbers);
}

function handleNumberClick(event) {
  let value = Number(event.currentTarget.textContent);

  if (isNumberInGame(value)) {
    removeNumberFromGame(value);
  } else {
    addNumberToGame(value);
  }
  render();
}

function renderButtons() {
  let divButtons = document.querySelector("#megasena-buttons");
  divButtons.innerHTML = "";

  let buttonNewGame = createNewGameButton();
  let buttonRandomGame = createRandomGameButton();
  let buttonSaveGame = createSaveGameButton();
  let buttonDeleteGames = deleteSavedGamesButton();

  divButtons.appendChild(buttonNewGame);
  divButtons.appendChild(buttonRandomGame);
  divButtons.appendChild(buttonSaveGame);
  divButtons.appendChild(buttonDeleteGames);
}

function createNewGameButton() {
  let button = document.createElement("button");
  button.textContent = "Novo jogo";

  button.addEventListener("click", newGame);

  return button;
}

function createRandomGameButton() {
  let button = document.createElement("button");
  button.textContent = "Jogo aleatório";

  button.addEventListener("click", randomGame);

  return button;
}

function createSaveGameButton() {
  let button = document.createElement("button");
  button.textContent = "Salvar jogo";
  //button.disabled = !isGameComplete();

  button.addEventListener("click", trySaving);

  return button;
}

function trySaving() {
  if (!isGameComplete) {
    alert("Escolha mais um número!");
  } else {
    saveGame();
  }
}

function deleteSavedGamesButton() {
  let button = document.createElement("button");
  button.textContent = "Excluir jogos";

  button.addEventListener("click", deleteLocalStorage);

  return button;
}

function renderSavedGames() {
  let divSavedGames = document.querySelector("#megasena-saved-games");
  divSavedGames.innerHTML = "";
  /*f2 para renomear todas as variáveis da função*/

  if (state.savedGames.length === 0) {
    divSavedGames.innerHTML = "<p>Nenhum jogo salvo!</p>";
  } else {
    let ulSavedGames = document.createElement("ul");

    for (let i = 0; i < state.savedGames.length; i++) {
      let currentGame = state.savedGames[i];

      let liGame = document.createElement("li");
      liGame.textContent = currentGame.join(", ");

      ulSavedGames.appendChild(liGame);
    }
    divSavedGames.appendChild(ulSavedGames);
  }
}

function addNumberToGame(numberToAdd) {
  if (numberToAdd < 1 || numberToAdd > 60) {
    console.error("Número inválido", numberToAdd);
    return;
  }

  if (state.currentGame.length >= 6) {
    alert("O jogo já está completo!");
    return;
  }

  if (isNumberInGame(numberToAdd)) {
    console.error("Este número já está no jogo!", numberToAdd);
    return;
  }

  state.currentGame.push(numberToAdd);
}

function removeNumberFromGame(numberToRemove) {
  if (numberToRemove < 1 || numberToRemove > 60) {
    console.error("Número inválido", numberToRemove);
    return;
  }

  let newGame = [];
  for (let i = 0; i < state.currentGame.length; i++) {
    let currentNumber = state.currentGame[i];

    if (currentNumber === numberToRemove) {
      continue;
    }
    newGame.push(currentNumber);
  }
  state.currentGame = newGame;
}

function isNumberInGame(numberToCheck) {
  //if (state.currentGame.includes(numberToCheck)) {
  //return true;
  //}
  //return false;
  return state.currentGame.includes(numberToCheck);
}

function saveGame() {
  if (!isGameComplete()) {
    alert("O jogo não está completo, você precisa selecionar 6 números!");
    return;
  }

  state.savedGames.push(state.currentGame.sort((a, b) => a - b));
  writeLocalStorage();
  newGame();
}

function isGameComplete() {
  return state.currentGame.length === 6;
}

function resetGame() {
  state.currentGame = [];
}

function randomGame() {
  resetGame();

  while (!isGameComplete()) {
    let randomNumber = Math.ceil(Math.random() * 60);
    addNumberToGame(randomNumber);
  }

  render();
}

start();
