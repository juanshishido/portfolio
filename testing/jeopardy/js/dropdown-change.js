// Update with new Y axis data on select
yDropDown.on("change", function() {

    // Y axis label names
    var e = yDropDown[0][0];
    var yLabel = e.options[e.selectedIndex].text;

    console.log(yLabel);

    // Column positions
    var yVal = +colPositions[this.value];
    
    // Update scale domains
    yScale.domain([0, d3.max(dataset, function(d) {
        return d[yVal]; })]);

//     // Update circles
//     svg.selectAll("circle")
//        .data(dataset)  // Update with new data
//        .transition()  // Transition from old to new
//        .duration(1000)  // Length of animation
//        .each("start", function() {  // Start animation
//             d3.select(this)  // 'this' means the current element
//               .attr("r", 2);  // Change size
//        })
//        .delay(function(d, i) {
//             return i / dataset.length * 500;  // Dynamic delay (i.e. each item delays a little longer)
//        })
//        .attr("cy", function(d) {
//             return yScale(d[yVal]);  // Circle's Y
//        })
//        .each("end", function() {  // End animation
//             d3.select(this)  // 'this' means the current element
//               .transition()
//               .duration(500)
//               .attr("fill", function (d) {return colors(d[3]);})
//               .attr("r", circle_radius)  // Change radius
//               .attr("opacity", opacity);
//        });
      
//       if(yLabel == "Actual"){
//       svg.selectAll("circle")
//        .data(dataset)  // Update with new data
//        .on("mouseover", function(d) {
//             d3.select(this).transition()
//                            .duration(600)
//                            .attr("r", 6).ease("elastic")
//             tooltip.transition()
//                    .duration(100)
//                    .style("opacity", .9);
//             tooltip.html(d[colPositions["wager"]] + "<br/>" + d.date)
//                    .style("left", (d3.event.pageX + 20) + "px")
//                    .style("top", (d3.event.pageY - 28) + "px");
//        })
//        .on("mouseout",  function(d) { 
//             d3.select(this).transition()
//                            .duration(600)
//                            .attr("r", circle_radius).ease("elastic")
//             tooltip.transition()
//                    .duration(500)
//                    .style("opacity", 0);
//        });
//      }
//      else{
//       svg.selectAll("circle")
//        .data(dataset)  // Update with new data
//        .on("mouseover", function(d) {
//             d3.select(this).transition()
//                            .duration(600)
//                            .attr("r", 6).ease("elastic")
//             tooltip.transition()
//                    .duration(100)
//                    .style("opacity", .9);
//             tooltip.html(d[colPositions["wager_pct"]] + "<br/>" + d.date)
//                    .style("left", (d3.event.pageX + 20) + "px")
//                    .style("top", (d3.event.pageY - 28) + "px");
//        })
//        .on("mouseout",  function(d) { 
//             d3.select(this).transition()
//                            .duration(600)
//                            .attr("r", circle_radius).ease("elastic")
//             tooltip.transition()
//                    .duration(500)
//                    .style("opacity", 0);
//        });
//      }

//         // Update Y Axis
//        svg.select(".y.axis")
//           .transition()
//           .duration(1500)
//           .ease("exp-in-out")
//           .call(yAxis);

//        svg.select(".y-label")
//           .attr("transform", "rotate(-90)")
//           .attr("x", -75)
//           .attr("y", -75)
//           .attr("dy", ".71em")
//           .style("text-anchor", "end")
//           .text(yLabel);

// });



// // Update with new X axis data on select
// xDropDown.on("change", function() {
//     odataset = filteredData;
//     dataset = odataset.map(function(d) {
//                     return [d[0], d[1], d[2], d[3], d[4],d[5], d[6], d[7], d[8], d[9]];
//                 });

//     // X axis label names
//     var e = xDropDown[0][0];
//     var xLabel = e.options[e.selectedIndex].text;

//     // Drop down value for X axis
//     var xDropDownValue = this.value;

//     // Column positions
//     var xVal = +colPositions[xDropDownValue];

//     dataset.forEach(function(d,i) {
//       d.date = parseDate(d[colPositions["date"]]);
//      });

//     // Scales
//     if (xDropDownValue == "date") {
//         var xScale = d3.time.scale()
//                     .domain(dateRange)
//                     .range([padding, canvas_width - padding * 2]);
//     }
//     else if (xDropDownValue == "dj30") {
//         var xScale = d3.scale.linear()
//                        .domain([0, d3.max(dataset, function(d) {
//                             return d[0];
//                        })])
//                        .range([padding, canvas_width - padding * 2]);
//         xScale.domain([0, d3.max(dataset, function(d) {
//         return d[xVal]; })]);
//     }
//     else if (xDropDownValue == "place_before") {
//         var xScale = d3.scale.linear()
//                        .domain([0, d3.max(dataset, function(d) {
//                             return d[0];
//                        })])
//                        .range([padding, canvas_width - padding * 2]);
//         xScale.domain([0, d3.max(dataset, function(d) {
//         return d[xVal] + 1; })]);
//     };

//     // Update scale domains
//     var xAxis = d3.svg.axis()
//               .scale(xScale)
//               .orient("bottom")
//               .ticks(5);

//     // Update circles
//     svg.selectAll("circle")
//        .data(dataset)  // Update with new data
//        .transition()  // Transition from old to new
//        .duration(1000)  // Length of animation
//        .each("start", function() {  // Start animation
//             d3.select(this)  // 'this' means the current element
//               .attr("r", 2);  // Change size
//        })
//         .delay(function(d, i) {
//             return i / dataset.length * 500;  // Dynamic delay (i.e. each item delays a little longer)
//        })
//        .attr("cx", function(d) {
//             if (xDropDownValue == "date") {
//                 return xScale(parseDate(d[xVal]));
//             }
//             else if (xDropDownValue == "dj30") {
//                 return xScale(d[xVal]);  // Circle's X
//             }
//             else if (xDropDownValue == "place_before") {
//                 return xScale(d[xVal] + ((Math.random()-0.5) / 5));  // Circle's X
//             }
//        })
//        .each("end", function() {  // End animation
//             d3.select(this)  // 'this' means the current element
//               .transition()
//               .duration(500)
//               // .attr("fill", function (d) {return colors(d[3]);})
//               .attr("r", circle_radius)  // Change radius
//               .attr("opacity", opacity);
//        });

//        svg.selectAll("circle")
//        .data(dataset)  // Update with new data
//        .on("mouseover", function(d) {
//           d3.select(this).transition()
//                          .duration(600)
//                          .attr("r", 6).ease("elastic")
//           tooltip.transition()
//              .duration(200)
//              .style("opacity", .9);
//               tooltip.html(d[colPositions["wager"]] + "<br/>" + d.date)
//              .style("left", (d3.event.pageX + 5) + "px")
//              .style("top", (d3.event.pageY - 28) + "px");
//         })
//         .on("mouseout",  function(d) { 
//           d3.select(this).transition()
//                          .duration(600)
//                          .attr("r", circle_radius).ease("elastic")
//           tooltip.transition()
//              .duration(500)
//              .style("opacity", 0);
//         });

//         // Update X Axis
//        svg.select(".x.axis")
//           .transition()
//           .duration(1500)
//           .ease("exp-in-out")
//           .call(xAxis);

//        svg.select(".x-label")
//           .text(xLabel);
});