// @TODO: YOUR CODE HERE!
var svgWidth = 900;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, 
//and shift the latter by left and top margins.
var svg = d3.select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

var circRadius;
function crGet() {
  if (width <= 530) {
    circRadius = 5;
  }
  else {
    circRadius = 10;
  }
}
crGet();

// Import Data
d3.csv("assets/data/data.csv").then(function(healthData) {

	// Step 1: Parse Data/Cast as numbers
	    // ==============================
		healthData.forEach(function(data) {
	      data.age = +data.age;
	      data.smokes = +data.smokes;
	      data.poverty = +data.poverty;
	      data.income = +data.income;
	      data.healthcare = +data.healthcare;
	      data.obesity = +data.obesity;
	      //console.log(data.age)
	    //   console.log(data.smokes)
	    });

	    // Step 2: Create scale functions
	    // ==============================
	    var xLinearScale = d3.scaleLinear()
	      .domain([20, d3.max(healthData, d => d.age)])
	      .range([0, width]);

	    var yLinearScale = d3.scaleLinear()
	      .domain([0, d3.max(healthData, d => d.smokes) + 5])
	      .range([height, 0]);


	    // Step 3: Create axis functions
	    // ==============================
	    var bottomAxis = d3.axisBottom(xLinearScale);
	    var leftAxis = d3.axisLeft(yLinearScale);


	    // Step 4: Append Axes to the chart
	    // ==============================
	    chartGroup.append("g")
	      .attr("transform", `translate(0, ${height})`)
	      .call(bottomAxis);

	    chartGroup.append("g")
	      .call(leftAxis);



	    // Step 5: Create Circles
		// ==============================
		var theCircles = svg.selectAll("g theCircles").data(healthData).enter();
		
		theCircles
			.append("text")
			.text(function(d){return d.abbr})
	    	.attr("dx", function(d){
				return xLinearScale(d.age)
			})
	    	.attr("dy", function(d) {
				return yLinearScale(d.smokes) + circRadius / 2.5;
			})
			.attr("fill", "black")
			.attr("font-size", circRadius)
			.attr("class", "stateText")

	    theCircles
			.append("circle")
			.attr("cx", d => xLinearScale(d.age))
			.attr("cy", d => yLinearScale(d.smokes))
			.attr("r", circRadius)
			.attr("class", function(d) {
				return "stateCircle " + d.abbr;
			})
			.attr("fill", "pink")
			.attr("opacity", ".5")
			// Hover rules
			.on("mouseover", function(d) {
			// Show the tooltip
				toolTip.show(d, this);
				// Highlight the state circle's border
				d3.select(this).style("stroke", "#323232");
			})
			.on("mouseout", function(d) {
				// Remove the tooltip
				toolTip.hide(d);
				// Remove highlight
				d3.select(this).style("stroke", "#e3e3e3");
			});
		
			
	    // Step 6: Initialize tool tip
      // ==============================
      	var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d) {
          return (`${d.state}<br>Age: ${d.age}<br>Smokes: ${d.smokes}`);
        });



      // Step 7: Create tooltip in the chart
      // ==============================
      	chartGroup.call(toolTip);

	    

	    // Step 8: Create event listeners to display and hide the tooltip
	    // ==============================
	    // chartGroup.on("click", function(data) {
	    //   toolTip.show(data, this);
	    // })
	    // // onmouseout event
	    //   .on("mouseout", function(data, index) {
	    //     toolTip.hide(data);
	    //   });

	    // Create axes labels
	    chartGroup.append("text")
	      .attr("transform", "rotate(-90)")
	      .attr("y", 0 - margin.left + 40)
	      .attr("x", 0 - (height / 2))
	      .attr("dy", "1em")
	      .attr("class", "axisText")
	      .text("Age vs. Smokes");


	      chartGroup.append("text")
	      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
	      .attr("class", "axisText")
	      .text("Health Data");
	  }).catch(function(error) {
	    console.log(error);


  
});