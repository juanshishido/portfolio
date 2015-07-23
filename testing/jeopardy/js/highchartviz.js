$(function () {
    $('#hcontainer').highcharts({
        chart: {
            type: 'line'
        },
        title: {
            text: 'Contestant Appearances and Wins by Gender',
            x: -20 //center
        },
        credits: {
            enabled: false
          },
        exporting: {
            enabled: false
        },
        subtitle: {
            text: 'Source: j-archive.com',
            x: -20
        },
		plotOptions: {
			line: {
				marker: {
					enabled: false
				}
			}
		},
		xAxis: {
            categories: ['1984','1985','1986','1987','1988','1989','1990','1991','1992','1993','1994','1995','1996','1997','1998','1999','2000','2001','2002','2003','2004','2005','2006','2007','2008','2009','2010','2011','2012','2013','2014'
],
        labels: {
                enabled: false
        },
        lineColor: "DimGray",
        lineWidth: 1,
        minorTickLength: 0,
        tickLength: 0
        },
        yAxis: {
            title: {
                text: 'Percent (%)'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }],
            gridLineColor: null,
            lineColor: "DimGray",
            lineWidth: 1,
            tickColor: "DimGray",
            tickLength: 8,
            tickWidth: 1
        },
        tooltip: {
            backgroundColor: "#f9f9f9",
            borderColor: "#f9f9f9",
            shadow: false,
            valueSuffix: '%'
        },
        
        series: [{
            name: 'Male Contestants',
            data: [65.4,65.9,67.2,67.2,61.2,68.1,64.2,65.7,65.6,61.5,74.7,70,63.4,56.5,54.2,57.8,63.6,57.1,60.7,60.9,71,60.1,54.2,52.2,57.2,56.4,56.2,55.9,58.1,52.6,54.5],
            color: '#3d4bcb'
        },
        {
            name: 'Male Wins',
            data: [81.5,75.7,88.1,71.2,65.9,75,80.6,83.3,67.2,70,80,77.6,65.4,65.1,58.3,65.2,73.9,74,73.1,80.5,80.4,71.7,62.6,55.1,68.7,63.9,66.4,67.8,69.4,58.6,60.7],
            color: '#101a7c'
        },
        {
            name: 'Female Contestants',
            data: [34.6,34.1,32.8,32.8,38.8,31.9,35.8,34.3,34.4,38.5,25.3,30,36.6,43.5,45.8,42.3,37.4,42.9,39.3,39.1,29,39.9,45.8,47.8,42.8,43.6,43.8,44.1,41.9,47.4,45.5],
            color: '#edb321'
        },
        {
            name: 'Female Wins',
            data: [18.5,24.3,11.9,28.8,34.1,25,19.4,16.7,32.8,30,20,22.4,34.6,34.9,41.7,34.8,26.1,26,26.9,19.5,19.6,28.3,37.4,44.9,31.3,36.1,33.6,32.2,30.6,41.4,39.3],
            color: '#b38719'

        },  ]
    });
});