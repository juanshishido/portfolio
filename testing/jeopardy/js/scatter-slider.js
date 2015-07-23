// SCATTER
// Scatter plot options
var canvas_width = 600;
var canvas_height = 600;
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

var scatterTip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
        return "$" + d[colPositions["wager"]] + " (" + Math.round(d[colPositions["wager_pct"]] * 100) + "%) wager on<br/>" + moment(d[colPositions["date"]]).format("MMM DD, YYYY");
    });

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

    // Default season 1
    var filteredData = scatterData.filter(function(d) {
        if (d[colPositions["season"]] == 1) {
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

    // Create scale function (earnings-based)
    var maxVal = d3.max(filteredData, function(d) {
                    return d3.max([d[colPositions["dj30"]], d[colPositions["wager"]]]);
                });

    var xScale = d3.scale.linear()
                   .domain([0, maxVal])
                   .range([padding, canvas_width - padding / 2]);

    var yScale = d3.scale.linear()
                   .domain([0, maxVal])
                   .range([canvas_height - padding, padding]);

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
    var scatter = d3.select("#scatter-chart")
                    .append("svg")
                    .attr("width", canvas_width)
                    .attr("height", canvas_height);

    scatter.call(scatterTip);

    // Create circles
    scatter.selectAll("circle")
           .data(filteredData)
           .enter()
           .append("circle")  // Add circle svg
           .attr("cx", function(d) {
                return xScale(d[colPositions["dj30"]]);
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
                scatterTip.show(d)
           })
           .on("mouseout", function(d) { 
                d3.select(this).transition()
                               .duration(600)
                               .attr("r", circle_radius).ease("elastic")
                scatterTip.hide(d)
           });


    // Add to X axis
    scatter.append("g").attr("class", "x axis")
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
    scatter.append("g").attr("class", "y axis")
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

    // Title
    scatter.append("text")
           .attr("class", "scatter-title")
           .text("Season 1 Wagers")
           .attr("x", (canvas_width / 2) - padding)
           .attr("y", padding / 2)
           .style("text-anchor", "center");

    // SLIDER CHANGE
    slider.on("change", function() {

        // HEATMAP

        // Season and year
        var season = slider.property("value");
        var year = 1983 + parseInt(season);

        var elem = document.getElementById("cal-heatmap");
        elem.parentNode.removeChild(elem);

        var chart = d3.select("#heatmap-container").append("div").attr("id", "cal-heatmap");
        var heatmapData;
        d3.json("data/heatmap.json", function(json) {
            heatmapData = json[season];

            var calendar = new CalHeatMap();
            calendar.init({
                data : heatmapData,
                start: new Date(year, 7),
                domain : "month",
                subDomain : "day",
                range : 13,
                legend: [10000, 15000, 20000, 25000],
                legendColors : {
                    min : "#deebf7",
                    max : "#3182bd"
                }
            });
        });

        // SCATTER

        // Slider-based season
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

        // Create scale function (date-based)
        var maxVal = d3.max(filteredData, function(d) {
                    return d3.max([d[colPositions["dj30"]], d[colPositions["wager"]]]);  // input domain
                });

        var xScale = d3.scale.linear()
                       .domain([0, maxVal])
                       .range([padding, canvas_width - padding / 2]);

        // Update scale domains
        if (yLabel == "Percentage") {
            var yScale = d3.scale.linear()
                           .domain([0, 1]) // Max of 1 for Percentage view
                           .range([canvas_height - padding, padding]);
        }
        else {
            var yScale = d3.scale.linear()  // yScale is height of graphic
                           .domain([0, maxVal])
                           .range([canvas_height - padding, padding]);  // remember y starts on top going down so we flip
        }

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

        // Add new data
        scatter.selectAll("circle")
           .data(filteredData)
           .enter()
           .append("circle")
           .attr("cx", function(d) {
                return xScale(d[colPositions["dj30"]]);  // Circle's Y
           })
           .attr("cy", function(d) {
                return yScale(d[colPositions[yOptionsDict[yLabel]]]);  // Circle's Y
           })
           .attr("r", 0)  // radius
           .transition()
           .duration(2000)
           .attr("fill", "Gray")
           .attr("r", circle_radius);

        // Remove old data
        scatter.selectAll("circle")
           .data(filteredData)
           .exit()
           .remove();

        // Update circles
        scatter.selectAll("circle")
           .data(filteredData)  // Update with new data
           .transition()  // Transition from old to new
           .duration(1000)  // Length of animation
           .each("start", function() {  // Start animation
                d3.select(this)  // 'this' means the current element
                  .attr("fill", "Gray")
                  .attr("r", 1.5);  // Change size
           })
           .delay(function(d, i) {
                return i / filteredData.length * 500;  // Dynamic delay (i.e. each item delays a little longer)
           })
           .attr("cx", function(d) {
                return xScale(d[colPositions["dj30"]]);  // Circle's Y
           })
           .attr("cy", function(d) {
                return yScale(d[colPositions[yOptionsDict[yLabel]]]);  // Circle's Y
           })
           .each("end", function() {  // End animation
                d3.select(this)  // 'this' means the current element
                  .transition()
                  .duration(500)
                  .attr("fill", function (d) {return colors(d[2]);})
                  .attr("r", circle_radius);
           });

        scatter.selectAll("circle")
           .data(filteredData)
           .on("mouseover", function(d) {
                d3.select(this).transition()
                               .duration(600)
                               .attr("r", 6).ease("elastic")
                scatterTip.show(d)
           })
           .on("mouseout",  function(d) { 
                d3.select(this).transition()
                               .duration(600)
                               .attr("r", circle_radius).ease("elastic")
                scatterTip.hide(d)
           });

        // Update X Axis
       scatter.select(".x.axis")
          .transition()
          .duration(1500)
          .ease("exp-in-out")
          .call(xAxis);

        // Update Y Axis
       scatter.select(".y.axis")
          .transition()
          .duration(1500)
          .ease("exp-in-out")
          .call(yAxis);

        // Title
        scatter.select(".scatter-title")
               .text("Season " + season + " Wagers")
               .attr("x", (canvas_width / 2) - padding)
               .attr("y", padding / 2)
               .style("text-anchor", "center");

    });

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

        // Create scale function (earnings-based)
        var maxVal = d3.max(filteredData, function(d) {
                        return d3.max([d[colPositions["dj30"]], d[colPositions["wager"]]]);
                    });
        
        // Update scale domains
        xScale.domain([0, maxVal]);
        
        if (yLabel == "Percentage") {
            yScale.domain([0, 1]); // Max of 1 for Percentage view
        }
        else {
            yScale.domain([0, maxVal]);
        }

        // Update circles
        scatter.selectAll("circle")
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
                  .attr("fill", function (d) {return colors(d[3]);})
                  .attr("r", circle_radius)  // Change radius
                  .attr("opacity", opacity);
           });

        // Update Y Axis
       scatter.select(".y.axis")
          .transition()
          .duration(1500)
          .ease("exp-in-out")
          .call(yAxis);

       scatter.select(".y-label")
          .attr("transform", "rotate(-90)")
          .attr("x", -padding)
          .attr("y", -70)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text(yLabel);
    });

});