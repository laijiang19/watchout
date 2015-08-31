var width = 1000;
var height = 600;
var numEne = 25;
var generated = false;
var gameStarted = false;
var gameTimer, scoreTimer, highlightTimer;
var collision = 0;
var mouseColliding = false;
var score = 0;
var highscore = 0;

// function to set the gameboard
var setBoard = function(width, height){
  return d3.select(".board").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background-color", 'rgb(10, 10, 10)')
    .append("g");
};

// generate player
var generatePlayer = function(data){
  var player = d3.select(".board").select('svg').selectAll('circle').data(data);
  player.enter().append('circle')
            .transition()
            .attr("cx", function(d){return d[0]})
            .attr("cy", function(d){return d[1]})
            .attr("r", 15)
            .attr("class", "player")
            .attr("fill", "white");

  // update event listener to listen to the click event           
  player.on('click', function(){
    if(!gameStarted){
      gameStarted = true;
      updateData();
      gameTimer = setInterval(updateData, 2000);
      scoreTimer = setInterval(updateScore, 1000);
      highlightTimer = setInterval(highlight, random(4000, 2000));
    }
    else {
      clearInterval(gameTimer);
      clearInterval(scoreTimer);
      clearInterval(highlightTimer);
      d3.select('path').remove();
      gameStarted = false;
      d3.select(this).transition().duration(1000).attr('fill', 'white');
    }
  });
};

// invoke the setBoard function to set the board and player
var board = setBoard(width, height);
var player = generatePlayer([[width/2, height/2]]);

// update player
var updatePlayer = function(data){
  var player = d3.select(".board").select('svg').selectAll('.player').data(data);
  player.transition()
        .duration(90)
        .attr("cx", function(d) {return d[0]})
        .attr("cy", function(d) {return d[1]})
        .attr("fill", function(d) {return "rgb(" + Math.floor(d[1]/4) + "," + 200 + "," + Math.floor(d[0]/4) + ")"});
};

// generate and update enemy
var updateEnemy = function(data) {
  var circles = board.select('g').selectAll('circle').data(data);
  var enemies = board.selectAll('.enemy');
  var highlight = board.selectAll('.highlight');
  var player = d3.selectAll('.player');
  var cx, cy;

  // generate enemy if not generated; else update
  if (!generated){ 
    generated = true;
    circles.enter().append('circle')
                   .transition()
                   .delay(500)
                   .duration(1000)
                   .attr('opacity', 1)
                   .attr("cx", function(d){return d[0];})
                   .attr("cy", function(d){return d[1];})
                   .attr("r", function(d){return d[2];})
                   .attr("class", "enemy")
                   .attr("colliding", false)
                   .attr("fill", "none");  
  }
  else { 
    enemies.each(function(d, i){
      // update enemy position and size
      d3.select(this).transition()
                     .duration(1000)
                     .tween('custom', tweenCollision)
                     // .duration(level("nightmare"))
                     .attr("r", function(d){return d[2];});
                   });
  }
  highlight.each(function(d, i){
    d3.select(this).transition().duration(1000)
                   .tween('custom', tweenCollision);
  });
};

var updateData = function(){
  var data = [];
  for (var i = 0; i <= numEne; i++) {
    var temp = [];
    temp.push(random(width - 40, 20));
    temp.push(random(height - 40, 20));
    temp.push(random(10, 5));
    data.push(temp);
  }
  updateEnemy(data);
};


// ------- gloabl event listeners -------
// check board for mousemove event to update the player
d3.select('.board').on('mousemove', function(){
  if (gameStarted) {
    // get current mouse position info
    var x = d3.mouse(this)[0];
    var y = d3.mouse(this)[1];
    var newPosition = [[x, y]];
    var circles = d3.select('g').selectAll('circle');
    var player = d3.select('.player');

    // update player position
    updatePlayer(newPosition);

    // invoke tick function to draw a dotted path
    d3.select('svg').on('mousemove', function(){
      tick(d3.mouse(this), x, y);
    });

    // check collision on every enemy element
    circles.each(function(){
      checkCollision(d3.select(this), player);
    });
  }
});

//------- helper function below --------
// helper function to generate random numbers 
function random(n, m, curr) {
  n = n || 1;
  m = m || 0;
  if(curr !== undefined){
    return Math.random() * n - curr; 
  }
  return Math.random() * n + m;
}

// helper function to pass in updatePlayer's tween method
function tweenCollision(d) {
  // tween helper function - keyword 'this' is refered to the element being transitioned
  var enemy = d3.select(this);
  var colliding = enemy.attr('colliding');
  var player = d3.select('.player');
  var startPos = {
    x: parseFloat(enemy.attr('cx')),
    y: parseFloat(enemy.attr('cy'))
  };

  var endPos = {
    x: random(width),
    y: random(height)
  };
  return function(t) {
    var enemyNextPos;
    if (colliding === 'false' && enemy.attr('class' !== 'highlight')){
      checkCollision(enemy, player);
    }
    enemyNextPos = {
      x: startPos.x + (endPos.x - startPos.x) * t,
      y: startPos.y + (endPos.y - startPos.y) * t
    };
    return enemy.attr('cx', enemyNextPos.x).attr('cy', enemyNextPos.y);
  };
}

function checkCollision(enemy, player){
  var enemyPos = {
    x: parseFloat(enemy.attr('cx')),
    y: parseFloat(enemy.attr('cy')),
    r: parseFloat(enemy.attr('r')),
    colliding: enemy.attr('colliding'),
    'class': enemy.attr('class')
  };
  var playerPos = {
    x: parseFloat(player.attr('cx')),
    y: parseFloat(player.attr('cy')),
    r: parseFloat(enemy.attr('r'))
  };

  if (Math.pow(enemyPos.x - playerPos.x, 2) + Math.pow(enemyPos.y - playerPos.y, 2) < Math.pow(enemyPos.r + playerPos.r, 2)){
    if (enemyPos.colliding === 'false'){
      if (enemyPos['class'] === 'enemy'){ 
        collision++;
        //set background color to red if collision happens
        d3.select('.board').select('svg').transition().duration(150).style('background-color', 'rgb(200, 0, 50)');
        updateCollision();
        enemy.attr('colliding', true);
      }
      else if (enemyPos['class'] === 'highlight') {
        score += 100;
        enemy.attr('colliding', true);
        enemy.style('display', 'none');
      }
    }
  }
  else {
    enemy.attr('colliding', false);
    //set background color back if no collision
    d3.select('.board').select('svg').transition().delay(100).duration(50).style('background-color', 'rgb(10, 10, 10)');
  }
}

function updateScore(){
  score++;
  d3.select('.current').select('span').html(score);
}

function updateCollision(){
  if (collision >= 10){
    if (score > highscore){
      highscore = score;
      d3.select('.high').select('span').html(highscore);
    }
    score = 0;
    collision = 0; 
    d3.select('g').selectAll('circle').style('display', 'inline-block').attr('class', 'enemy');
  }
  d3.select('.collisions').select('span').html(collision);
}

function highlight(){
  var enemyArray = d3.selectAll(".enemy");
  var length = enemyArray[0].length - 1;
  var index = Math.floor(Math.random() * length);
  var r = Math.floor(random(150, 101));
  var g = Math.floor(random(150, 101));
  var b = Math.floor(random(150, 101));
  d3.select(enemyArray[0][index]).transition()
    .duration(1000)
    .attr("class", "highlight")
    .attr("stroke", "white")
    .attr("r", 25)
    .attr("fill", "rgb(" + r + "," + g + ", " + b + ")");
  setTimeout(function(){
    return unhighlight(d3.select(enemyArray[0][index]));
  }, 3000);
}

function unhighlight(element){
  element.attr("class", "enemy");
}

//------- generated dotted path helper functions and vars --------
var ptdata = [];

var line = d3.svg.line()
    .interpolate("basis")
    .x(function(d, i) { return d[0]; })
    .y(function(d, i) { return d[1]; });

var path = board.append("g")
  .append("path")
    .data([ptdata])
    .attr("class", "line")
    .attr("d", line);

function tick(pt, x, y) {
  ptdata.push(pt);
  path.attr("d", function(d) { return line(d);})
      .attr("stroke", "rgb(" + Math.floor(x/4) + ", "  + 160 + ", " + Math.floor(y/4) + ")");
  if (ptdata.length > 100) {
    ptdata.shift();
  }
}

