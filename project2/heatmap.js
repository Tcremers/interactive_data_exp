var data;
var matrix_data = [];

$.get('temperature_copenhagen.txt', function(d){
	data = d;
	
	
	
	data = data.split(/\r?\n/);
	data_header = data[0].split(/[ ]+/);
	data_header.shift(); 
	data.shift();
	
	for(var i = 0; i < data.length; i++){
		var line = data[i].split(/[ ]+/);
		//data_header.push(line[0]);
		line.shift();
		matrix_data.push(line);
	}
	
	
	// Flatten matrix
	var m = matrix_data.length;
	var n = matrix_data[0].length;
	flat_data = [].concat.apply([], matrix_data);


	// Largest value in data. Used to scale colors.
	var maxval = d3.max(flat_data);

	// Initialiation function. Called after body has loaded
	var w = 1000;
	var h = 1000;
	var svgTwo = d3.select('body')
			  .select('#Results')
			  .append('svg')
			  .attr('width', w)
			  .attr('height', h);
	
	var sqW = w/n;
	var sqH = h/m;
	var x = d3.scaleBand().rangeRound([10, w]).domain(data_header.map(function(d) { return d; }));
	
	// Create rects for entry and color them according to value
	
	svgTwo.append("g")
		.attr("class", "axis axis--x")
		//.attr("transform", "translate(0," + h + ")")
		.call(d3.axisBottom(x));

			
	svgTwo.selectAll('rect')
	  .data(flat_data)  
	  .enter()
	  .append('rect')
	  .attr('x',function(d,i){
		var col = i%n;
		var offset = 10;
		return col*sqW+offset;
	  })
	  .attr('y',function(d,i){
		var row = Math.floor(i/n);
		var offset = 20;
		return row*sqH+offset;
	  })
	  .attr('width' , w/n+1)
	  .attr('height', h/m+1)
	  .style('fill',function(d){
		var I = Math.round(120*(1 - d/maxval)+150);
		return 'rgb('+I+','+(I-100)+','+(I-100)+')'; 
	  });
			  
});
		