d3.select(window).on('load', init);

function init() {

    var svg = d3.select('svg')
    var margin = {top: 50, right: 50, bottom: 200, left: 50};
    //var width = +svg.node().getBoundingClientRect().width - margin.left - margin.right;
    //var height = +svg.node().getBoundingClientRect().height - margin.top - margin.bottom;
	var width = 960;
	var height = 500;
    
	var svg = d3.select("body")
			.select("#crimes")
			.append("svg")

    // Choose projection
    var projection = d3.geoMercator()
		.center([-122.3283, 37.7550])
		.scale((1 << 20) / 2.5 / Math.PI)
		.translate([width / 2, height / 2]);
  
    // Setup path generator
    var path = d3.geoPath()
                 .projection(projection);
				 
				 
	// Define linear color scale for output			 
	var color = d3.scaleLinear()
		.range(['#ffffe0','#b22222']);
	
	var dict = {};
	
	var legendText = ["0", "500", "1000", "1500", "2000"];
	var legendValues = [0,500,1000,1500,2000];
    var daysOfTheWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturdat", "Sunday"];
	var maxCrimes = 0;
	d3.json("sfpd_districts.geojson",
            function(error, data) {
	d3.json("sf_crime.geojson",
            function(error, crime) {				
				
		if (error) throw error;
		//console.log(crime.features[0].properties.PdDistrict);
		
		for (var i = 0; i < crime.features.length; i++) {
			if(dict[crime.features[i].properties.PdDistrict] > 0){
				dict[crime.features[i].properties.PdDistrict] += 1
			}
			else{
				dict[crime.features[i].properties.PdDistrict] = 1;
			};
			if(dict[crime.features[i].properties.DayOfWeek] > 0){
				dict[crime.features[i].properties.DayOfWeek] += 1
			}
			else{
				dict[crime.features[i].properties.DayOfWeek] = 1;
			};
			if(dict[crime.features[i].properties.DayOfWeek] > maxCrimes){
				maxCrimes = dict[crime.features[i].properties.DayOfWeek];
			}
			
		}
		console.log(maxCrimes);
		console.log(dict);	
		
		svg.selectAll("path")	
			.data(data.features)
			.enter()
			.append("path")
			.attr("d", path)
			.style("stroke", "#fff")
			.style("stroke-width", "1")
			.style("fill", function(d) {
				return color(dict[d.properties.district]/800);
			});
		svg.selectAll("text")
			.data(data.features)
			.enter()
			.append("svg:text")
			.text(function(d){
				return d.properties.district;
			})
			.attr("x", function(d){
				return path.centroid(d)[0];
			})
			.attr("y", function(d){
				return  path.centroid(d)[1];
			})
			.attr("text-anchor","middle")
			.attr('font-size','6pt')
			.style('fill', 'Gold')
			
		var legend = d3.select("body").select("#crimes").append("svg")
			.attr("class", "legend")
			.attr("width", 140)
			.attr("height", 200)
			.selectAll("g")
			.data(legendValues)
			.enter()
			.append("g")
			.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
		legend.append("rect")
			.data(legendValues)
			.attr("width", 18)
			.attr("height", 18)
			.style("fill", function(d){return color(d/800)});
		legend.append("text")
			.data(legendText)
			.attr("x", 24)
			.attr("y", 9)
			.attr("dy", ".35em")
			.text(function(d) { return d; });
			
			
		
	
	})
    })
}