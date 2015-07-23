var width = 1000,  
    height = 500;

var margin = {top: 20, right: 0, bottom: 30, left: 50}, 
                innerwidth = width - margin.left - margin.right,
                innerheight = height - margin.top - margin.bottom;

d3.json("data/line.json", function(json) {
    season = 1;
    firstDate = d3.min(d3.keys(json[season]));
    lineData = json[season][firstDate];

var xy_chart = d3_xy_chart();

var svg = d3.select("#linechart").append("svg")
    .datum(lineData)
    .call(xy_chart);

});

function d3_xy_chart() {
    
    function chart(selection) {
        selection.each(function(datasets) {
            
            var x_scale = d3.scale.linear()
                .range([0, innerwidth])
                .domain([ d3.min(datasets, function(d) { return d3.min(d.x); }), 
                          d3.max(datasets, function(d) { return d3.max(d.x); }) ]);
            
            var y_scale = d3.scale.linear()
                .range([innerheight, 0])
                .domain([ d3.min(datasets, function(d) { return d3.min(d.y); }),
                          d3.max(datasets, function(d) { return d3.max(d.y); }) ]);

            var color_scale = d3.scale.ordinal()
                                .domain([1, 2, 3])
                                .range(["#3182bd", "#9ecae1", "#deebf7"]);

            var x_axis = d3.svg.axis()
                .scale(x_scale)
                .orient("bottom")
                .ticks(0);

            var y_axis = d3.svg.axis()
                .scale(y_scale)
                .orient("left");

            var draw_line = d3.svg.line()
                .interpolate("monotone") // basis
                .x(function(d) { return x_scale(d[0]); })
                .y(function(d) { return y_scale(d[1]); });

            var svg = d3.select(this)
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + innerheight + ")") 
                .call(x_axis)
                .append("text")
                .attr("dy", "-.71em")
                .attr("x", innerwidth);
            
            svg.append("g")
                .attr("class", "y axis")
                .call(y_axis)
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", "0.71em");

            var data_lines = svg.selectAll(".d3_xy_chart_line")
                .data(datasets.map(function(d) {return d3.zip(d.x, d.y);}))
                .enter().append("g")
                .attr("class", ".d3_xy_chart_line");
            
            data_lines.append("path")
                .attr("class", "line")
                .attr("d", function(d) {return draw_line(d); })
                .style("stroke", function(_, i) {return color_scale(i + 1);});

        }) ;
    }

    chart.width = function(value) {
        if (!arguments.length) return width;
        width = value;
        return chart;
    };

    chart.height = function(value) {
        if (!arguments.length) return height;
        height = value;
        return chart;
    };

    chart.xlabel = function(value) {
        if(!arguments.length) return xlabel;
        xlabel = value ;
        return chart ;
    } ;

    chart.ylabel = function(value) {
        if(!arguments.length) return ylabel;
        ylabel = value ;
        return chart ;
    } ;

    return chart;
}