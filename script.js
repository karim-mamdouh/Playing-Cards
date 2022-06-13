(function () {
  //#region Variables section
  var gameActive = false; //Flag activated when gae starts
  var timer; //Holds the "setTimeout" event
  var level = 1; //Counter of levels (max 3 levels)
  var time = new Time();
  var foundMatches = 0; //Counter of found matching pairs (when filled should be equal to numberOfCards/2)
  var activeCard = null; //Temp object to hold clicked card
  var hintActivated = false; //Flag indicated that hint button is clicked
  var hintCount = 3; //Number of avialable hints
  var numberOfCards = 10; //Number of cards to be filled in the "generatedCards" and HTML grid
  var generatedCards = []; //Array that holds generated card pairs
  var defaultCard = "card back red.png"; //Flipped card image directory
  var defaultImagesDir = "./images/"; //Default images folder directory
  //Array holding all card image directories
  var images = [
    "2_of_clubs.png",
    "2_of_diamonds.png",
    "2_of_hearts.png",
    "2_of_spades.png",
    "3_of_clubs.png",
    "3_of_diamonds.png",
    "3_of_hearts.png",
    "3_of_spades.png",
    "4_of_clubs.png",
    "4_of_diamonds.png",
    "4_of_hearts.png",
    "4_of_spades.png",
    "5_of_clubs.png",
    "5_of_diamonds.png",
    "5_of_hearts.png",
    "5_of_spades.png",
    "6_of_clubs.png",
    "6_of_diamonds.png",
    "6_of_hearts.png",
    "6_of_spades.png",
    "7_of_clubs.png",
    "7_of_diamonds.png",
    "7_of_hearts.png",
    "7_of_spades.png",
    "8_of_clubs.png",
    "8_of_diamonds.png",
    "8_of_hearts.png",
    "8_of_spades.png",
    "9_of_clubs.png",
    "9_of_diamonds.png",
    "9_of_hearts.png",
    "9_of_spades.png",
    "10_of_clubs.png",
    "10_of_diamonds.png",
    "10_of_hearts.png",
    "10_of_spades.png",
    "ace_of_clubs.png",
    "ace_of_diamonds.png",
    "ace_of_hearts.png",
    "ace_of_spades.png",
    "ace_of_spades2.png",
    "black_joker.png",
    "jack_of_clubs.png",
    "jack_of_clubs2.png",
    "jack_of_diamonds.png",
    "jack_of_diamonds2.png",
    "jack_of_hearts.png",
    "jack_of_hearts2.png",
    "jack_of_spades.png",
    "jack_of_spades2.png",
    "king_of_clubs.png",
    "king_of_clubs2.png",
    "king_of_diamonds.png",
    "king_of_diamonds2.png",
    "king_of_hearts.png",
    "king_of_hearts2.png",
    "king_of_spades.png",
    "king_of_spades2.png",
    "queen_of_clubs.png",
    "queen_of_clubs2.png",
    "queen_of_diamonds.png",
    "queen_of_diamonds2.png",
    "queen_of_hearts.png",
    "queen_of_hearts2.png",
    "queen_of_spades.png",
    "queen_of_spades2.png",
    "red_joker.png",
  ];
  //#endregion

  //#region Factory and constructor functions section
  //Factory function to create an object for each card
  function card(id, img) {
    return {
      id: id,
      imgDir: img,
      flippedState: false,
    };
  }
  //Factory function that returns a new object based on the variables in the
  //parameter list
  function createTempCard(index, Obj) {
    return {
      index: index,
      cardObj: Obj,
    };
  }
  //Time constructor function
  function Time() {
    var _hours = 0;
    var _minutes = 0;
    var _seconds = 0;
    Object.defineProperty(this, "hours", {
      get: function () {
        return _hours;
      },
      set: function (value) {
        _hours = value;
      },
    });
    Object.defineProperty(this, "minutes", {
      get: function () {
        return _minutes;
      },
      set: function (value) {
        _minutes = value;
        if (_minutes > 59) {
          _minutes = 0;
          _hours++;
        } else if (_minutes < 0) {
          _minutes = 0;
          _seconds = 59;
        }
      },
    });
    Object.defineProperty(this, "seconds", {
      get: function () {
        return _seconds;
      },
      set: function (value) {
        _seconds = value;
        if (_seconds > 59) {
          _seconds = 0;
          _minutes++;
        } else if (_seconds < 0) {
          if (_minutes > 0) {
            _minutes--;
            _seconds = 59;
          } else {
            _seconds = 0;
          }
        }
      },
    });
  }
  //Function in "Time" prototype to reset time
  Time.prototype.reset = function () {
    this.minutes = 0;
    this.hours = 0;
    this.seconds = 0;
  };
  //Function in "Time" prototype to set time values
  Time.prototype.setTime = function (hours, minutes, seconds) {
    this.hours = hours;
    this.minutes = minutes;
    this.seconds = seconds;
  };
  //#endregion

  //#region Functions section
  //Function creates a new card element in the HTML document
  //The function sets the backgroundImage property of the created "div",
  //assigns an id and links the created "div" to the "cardClickEvent"
  function cardCreator(id, parentDir, imageDir) {
    var card = document.createElement("div");
    card.className = "card";
    card.style.backgroundImage = `url('${parentDir + imageDir}')`;
    card.id = id.toString();
    card.addEventListener("click", cardClickEvent);
    return card;
  }
  //Function that returns a new array of strings containing non-repeating
  //random card directories based on the "numberOfCards" parameter
  //numberOfCards: number of cards to be randomly returned
  //imagesArray: array to select randomly from
  function generateUniqueCards(numberOfCards, imagesArray) {
    var uniqueCards = [];
    for (var i = 0; i < numberOfCards; ) {
      var imageIndex = Math.floor(Math.random() * imagesArray.length);
      if (!uniqueCards.includes(imagesArray[imageIndex])) {
        uniqueCards.push(imagesArray[imageIndex]);
        i++;
      }
    }
    return uniqueCards;
  }
  //Function that returns an array of card objects
  //The function accepts an array as it's parameter to randomly generate
  //new card objects from, the returned array is double the length of the
  //array sent as an argument
  //The elements of the new array will be pairs of card objects randomly
  //placed in the new array
  function randomDoubleCopy(array) {
    var doubledArray = [];
    var count = 0;
    for (var i = 0; i < array.length * 2; count = 0) {
      var randomIndex = Math.floor(Math.random() * array.length);
      if (
        doubledArray.filter((element) => element.imgDir === array[randomIndex])
          .length < 2
      ) {
        doubledArray.push(/*new*/ card(randomIndex, array[randomIndex]));
        i++;
      }
    }
    return doubledArray;
  }
  //Function that fills the HTML cards grid with the enetered number of cards
  //by calling the "cardCreator" function
  //containerClass: class of HTML element container to be filled with cards
  //numberOfCards: number of cards to be generated
  //parentDir: parent directory of images folder
  //imageDir: image directory to be placed as a bacground of the created "div"
  function fillFlippedCards(
    containerClass,
    numberOfCards,
    parentDir,
    imageDir
  ) {
    document.getElementById(containerClass).innerHTML = "";
    for (var i = 0; i < numberOfCards; i++) {
      document
        .getElementById(containerClass)
        .appendChild(cardCreator(i, parentDir, imageDir));
    }
  }
  //Function that resets hint parameters and images when new game starts
  function resetHints() {
    hintCount = 3;
    for (var i = 0; i < hintCount; i++) {
      document
        .getElementById(`header__hint-${i + 1}`)
        .setAttribute("src", defaultImagesDir + "idea.png");
    }
  }
  //Function that changes the background image of the entered HTML id
  //card: card image directory is set by default to the flipped card image
  function flipCard(cardID, card = defaultCard) {
    document.getElementById(cardID.toString()).style.backgroundImage = `url('${
      defaultImagesDir + card
    }')`;
  }
  //Function that loops on all elements of the "generatedCards" array
  //and checks the "flippedState" flag state, if not true it calls the "flipCard"
  //function and changes the background image based on the "showAllCards" flag
  //showAllCards: true-> shows all non flipped cards, false-> returns them to flipping state
  function flipAllCards(showAllCards, defaultDir = "Cards/") {
    generatedCards.forEach(function (element, index) {
      if (!element.flippedState) {
        showAllCards === true
          ? flipCard(index, defaultDir + element.imgDir)
          : flipCard(index);
      }
    });
  }
  //Function shows current timer value on the entered HTML element using element ID
  function showTime(timeObj, elementID) {
    document.getElementById(elementID).innerHTML = `${timeObj.hours
      .toString()
      .padStart(2, "0")}:${timeObj.minutes
      .toString()
      .padStart(2, "0")}:${timeObj.seconds.toString().padStart(2, "0")}`;
  }
  //Function sets the game result text and color
  function showGameResult(text, textColor) {
    var element = document.getElementById("game-result");
    element.innerHTML = text;
    element.style.color = textColor;
  }
  //Timer function; when time reaches 0 means user has lost
  function gameTimer() {
    if (time.hours == 0 && time.minutes == 0 && time.seconds == 0) {
      showGameResult("YOU LOSE", "red");
      clearInterval(timer);
      gameActive = false;
    }
    time.seconds--;
    showTime(time, "game-config__time");
  }
  //Function called when game is won to clear interval of "timer"
  function gameWon() {
    showGameResult("YOU WON", "green");
    clearInterval(timer);
    gameActive = false;
    activeCard = null;
  }
  //Function that sets pereferences of active level
  function activateLevel(level) {
    switch (level) {
      case 1:
        numberOfCards = 4;
        time.setTime(0, 0, 30);
        break;
      case 2:
        numberOfCards = 10;
        time.setTime(0, 1, 0);
        break;
      case 3:
        numberOfCards = 20;
        time.setTime(0, 1, 30);
        break;
    }
    document.getElementById("game-config__level").innerHTML = `Level ${level}`;
    showTime(time, "game-config__time");
    resetCardsGrid();
    activeCard = null;
    foundMatches = 0;
  }
  //Function that fill the "generatedCards" array with card objects,
  //then calls the "fillFlippedCards" to fill the HTML grid based on the length
  //of "generatedCards" length
  function resetCardsGrid() {
    generatedCards = randomDoubleCopy(
      generateUniqueCards(numberOfCards / 2, images)
    );
    fillFlippedCards(
      "cards-container",
      generatedCards.length,
      defaultImagesDir,
      defaultCard
    );
  }
  //#endregion

  //#region Events section
  //Card click event
  function cardClickEvent() {
    if (foundMatches !== numberOfCards / 2 && gameActive) {
      var currentCard = generatedCards[parseInt(this.id)];
      if (!currentCard.flippedState) {
        currentCard.flippedState = true;
        flipCard(this.id, "Cards/" + currentCard.imgDir);
        if (activeCard != null) {
          if (activeCard.cardObj.id !== currentCard.id) {
            var timer = setTimeout(() => {
              flipCard(this.id);
              flipCard(activeCard.index);
              currentCard.flippedState = false;
              activeCard.cardObj.flippedState = false;
              activeCard = null;
            }, 300);
          } else {
            foundMatches++;
            activeCard = null;
            if (foundMatches === numberOfCards / 2) {
              var timer = setTimeout(function () {
                level < 3 ? activateLevel(++level) : gameWon();
              }, 200);
            }
          }
        } else {
          activeCard = createTempCard(Number(this.id), currentCard);
        }
      }
    }
  }
  //New game button event; resets cards grid
  function newGameEvent() {
    resetHints();
    resetCardsGrid();
    activeCard = null;
    foundMatches = 0;
    gameActive = false;
    level = 1;
    activateLevel(level);
    clearInterval(timer);
    showGameResult("");
  }
  //Hint button event; once all conditions are satisfied it shows all non flipped
  //cards by calling the "flipAllCards" that activates a "setTimeout" event and
  //flip all cards again
  function hintEvent() {
    if (
      !hintActivated &&
      hintCount > 0 &&
      foundMatches !== numberOfCards / 2 &&
      gameActive
    ) {
      hintActivated = true;
      flipAllCards(true);
      var timer = setTimeout(function () {
        flipAllCards(false);
        hintActivated = false;
        document
          .getElementById(`header__hint-${hintCount--}`)
          .setAttribute("src", defaultImagesDir + "idea-turnedoff.png");
      }, 500);
    }
  }
  //Start game button event; activates "gameActive" flag and starts timer
  function startButtonEvent() {
    if (!gameActive && foundMatches != numberOfCards / 2 && time.seconds != 0) {
      gameActive = true;
      timer = setInterval(gameTimer, 1000);
      foundMatches = 0;
    }
  }
  //#endregion

  //#region HTML events and functions
  //Self invoke function that calls the "activeLevel" function then "resetCardsGrid"
  (function () {
    activateLevel(level);
    resetCardsGrid();
  })();
  //Connecting the "newGameEvent" function to the "new-game-button" click event
  document
    .getElementById("header__new-game-btn")
    .addEventListener("click", newGameEvent);
  //Connecting the "hintEvent" function to the "hint-button" click event
  document
    .getElementById("header__hint-btn")
    .addEventListener("click", hintEvent);
  //Connecting "start-button" click event to "startButtonEvent" function
  document
    .getElementById("game-config__start-btn")
    .addEventListener("click", startButtonEvent);
  //#endregion
})();
