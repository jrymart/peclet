var margin = {top: 10, right: 30, bottom: 60, left: 60},
    width = 460 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;

var svg = d3.select("#test_scatterplot")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

const data = await d3.csv("model_5_preds.csv");
const max_true = Math.max(...data.map(r => (parseFloat(r["true_peclets"]))));
const min_true = Math.min(...data.map(r => (parseFloat(r["true_peclets"]))));
let models = data.map(r => ({"pred": parseFloat(r["predictions"]),
			     "true": parseFloat(r["true_peclets"]),
			     "NRMSE": Math.abs(parseFloat(r["true_peclets"])-parseFloat(r["predictions"]))/(max_true-min_true),
			     "run": r["names"]}));

const max_pred = Math.max(...data.map(r => r["pred"]));
const min_pred = Math.min(...data.map(r => r["pred"]));

var x = d3.scaleLinear()
    .domain([0, max_true])
    .range([0, width]);
svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

var y = d3.scaleLinear()
    .domain([max_true, 0])
    .range([0, height]);
svg.append("g")
    .call(d3.axisLeft(y));

svg.append("text")
    .text("True K/D Value")
    .attr("x", 110)
    .attr("y", 420)
svg.append("text")
    .text("Inferred K/D Value")
    .attr("x", 115)
    .attr("y", 50)
    .attr("transform", "rotate(90)");

var tooltip = d3.select("#test_scatterplot")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")

var mouseover = function(event, d) {
    tooltip
	.style("opacity", 1)
	.html("NRMSE of this prediction is " + d.NRMSE)
	.style("left", (event.x + 90) + "px")
	.style("top", (event.y) + "px")
}

var mouseleave = function(d) {
    tooltip
	.transition()
	.duration(200)
	.style("opacity", 0)
}

svg.append('g')
    .selectAll("dot")
    .data(models)
    .enter()
    .append("circle")
    .attr("cx", function (d) {return x(d.true); } )
    .attr("cy", function (d) {return y(d.pred); } )
    .attr("NRMSE", function (d) {return d.NRMSE})
    .attr("r", 3)
    .style("fill", "#69b3a2")
    .style("opacity", function (d) {return 1-d.NRMSE} )
    .on("mouseover", mouseover)
    //.on("mousemove", mousemove)
    //.on("mouseleave", mouseleave)

svg.append("path")
    .datum([0,0.4])
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .attr("d", d3.line()
	  .x(function(d) { return x(d) })
	  .y(function(d) { return y(d) })
	 )

