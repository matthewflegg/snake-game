/* these are the colours we'll
   use for the game + the DPI */

const BOARD_BORDER = 'white';
const SNAKE_BORDER = 'black';
const FOOD_BORDER = 'black'

const BOARD_BACKGROUND = 'black';
const SNAKE_BACKGROUND = 'white';
const FOOD_BACKGROUND = 'red';

/* when the window loads, get the canvas
   element and render in 2D */

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

canvas.style.border = `thick solid ${BOARD_BORDER}`;


/* this is a list of co-ordinates
   for each snake segment. */

let snake = [

   {x: 200, y: 200},  {x: 190, y: 200},
   {x: 180, y: 200},  {x: 170, y: 200}
]


/* initialize starting
   velocities */

let deltaX = 10;
let deltaY = 0;

// true if changing direction

let changingDirection = false;


/* initialize food start
   co-ordinates */

let foodX;
let foodY;

// initialize score

let score = 0;


/* draws a single segment
   of the snake */

const drawSegment = (segment) => {

   context.fillStyle = SNAKE_BACKGROUND;
   context.strokeStyle = SNAKE_BORDER;

   context.fillRect(segment.x, segment.y, 10, 10);
   context.strokeRect(segment.x, segment.y, 10, 10);
}


/* draws each segment
   one by one */

const drawSnake = () => {

   snake.forEach(drawSegment);
}


/* Draws a border around
   the canvas */

const clearCanvas = () => {

   context.fillStyle = BOARD_BACKGROUND;
   context.strokeStyle = BOARD_BORDER;

   context.fillRect(0, 0, canvas.width, canvas.height);
   context.strokeRect(0, 0, canvas.width, canvas.height);
}


/* this function moves the snake
   using its horizontal velocity */

const moveSnake = () => {

   const head = {

      x: snake[0].x + deltaX,
      y: snake[0].y + deltaY
   };

   snake.unshift(head);

   const hasEaten = snake[0].x === foodX && snake[0].y === foodY;

   // if food has been eaten, grow snake

   if (hasEaten) {

      score += 10;
      document.getElementById('score').innerHTML = score;

      generateFood();

   } else {

      snake.pop();
   }
}


/* moves the snake depending
   on which arrow key was pressed */

const changeDirection = (event) => {

   // put key codes in variables

   const LEFT_KEY = 37;
   const RIGHT_KEY = 39;
   const UP_KEY = 38;
   const DOWN_KEY = 40;

   // prevent from reversing

   if (changingDirection) return;
   changingDirection = true;

   // then get the key pressed

   const key = event.keyCode;

   /* tells us which direction we're
      currently going in */

   const goingUp = deltaY === - 10;
   const goingDown = deltaY === 10;

   const goingRight = deltaX === 10;
   const goingLeft = deltaX === - 10;

   // then update velocities

   if (key === LEFT_KEY && !goingRight) {

      deltaX = -10;
      deltaY = 0;
   }

   if (key === UP_KEY && !goingDown) {

      deltaX = 0;
      deltaY = -10;
   }

   if (key === RIGHT_KEY && !goingLeft) {

      deltaX = 10;
      deltaY = 0;
   }

   if (key === DOWN_KEY && !goingUp) {

      deltaX = 0;
      deltaY = 10;
   }
}


/* checks if the player
   has lost the game */

const hasGameEnded = () => {

   // check if the snake has collided with itself

   for (let i = 4; i < snake.length; i++) {

      const hasCollided = snake[i].x === snake[0].x && snake[i].y === snake[0].y

      if (hasCollided)
         return true
   }

   // check if snake has hit a wall

   const hitLeftWall = snake[0].x < 0;
   const hitRightWall = snake[0].x > canvas.width - 10;
   const hitTopWall = snake[0].y < 0;
   const hitBottomWall = snake[0].y > canvas.height - 10;

   return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall
}


/* generate random
   co-ordinates */

const randomPoint = (min, max) => {

   return Math.round((Math.random() * (max - min) + min) / 10) * 10;
}


/* generate food and check if
   it's been eaten */

const generateFood = () => {

   foodX = randomPoint(0, canvas.width - 10);
   foodY = randomPoint(0, canvas.height - 10);

   snake.forEach(function hasEatenFood(segment) {

      const snakeHasEaten = segment.x == foodX && segment.y == foodY;
      if (snakeHasEaten) generateFood();
   });
}


/* draw the food onto
   the canvas */

const drawFood = () => {

   context.fillStyle = FOOD_BACKGROUND;
   context.strokeStyle = FOOD_BORDER;

   context.fillRect(foodX, foodY, 10, 10);
   context.strokeRect(foodX, foodY, 10, 10);
}


/* listen for events. if it's a key
   down, change direction */

document.addEventListener('keydown', changeDirection);


/* if player presses enter and
   game has ended, then reload */


/* main entry point
   of the game */

const main = () => {

   if (hasGameEnded()) {

      let text = document.getElementById('game-over');
      text.innerHTML = "Game Over! Press any key\nto play again!";

      document.addEventListener('keydown', function() {
         location.reload();
      });
   }

   changingDirection = false;

   // sets game loop to a 100ms tick

   setTimeout(function onTick() {

      clearCanvas();
      drawFood();
      moveSnake();
      drawSnake();

      main();

   }, 100)
}


/* start up the
   game */

main();
generateFood();