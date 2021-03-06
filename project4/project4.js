var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 560 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x1 = d3.scale.linear()
    .range([0, width]);

var y1 = d3.scale.linear()
    .range([height, 0]);
	
var svgOne = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


	
	
	
	
// Set the ranges
var x2 = d3.time.scale().range([0, width]);
var y2 = d3.scale.linear().range([height, 0]);

// Define the axes
var xAxis = d3.svg.axis().scale(x2)
	.orient("bottom").ticks(5);

var yAxis = d3.svg.axis().scale(y2)
	.orient("left").ticks(5);

// Define the line
var valueline = d3.svg.line()
	.x(function(d) { return x2(d[0]); })
	.y(function(d) { return y2(d[1]); });

var svgTwo = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
d3.text("hands_pca.csv", function(textOne) {
	d3.text("hands.csv", function(textTwo) {
	 
	 // Coerce the strings to numbers.
	  var dataOne = d3.csv.parseRows(textOne).map(function(row) {
		return row.map(function(value) {
		  return +value;
		});
	  });

	  var dataTwo = d3.csv.parseRows(textTwo).map(function(row) {
		return row.map(function(value) {
		  return +value;
		});
	  });


	  // Compute the scales� domains.
	  x1.domain(d3.extent(dataOne, function(d) { return d[0]; })).nice();
	  y1.domain(d3.extent(dataOne, function(d) { return d[1]; })).nice();
	  
	  
	  // Add the x-axis.
	  svgOne.append("g")
		  .attr("class", "x1 axis")
		  .attr("transform", "translate(0," + height + ")")
		  .call(d3.svg.axis().scale(x1).orient("bottom"));

	  // Add the y-axis.
	  svgOne.append("g")
		  .attr("class", "y1 axis")
		  .call(d3.svg.axis().scale(y1).orient("left"));

	  // Add the points!
	  svgOne.selectAll(".point")
		  .data(dataOne)
		.enter().append("path")
		  .attr("class", "point")
		  .attr("d", d3.svg.symbol().type("dot"))
		  .attr("transform", function(d) { return "translate(" + x1(d[0]) + "," + y1(d[1]) + ")"; })
		  .on("load", function(d,i){mousemove(1); })
		  .on("mouseover", function(d,i){mousemove(i); });
		  
	  
	  
		// Scale the range of the data
		x2.domain(d3.extent(dataTwo[1].slice(0,56), function(d) { return d[0]; }));
		y2.domain([0, d3.max(dataTwo[1].slice(0,56), function(d) { return d[1]; })]);

		// Add the valueline path.
		svgTwo.append("path")
			.attr("class", "line")
			.attr("d", valueline(0));

		// Add the X Axis
		svgTwo.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis);

		// Add the Y Axis
		svgTwo.append("g")
			.attr("class", "y axis")
			.call(yAxis);
		  
	  function mousemove(i) {
		console.log(i);
		var xs = dataTwo[i].slice(0,56);
		var ys = dataTwo[i].slice(56);
		var data = [];
		
		for (var i = 0; i < xs.length; i++) {
			data.push([xs[i],ys[i]]);
		}
		
		// Scale the range of the data again 
    	x2.domain(d3.extent(data, function(d) { return d[0]; }));
	    y2.domain([0, d3.max(data, function(d) { return d[1]; })]);

		// Select the section we want to apply our changes to
		var svgTwo = d3.select("body").transition();

		// Make the changes
			svgTwo.select(".line")   // change the line
				.duration(750)
				.attr("d", valueline(data));
			svgTwo.select(".x.axis") // change the x axis
				.duration(750)
				.call(xAxis);
			svgTwo.select(".y.axis") // change the y axis
				.duration(750)
				.call(yAxis);
	  }
	});
});