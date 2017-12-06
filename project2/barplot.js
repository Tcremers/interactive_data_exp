d3.select(window).on('load', init);

function init() {
	d3.csv(
	'temperaturesKobenhavn.csv',
	function(d) {
	  return {
		year : +d.YEAR,
		mean : +d.metANN
	  };
	},
	function(error, data) {
		if (error) throw error;
		var svgOne = d3.select('body')
					.select('#Results')
					.select('svg');
		var margin = {top: 10, right: 10, bottom: 10, left: 50};
		var width = 1200
		var height = 500
		var gOne = svgOne.append("g")
		  //.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		var x = d3.scaleBand().rangeRound([0, width]).padding(0.3)
				.domain(data.map(function(d) { if(d.year % 2 == 0){return d.year; } }));

		var y = d3.scaleLinear().rangeRound([height, 0])
				.domain([0, d3.max(data, function(d) { return d.mean; })]);

		gOne.append("g")
		.attr("class", "axis x")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x))
		.selectAll("text")
			.attr("y", 0)
			.attr("x", 9)
			.attr("dy", ".35em")
			.attr("transform", "rotate(90)")
			.style("text-anchor", "start");


		gOne.append("g")
		  .attr("class", "axis y")
		  .call(d3.axisLeft(y).ticks(10));

		gOne.selectAll(".bar")
		  .data(data)
		  .enter().append("rect")
		  .attr("x", function(d) { return x(d.year); })
		  .attr("y", function(d) { return y(d.mean); })
		  .attr("width", x.bandwidth())
		  .attr("height", function(d) { return height - y(d.mean); });
	});
}