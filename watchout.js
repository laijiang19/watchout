// start slingin' some d3 here.

var width = 1000;
var height = 600;
var numEne = 20;
var generated = false;

var setBoard = function(){
  return d3.select(".board").append("svg")
    .attr("width", width)
    .attr("height", height);
};

var svg = setBoard();

  // .append("g")
  //   .attr("transform", "translate(32," + (height / 2) + ")");

// var data = new Array(numEne);

// for (var i = 0; i < data.length; i++){
//   data[i] = [];
//   data[i].push(Math.random() * height * 0.75);
//   data[i].push(Math.random * width * 0.75);

  //[random(), random(), random()]
  //d3.select().data([a, b, c])
  //.attr("r", function (a) {})
  //.
// }


var circle = svg. selectAll('circle').data([[100, 50, 10]]); 

  // circle
  //   .enter()
  //   .append('circle')
  //   // .attr("cx", function(d){return d[0]})
  //   // .attr("cy", function(d){return d[1]})
  //   .attr("r", function(d){return d[2];})
  //   .attr("fill", "white")
  //   .append("animate") // attrName cx cy
  //   .attr("attributeName", "cx")
  //   .attr("from", function(d){return d[0];})
  //   .attr("to", random(150))
  //   .attr("dur", "5s")
  //   .append("animate")
  //   .attr("attributeName", "cy")
  //   .attr("from", function(d){return d[1];})
  //   .attr("to", random(100))
  //   .attr("dur", "5s")

var count = 0;

var generateEnemy = function(data) { //[[0,1,2]]
  count ++;

  var circles = svg.selectAll('circle').data(data);
  // console.log(circles);

  circles.enter().append('circle')
                 .transition()
                 .attr("cx", function(d){return d[0];})
                 .transition()
                 .attr("cy", function(d){return d[1];})
                 .transition()
                 .attr("r", function(d){return d[2];})
                 .attr("class", "enemy")
                 // .attr("from", function(d){})
                 //cx from, to, dur
                 .attr("fill", "white");
};

var updateEnemy = function(data) {
  var circles = svg.selectAll('circle').data(data);

  // for (var i = 0; i < circle.length; i++){
  // circles.transition()
  //             //.transition()
  circles.each(function (d, i) {
    d3.select(this).transition()
                   .attr("r", function(d){return d[2];})
                   .attr("transform", ("rotate("+ random(360) + "," + random(100) + "," + random(100) + ")"), ("translate(10, 10)"))
                   .attr("fill", "white");
  });

  // }
  
                 // .attr("cx", function(d){return d[0];})
                 // .transition()
                 // .attr("cy", function(d){return d[1];})

                 // .attr("from", function(d){})
                 //cx from, to, dur

};

// attr('transform', ("rotate(" + this.angle + "," + (this.getX()) + "," + (this.getY()) + ") ") 
// + ("translate(" + (this.getX()) + "," + (this.getY()) + ")"));
//     };


var timer = function(){
  var data = [];
  for (var i = 0; i <= numEne; i++) {
    var temp = [];
    temp.push(random(height));
    temp.push(random(width));
    temp.push(random(10, 2)); // [[a, b, c], [1, 2, 3]] 
    data.push(temp);

    if (generated){
      updateEnemy(data);
    }
    else {
      generateEnemy(data);
    }
  }
  generated = true;
};
//timer();


setInterval(timer, 1000);

function random (n, m) {
  n = n || 1;
  m = m || 0;
  return Math.random() * n + m;
}

// data.push(Math.random() * 10 + 2);

//d3.timer(function[, delay[, time]])
//transition.attr(name, value)
//var position = d3.
// var update = function(){

// };