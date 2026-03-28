/*TRY TO REACH THE GOAL BY PRESSING ARROW KEYS -
BUT YOU CAN'T SEE VERY FAR, SO BE CAREFUL OF OBSTACLES!*/

//for sound effects
let movingSound;
let levelSound;

//for transitions between levels - screen fades to black!
var transitioning = false;
var transitionColour = 0;

//additional variable for smooth movement (using lerp)
var movingPlayer = { x: 0, y: 0 };

//how far player can see (a radius!!)
var visible = 1.5

//1 on grid = obstacle, 0 = nothing there.
let levels = [
  {
    grid: [
      [0,0,0,0,0],
      [0,0,1,0,0],
      [0,0,1,0,0],
      [0,0,0,0,0],
      [0,0,0,1,0]
    ],
    start: {x:1, y:1},
    goal: {x:3, y:1}
  },
  {
    grid: [
      [0,0,0,0,0],
      [0,1,1,0,0],
      [0,0,0,0,0],
      [0,0,1,0,0],
      [0,0,0,0,0]
    ],
    start: {x:0, y:0},
    goal: {x:4, y:4}
  },
  {
    grid: [
      [0,0,1,0,0],
      [1,0,1,0,1],
      [0,0,0,0,0],
      [0,1,1,1,0],
      [0,0,0,0,0]
    ],
    start: {x:0, y:0},
    goal: {x:4, y:2}
  },
  {
    grid: [
      [0,0,0,0,1],
      [0,1,1,0,0],
      [0,0,0,1,0],
      [0,1,1,0,0],
      [0,0,0,0,0]
    ],
    start: {x:2, y:2},
    goal: {x:4, y:1}
  },
  {
    grid: [
      [0,0,1,0,0],
      [1,1,0,0,0],
      [0,0,1,1,0],
      [0,1,1,0,0],
      [0,0,0,0,0]
    ],
    start: {x:2, y:1},
    goal: {x:1, y:2}
  },
  {
    grid: [
      [0,0,0,0,1],
      [0,1,0,0,0],
      [0,0,0,1,0],
      [1,0,1,0,0],
      [1,1,0,0,0]
    ],
    start: {x:4, y:4},
    goal: {x:0, y:1}
  }
];

//keeping track of level user is on.
let currentLevel = 0;

//initialise player, grid and goal.
let player;
let grid;
let goal;

//how big the squares making up the grid are
var squareSize = 80;

function preload(){
  movingSound = loadSound('movingsound.mp3');
  levelSound = loadSound('levelsound.mp3');
}

function loadLevel(index) {
  let level = levels[index];

  grid = level.grid;
  player = { ...level.start }; //'...' copies object - not a reference!!
  goal = { ...level.goal };
  
  movingPlayer.x = player.x;
  movingPlayer.y = player.y;
}

function setup() {
  createCanvas(400, 400);
  loadLevel(0);
}

function draw() {
  
  movingPlayer.x = lerp(movingPlayer.x, player.x, 0.2);
  movingPlayer.y = lerp(movingPlayer.y, player.y, 0.2);
  
  //clear screen
  background(220);
  //lighter grid lines
  stroke(180);
  
  //loop through the 5 rows
  for(var y = 0; y < 5; y++){
    //loop through the 5 columns for each row
    for(var x = 0; x < 5; x++){
      var d = dist(x,y,player.x,player.y);
      
      //visible squares
      if(d <= visible){
        //if there is an obstacle(1), change colour.
        if (grid[y][x] === 1) {
          fill(30);
        }
        else{
          fill(220);
        }
      }
      //hidden squares
      else{
        fill(0,0,0,30);
      }
      
      //draw the actual square with all info
      rect(x*squareSize, y*squareSize, squareSize, squareSize);
    }
  }
  
  //drawing the goal (not seen if too far though!)
  var goalDistance = dist(goal.x, goal.y, player.x, player.y);
  if(goalDistance <= visible){
    fill(200, 100, 200);
    rect(goal.x * squareSize, goal.y * squareSize, squareSize, squareSize);

    fill(250,200,250);
    ellipse(
      goal.x * squareSize + squareSize/2,
      goal.y * squareSize + squareSize/2,
      squareSize * 0.8
    );
  }
  
  //drawing the player as a circle
  fill(200,100,200);
  ellipse(
    movingPlayer.x * squareSize + squareSize/2,
    movingPlayer.y * squareSize + squareSize/2,
    squareSize * 0.8
  )
  
  //if reach goal, move to next level through transition!
  if (player.x === goal.x && player.y === goal.y && !transitioning) {
    levelSound.play();
    transitioning = true;
  }
  
  if(transitioning){
    transitionColour += 10;
    fill(0, transitionColour);
    rect(0,0,width, height);
    
    //colour has become black, move to next level instead
    if(transitionColour >= 255){
      currentLevel++;

      if (currentLevel >= levels.length) {
        currentLevel = 0; //loop back when finish all available levels.
      }

      loadLevel(currentLevel);
      transitionColour = 0;
      transitioning = false;
    }
  }
  
}

//moving when player presses arrows!!
function keyPressed(){
  let xChange = 0;
  let yChange = 0;
  
  //changes in x and y depending on the key pressed
  if(keyCode == UP_ARROW){
    yChange = -1;
  }
  if(keyCode == RIGHT_ARROW){
    xChange = 1;
  }
  if(keyCode == DOWN_ARROW){
    yChange = 1;
  }
  if(keyCode == LEFT_ARROW){
    xChange = -1;
  }
  
  //player's new position
  var newX = player.x + xChange;
  var newY = player.y + yChange;
  
  //player only moves to new position if free + inside grid bounds
  if(inGrid(newX, newY)){
    player.x = newX;
    player.y= newY;
    movingSound.play();
  }
  
}

//checking if within grid AND not an obstacle
function inGrid(x, y){
  //uses triple equals instead of double to check data type as well
  if(x >=0 && y>= 0 && x < 5 && y < 5 && grid[y][x] === 0){
    return true;
  }
  else{
    return false;
  }
}
