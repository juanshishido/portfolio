var season;
slider.on("change", function() {

    // HEATMAP
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

    setTimeout(function() {
        // SCATTER
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
        var xScale = d3.scale.linear()
                       .domain([0, d3.max(filteredData, function(d) {
                            return d[colPositions["dj30"]];  // input domain
                       })])
                       .range([padding, canvas_width - padding / 2]);

        // Update scale domains
        if (yLabel == "Percentage") {
            var yScale = d3.scale.linear()
                           .domain([0, 1]) // Max of 1 for Percentage view
                           .range([canvas_height - padding, padding]);
        }
        else {
            var yScale = d3.scale.linear()  // yScale is height of graphic
                           .domain([0, d3.max(filteredData, function(d) {
                                return d[colPositions[yOptionsDict[yLabel]]];  // input domain
                           })])
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

        var svg = d3.select("#scatter-chart");

        // Update circles
        svg.selectAll("circle")
           .data(filteredData)  // Update with new data
           .transition()  // Transition from old to new
           .duration(1000)  // Length of animation
           // .each("start", function() {  // Start animation
           //      d3.select(this)  // 'this' means the current element
           //        .attr("fill", "#000")
           //        .attr("r", 1.5);  // Change size
           // })
           // .delay(function(d, i) {
           //      return i / filteredData.length * 500;  // Dynamic delay (i.e. each item delays a little longer)
           // })
           .attr("cx", function(d) {
                return xScale(d[colPositions["dj30"]]);  // Circle's Y
           })
           .attr("cy", function(d) {
                return yScale(d[colPositions[yOptionsDict[yLabel]]]);  // Circle's Y
           });
           // .each("end", function() {  // End animation
           //      d3.select(this)  // 'this' means the current element
           //        .transition()
           //        .duration(500)
           //        .attr("fill", function (d) {return colors(d[2]);})
           //        .attr("r", circle_radius);
           // });

        svg.selectAll("circle")
           .data(filteredData)
           .enter()
           .append("circle")
           .attr("cx", function(d) {
                return xScale(d[colPositions["dj30"]]);  // Circle's Y
           })
           .attr("cy", function(d) {
                return yScale(d[colPositions[yOptionsDict[yLabel]]]);  // Circle's Y
           })
           .attr("r", circle_radius)  // radius
           .attr("fill", function (d) {return colors(d[2]);})
           .attr("opacity", opacity);

        svg.selectAll("circle")
           .data(filteredData)
           .exit()
           .remove();


            // Update X Axis
           svg.select(".x.axis")
              .transition()
              .duration(1500)
              .ease("exp-in-out")
              .call(xAxis);

            // Update Y Axis
           svg.select(".y.axis")
              .transition()
              .duration(1500)
              .ease("exp-in-out")
              .call(yAxis);

    }, 2200);
});