console.log(moment.unix("1191283200").format("MMM DD, YYYY") === "Oct 01, 2007");

var margin = {top: 19.5, right: 19.5, bottom: 19.5, left: 39.5},
    width = 1000 - (2 * margin.right) - 20,
    height = 75 - margin.top - margin.bottom;

var svg = d3.select("#slider-chart")
            .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
            .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

var label = svg.append("text")
            .attr("class", "season label")
            .attr("text-anchor", "end")
            .attr("y", height)
            .attr("x", width)
            .style()
            .text("Season 01");

var slider = d3.select("#rangeinput");

var heatmapData;
d3.json("data/heatmap.json", function(json) {
    heatmapData = json["1"];

    var calendar = new CalHeatMap();
    calendar.init({
        data : heatmapData,
        start: new Date(1984, 7),
        domain : "month",
        subDomain : "day",
        range : 13,
        legend: [10000, 15000, 20000, 25000],
        legendColors : {
            min : "#deebf7",
            max : "#3182bd"
        },
        onClick: function(date) {
            console.log(moment(date).format("X"))
        }
    });

    slider.on("input", function() {
        var seasonlabel = slider.property("value");

        if (seasonlabel < 10) {
            seasonlabel = "0" + seasonlabel.toString();
        };

        svg.select(".season.label")
              .text("Season " + seasonlabel);

    });
});