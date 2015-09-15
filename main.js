(function(){

/*
The MIT License (MIT)

Copyright (c) <year> <copyright holders>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

function addStackedAreaChart(data){
data = data.map(function(datum){
	datum.values = [];
    Object.keys(datum.Storage, function(key, value){
		var timestamp = toTimestamp(key);
		var volume = stringToNumber(value);
		datum.values.push([timestamp, volume]);
	});
	return datum;
});
nv.addGraph(function() {
	var tooltip = function(key, year, e, graph) { 
		return null;
	};
    var chart = nv.models.stackedAreaChart()
                  .margin({right: 100})
                  .x(function(d) { return d[0] })   //We can modify the data accessor functions...
                  .y(function(d) { return d[1] })   //...in case your data is formatted differently.
                  //.useInteractiveGuideline(true)    //Tooltips which show all data points. Very nice!
		  .tooltip(tooltip)
                  .rightAlignYAxis(true)      //Let's move the y-axis to the right side.
                  .transitionDuration(500)
                  .showControls(true)       //Allow user to choose 'Stacked', 'Stream', 'Expanded' mode.
                  .clipEdge(true);
/*	chart.interactiveLayer.dispatch.on('elementMouseover', function(){
		console.dir(arguments);
		debugger;
	});
*/
    //Format x-axis labels with custom function.
    chart.xAxis
        .tickFormat(function(d) { 
          return d3.time.format('%Y')(new Date(d)) 
    });

    chart.yAxis
        .tickFormat(d3.format(',.0f'));

    d3.select('#stacked-area-chart svg')
      .datum(data)
      .call(chart);

    nv.utils.windowResize(chart.update);

    return chart;
  });
};
function valueIsDefined(datum){
	return datum.value !== undefined;
};
function keyIsDefined(datum){
	return datum.key !== undefined && datum.key.length;
};
function toTimestamp(dateToken){
    var year = stringToNumber(dateToken.substring(0,4));
    var month = stringToNumber(dateToken.substring(4,6));
    var day = stringToNumber(dateToken.substring(6,8));

	return new Date(year, month, day).getTime();
};
function stringToNumber(string){
	return +string;
};


$(document).ready(function(){
$.ajax({url: 'http://cida.usgs.gov/ca_drought/data/reservoirs/reservoir_storage.json', success: function(data){
	addStackedAreaChart(data);
}});
});

}());
