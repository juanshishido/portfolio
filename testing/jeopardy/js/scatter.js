// Scatter plot options
var canvas_width = 600;
var canvas_height = 500;
var opacity = 1;
var padding = 75;  // for chart edges
var circle_radius = 3;


// Place dictionary
var placeDict = {
    1 : "First",
    2 : "Second",
    3 : "Third"
};

// Y axis drop down values
var yDropVals = ["Actual", "Percentage"];

// Mapping of Y axis drop down values to variable names
var yOptionsDict = {
    "Actual" : "wager",
    "Percentage" : "wager_pct"
};

// Generate Y axis drop down
var yDropDown = d3.select("#y-filter").append("select")
                  .attr("name", yDropVals);

var yOptions = yDropDown.selectAll("option")
                        .data(yDropVals)
                        .enter()
                        .append("option");

yOptions.text(function (d) { return d; })
        .attr("value", function (d) { return yOptionsDict[d]; });

// Define colors
var colors = d3.scale.ordinal()
               .domain([1, 2, 3])
               .range(["#3182bd", "#9ecae1", "#deebf7"]);

// Data parse
var parseDate = d3.time.format("%Y-%m-%d %H:%M:%S").parse;

// More global variables
var headerNames = [];
var scatterData = [];
var colPositions = {};

// Load
d3.csv("./data/scatter.csv", function(data) {
    headerNames = d3.keys(data[0]);
    scatterData = data.map(function(d) {
        return [+d.dj30, +d.fj1, +d.place_before, +d.place_after, +d.year, d.date, +d.season, +d.wager, +d.wager_pct, d.correct];
    });

    // Randomly order data
    d3.shuffle(scatterData);

    // Header names and positions
    for (i = 0; i < headerNames.length; i++) {
        colPositions[headerNames[i]] = headerNames.indexOf(headerNames[i]);
    };

    // Season 1
    var filteredData = scatterData.filter(function(d) {
        if (d[colPositions["season"]] == 1) {
            return d;
        }
    });

    // Dates
    filteredData.forEach(function(d,i) {
        d.date = parseDate(d[colPositions["date"]]);
    });
console.log(filteredData.length);
    // Y axis label names
    var e = yDropDown[0][0];
    var yLabel = e.options[e.selectedIndex].text;

    // Create scale function (earnings-based)
    var xScale = d3.scale.linear()
                   .domain([0, d3.max(filteredData, function(d) {
                        return d[colPositions["dj30"]];  // input domain
                   })])
                   .range([padding, canvas_width - padding / 2]);

    var yScale = d3.scale.linear()  // yScale is height of graphic
                   .domain([0, d3.max(filteredData, function(d) {
                        return d[colPositions["wager"]];  // input domain
                   })])
                   .range([canvas_height - padding, padding]);  // remember y starts on top going down so we flip

    // Define X axis
    var xAxis = d3.svg.axis()
                  .scale(xScale)
                  .orient("bottom")
                  .ticks(5);

    // Define Y axis
    var yAxis = d3.svg.axis()
                  .scale(yScale)
                  .orient("left")
                  .ticks(5);

    // Create SVG element
    var svg = d3.select("#scatter-chart")  // This is where we put our viz
                .append("svg")
                .attr("width", canvas_width)
                .attr("height", canvas_height);

    // Create Circles
    svg.selectAll("circle")
       .data(filteredData)
       .enter()
       .append("circle")  // Add circle svg
       .attr("cx", function(d) {
            return xScale(d[colPositions["dj30"]]);  // Circle's X
       })
       .attr("cy", function(d) {  // Circle's Y
            return yScale(d[colPositions["wager"]]);
       })
       .attr("r", circle_radius)  // radius
       .attr("fill", function (d) {return colors(d[2]);})
       .attr("opacity", opacity)
       .on("mouseover", function(d) {
            d3.select(this).transition()
                           .duration(600)
                           .attr("r", 6).ease("elastic")
       })
       .on("mouseout",  function(d) { 
            d3.select(this).transition()
                           .duration(600)
                           .attr("r", circle_radius).ease("elastic")
       });


    // Add to X axis
    svg.append("g").attr("class", "x axis")
                   .attr("transform", "translate(0," + (canvas_height - padding) +")")
                   .attr("fill", "DimGray")
                   .call(xAxis)
       .append("text")
                   .attr("class", "x-label")
                   .attr("x", canvas_width - padding / 2)
                   .attr("y", 45)
                   .style("text-anchor", "end")
                   .text("Winnings Going Into Final Jeopardy!");

    // Add to Y axis
    svg.append("g").attr("class", "y axis")
                   .attr("transform", "translate(" + padding +",0)")
                   .attr("fill", "DimGray")
                   .call(yAxis)
       .append("text")
                   .attr("class", "y-label")
                   .attr("transform", "rotate(-90)")
                   .attr("x", -padding)
                   .attr("y", -70)
                   .attr("dy", ".71em")
                   .style("text-anchor", "end")
                   .text(yLabel);

    // Update with new Y axis data on select
    yDropDown.on("change", function() {

        // Season
        var season = slider.property("value");
        var filteredData = scatterData.filter(function(d) {
            if (d[colPositions["season"]] == season) {
                return d;
            }
        });

        // Dates
        filteredData.forEach(function(d,i) {
            d.date = parseDate(d[colPositions["date"]]);
        });

        // Y axis label names
        var e = yDropDown[0][0];
        var yLabel = e.options[e.selectedIndex].text;

        // Column positions
        var yVal = +colPositions[this.value];
        
        // Update scale domains
        if (yLabel == "Percentage") {
            yScale.domain([0, 1]); // Max of 1 for Percentage view
        }
        else {
            yScale.domain([0, d3.max(filteredData, function(d) {
                return d[yVal]; })]);
        }

        // Update circles
        svg.selectAll("circle")
           .data(filteredData)  // Update with new data
           .transition()  // Transition from old to new
           .duration(1000)  // Length of animation
           .each("start", function() {  // Start animation
                d3.select(this)  // 'this' means the current element
                  .attr("r", 2);  // Change size
           })
           .delay(function(d, i) {
                return i / filteredData.length * 500;  // Dynamic delay (i.e. each item delays a little longer)
           })
           .attr("cy", function(d) {
                return yScale(d[yVal]);  // Circle's Y
           })
           .each("end", function() {  // End animation
                d3.select(this)  // 'this' means the current element
                  .transition()
                  .duration(500)
                  .attr("r", circle_radius);
           });

        // Update Y Axis
       svg.select(".y.axis")
          .transition()
          .duration(1500)
          .ease("exp-in-out")
          .call(yAxis);

       svg.select(".y-label")
          .text(yLabel);

    });

});