// @TODO: YOUR CODE HERE!
d3.select(window).on('resize', makeResponsive);

// When the browser loads, makeResponsive() is called.
makeResponsive();

// The code for the chart is wrapped inside a function that automatically resizes the chart
function makeResponsive() {
    var svgArea = d3.select('body').select('svg');
    if (!svgArea.empty()) {
        svgArea.remove();
    }

    // SVG wrapper dimensions are determined by the current width and height of the browser window.
    var svgWidth = window.innerWidth;
    var svgHeight = window.innerHeight;

    var margin = { top: 20, right: 150, bottom: 100, left: 130 };

    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;

    
    var svg = d3
        .select('.chart')
        .append('svg')
        .attr('height', svgHeight)
        .attr('width', svgWidth)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Append an SVG group
    var chart = svg.append("g");

    // Append a div to the body to create tooltips, assign it a class
    d3.select(".chart").append("div").attr("class", "tooltip").style("opacity", 0);

// Import Data
d3.csv("data/d3_data.csv", function(err, healthData) {
  if (err) throw err;

   healthData.forEach(function(data) {
        data.id = +data.id;
        data.state = +data.state;
        data.abbr = +data.abbr;
        data.degree = +data.degree;
        data.dentist = +data.dentist;
    });

    // Create scale functions
    var yLinearScale = d3.scaleLinear().range([height, 0]);
    var xLinearScale = d3.scaleLinear().range([0, width]);

    // Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // These variables store the minimum and maximum values in a column in data.csv
    var xMin;
    var xMax;
    var yMin;
    var yMax;

// This function identifies the minimum and maximum values in a column in data.csv
    // and assign them to xMin, xMax, yMin, yMax variables, which will define the axis domain
    function findMinAndMax(dataColumnX, dataColumnY) {
      xMin = d3.min(healthData, function(data) {
      return +data[dataColumnX] * 0.8;
      });

      xMax = d3.max(six_five_data, function(data) {
      return +data[dataColumnX] * 1.1;
      });

      yMin = d3.min(six_five_data, function(data) {
      return +data[dataColumnY] * 0.8;
      });

      yMax = d3.max(six_five_data, function(data) {
      return +data[dataColumnY] * 1.1;
      });
  }



  var currentAxisLabelX = "degree";
  var currentAxisLabelY = "dentist";


   // Call findMinAndMax() with 'bachelorOrHigher' as default
   findMinAndMax(currentAxisLabelX, currentAxisLabelY);

   // Set the domain of an axis to extend from the min to the max value of the data column
   xLinearScale.domain([xMin, xMax]);
   yLinearScale.domain([yMin, yMax]);

   // Initialize tooltip
   var toolTip = d3
       .tip()
       .attr("class", "d3-tip")
       // Define position
       .offset([0, 0])
       // The html() method allows us to mix JavaScript with HTML in the callback function
       .html(function(data) {
       var states = data.geography;
       var valueX = +data[currentAxisLabelX];
       var valueY = +data[currentAxisLabelY];
       var stringX;
       var stringY;

   // Create tooltip
   chart.call(toolTip);
    
   // Create circle
   chart
       .selectAll("circle")
       .data(healthData)
       .enter()
       .append("circle")
       .attr("cx", function(data, index) {
       return xLinearScale(+data[currentAxisLabelX]);
       })
       .attr("cy", function(data, index) {
       return yLinearScale(+data[currentAxisLabelY]);
       })
       .attr("r", "18")
       .attr("fill", "lightblue")
       .attr("class", "circle")
       // display tooltip by d3-Tip
       .on('mouseover', toolTip.show)
       .on('mouseout', toolTip.hide);
   
   // Create abbrivation of states to show on the circle
   chart
       .selectAll("text")
       .data(healthData)
       .enter()
       .append("text")
       .attr("x", function(data, index) {
         return xLinearScale(+data[currentAxisLabelX]);
       })
       .attr("y", function(data, index) {
         return yLinearScale(+data[currentAxisLabelY]);
       })
       .attr("dx", "-0.65em")
       .attr("dy", "0.4em")
       .style("font-size", "13px")
       .style("fill", "white")
       .attr("class", "abbr")
       .text(function(data, index) {
         return data.abbr;
       });

   // Select all texts on circle to create a transition effect, then relocate its location
        // based on the new axis that was selected/clicked
        d3.selectAll(".abbr").each(function() {
          d3
          .select(this)
          .transition()
          .attr("x", function(data) {
              return xLinearScale(+data[currentAxisLabelX]);
          })
          .attr("y", function(data, index) {
              return yLinearScale(+data[currentAxisLabelY]);
          })
          .duration(1800);
      });
      // Change the status of the axes. See above for more info on this function.
      labelChange(clickedSelection, corrAxis);
      });