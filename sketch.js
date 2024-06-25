let ship;
let meteors = [];
let gameState = "playing";
let questionIndex = 0;
let buttons = [];

let questions = [
  {
    question: "How many people were on Apollo 1?",
    answers: ["5 people", "3 people", "17 people"],
    correct: 1
  },
  {
    question: "In what year did Apollo 11 land on the moon?",
    answers: ["1979", "1989", "1969"],
    correct: 2
  },
  {
    question: "Which Apollo spacecraft crashed?",
    answers: ["Apollo 1", "Apollo 11", "Apollo 13"],
    correct: 0
  }
];

function setup() {
  createCanvas(400, 400);
  ship = new Spaceship();
  resetGame();
}

function draw() {
  background(0);
  
  if (gameState === "playing") {
    ship.update();
    ship.display();
    
    for (let meteor of meteors) {
      meteor.update();
      meteor.display();
      if (meteor.hits(ship)) {
        gameState = "question";
        createButtons();
      }
    }
  } else if (gameState === "question") {
    displayQuestion();
  } else if (gameState === "wrong") {
    displayWrongAnswer();
  } else if (gameState === "winner") {
    displayWinnerMessage();
  }
}

function resetGame() {
  meteors = [];
  for (let i = 0; i < 5; i++) {
    meteors.push(new Meteor());
  }
  gameState = "playing";
}

function displayQuestion() {
  textAlign(CENTER, CENTER);
  textSize(18);
  fill(255);
  text(questions[questionIndex].question, width/2, height/2 - 50);
  
  for (let button of buttons) {
    button.display();
  }
}

function displayWrongAnswer() {
  textAlign(CENTER, CENTER);
  textSize(24);
  fill(255);
  if (questionIndex === 1) {
    text("Restart new site", width/2, height/2);
  } else {
    text("Return the game back nub", width/2, height/2);
  }
}

function displayWinnerMessage() {
  textAlign(CENTER, CENTER);
  textSize(24);
  fill(255);
  text("You are the king of the Garry", width/2, height/2);
}

function createButtons() {
  buttons = questions[questionIndex].answers.map((answer, index) => {
    return new Button(width/4 + (index * width/4), height/2 + 50, 100, 40, answer, () => checkAnswer(index));
  });
}

function checkAnswer(index) {
  if (index === questions[questionIndex].correct) {
    if (questionIndex === 2) {
      gameState = "winner";
    } else {
      questionIndex++;
      resetGame();
    }
  } else {
    gameState = "wrong";
  }
}

function mousePressed() {
  if (gameState === "question" || gameState === "wrong" || gameState === "winner") {
    for (let button of buttons) {
      button.handleClick();
    }
  }
}

function keyPressed() {
  ship.setDir(keyCode, true);
}

function keyReleased() {
  ship.setDir(keyCode, false);
}

class Spaceship {
  constructor() {
    this.x = width / 2;
    this.y = height - 50;
    this.size = 30;
    this.xdir = 0;
    this.ydir = 0;
    this.speed = 5;
  }
  
  setDir(key, val) {
    if (key === 65 || key === LEFT_ARROW) this.xdir = val ? -1 : 0;
    if (key === 68 || key === RIGHT_ARROW) this.xdir = val ? 1 : 0;
    if (key === 87 || key === UP_ARROW) this.ydir = val ? -1 : 0;
    if (key === 83 || key === DOWN_ARROW) this.ydir = val ? 1 : 0;
  }
  
  update() {
    this.x += this.xdir * this.speed;
    this.y += this.ydir * this.speed;
    this.x = constrain(this.x, 0, width);
    this.y = constrain(this.y, 0, height);
  }
  
  display() {
    fill(200);
    triangle(this.x, this.y - this.size/2, 
             this.x - this.size/2, this.y + this.size/2, 
             this.x + this.size/2, this.y + this.size/2);
  }
}

class Meteor {
  constructor() {
    this.reset();
  }
  
  reset() {
    this.x = random(width);
    this.y = random(-100, -10);
    this.speed = random(3, 6);
    this.size = 30;
  }
  
  update() {
    this.y += this.speed;
    if (this.y > height) {
      this.reset();
    }
  }
  
  display() {
    fill(150);
    ellipse(this.x, this.y, this.size);
  }
  
  hits(ship) {
    let d = dist(this.x, this.y, ship.x, ship.y);
    return d < (this.size/2 + ship.size/2);
  }
}

class Button {
  constructor(x, y, w, h, text, onClick) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.text = text;
    this.onClick = onClick;
  }
  
  display() {
    fill(100);
    rect(this.x - this.w/2, this.y - this.h/2, this.w, this.h);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(14);
    text(this.text, this.x, this.y);
  }
  
  handleClick() {
    if (mouseX > this.x - this.w/2 && mouseX < this.x + this.w/2 &&
        mouseY > this.y - this.h/2 && mouseY < this.y + this.h/2) {
      this.onClick();
    }
  }
}