//import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
//let models = [];
//let D_values = [];
//let k_values = [];

const square = document.getElementById('keysquare');
const displayImage = document.getElementById('displayImage');


// Function to get image based on mouse position
function getImageForPosition(x, y) {
    // Define the logic to choose image based on x and y.
    // This example just uses a simple threshold for demonstration.
    if (x < square.clientWidth / 2 && y < square.clientHeight / 2) {
        return 'image1.jpg';
    } else if (x >= square.clientWidth / 2 && y < square.clientHeight / 2) {
        return 'image2.jpg';
    } else if (x < square.clientWidth / 2 && y >= square.clientHeight / 2) {
        return 'image3.jpg';
    } else {
        return 'image4.jpg';
    }
}


var margin = {top: 60, right: 50, bottom: 100, left: 75},
    width = 475 - margin.left - margin.right,
    height = 520 - margin.top - margin.bottom;


var svg = d3.select("#keysquare")
   .append("svg")
   .attr("width", width + margin.left + margin.right)
   .attr("height", height + margin.top + margin.bottom)
   .append("g")
   .attr("transform",
	  "translate(" + margin.left + "," + margin.top + ")");
//x scales and axis

const data = await d3.csv("model_key_r.csv")
let models = data.map(r => ({"D": parseFloat(r["model_param.diffuser.D"]),
			    "k": parseFloat(r["model_param.streampower.k"]),
			    "relief": parseFloat(r["relief"]),
			     "model_run_id": r["model_run_id"]}));
//     models.push({"D": parseFloat(data["model_param.diffuser.D"]),
// 		 "k": parseFloat(data["model_param.streampower.k"]),
// 		 "relief": parseFloat(data["relief"]),
// 		 "model_run_id": data["model_run_id"]});
let D_values = models.map(model => model["D"]).filter((value, index, array) => array.indexOf(value) === index);
let k_values = models.map(model => model["k"]).filter((value, index, array) => array.indexOf(value) === index);
D_values.sort();
k_values.sort();
// });
console.log(data)
 let relief_values = models.map(model => model["relief"])
   var x = d3.scaleBand()
       .range([ 0, width ])
//.domain(D_values.map(D => D.toExponential(2)))
       .domain(D_values)
       .paddingInner(0.01);
   svg.append("g")
	       .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x)
	  .tickFormat(
	      (d) => d.toExponential(2)))
    .selectAll("text")
    .attr("dx", "-2em")
//    .attr("dy", "-5em")
    .attr("transform", "rotate(-65)");
console.log(D_values);
   // y scales and axis
   var y = d3.scaleBand()
       .range([ height, 0 ])
//       .domain(k_values.map(k => k.toExponential(2)))
       .domain(k_values)
       .padding(0.01);
   svg.append("g")
    .call(d3.axisLeft(y)

	  .tickFormat(
	      (k) => k.toExponential(2)));
   // build a color scale
   var myColor = d3.scaleLinear()
       .range(["white", "#69b3a2"])
       .domain([Math.min(...relief_values),Math.max(...relief_values)]);

   // svg.selectAll()
   //     .data(models, function(d) {return d.D+':'+d.k;})
   //     .enter()
   // .append("rect")
   // .attr("x", function(d) { return x(d.D) })
   // .attr("y", function(d) { return y(d.k) })
   // .attr("width", x.bandwidth() )
   // .attr("height", y.bandwidth() )
   //     .style("fill", function(d) { return myColor(d["relief"])});

let legend_comps = [0,1,2,3,4,5,6,7,8,9]
//let legend_vals = [0,1,2,3,4,5,6,7,8,9].map( i => i* (Math.max(...relief_values)-Math.min(...relief_values))+math.min(...relief_values));

var legend = svg.selectAll(".legend")
    .data(legend_comps)
    .enter()
    .append("rect")
    .attr("x", i => 75+(9-i)*20)
    .attr("y", -30)
    .attr("width", 20)
    .attr("height", 20)
    .attr("fill", function(i) {return myColor(
	(9-i)*(Math.max(...relief_values)-Math.min(...relief_values))/9+Math.min(...relief_values))});
svg.append("text")
    .text(Math.floor(Math.min(...relief_values)))
    .attr("x", 50)
    .attr("y", -15);
svg.append("text")
    .text(Math.ceil(Math.max(...relief_values)))
    .attr("x", 280)
    .attr("y", -15);
svg.append("text")
    .text("Total Relief (m)")
    .attr("x", 110)
    .attr("y", -45);

svg.append("text")
    .text("Model D value")
    .attr("x", 110)
    .attr("y", 420)
svg.append("text")
    .text("Model K Value")
    .attr("x", 120)
    .attr("y", 70)
    .attr("transform", "rotate(90)");
// legend.data(myColor.ticks())
//     .enter()
//     .append("g")
//     .attr("class", "legend")
//     .append("rect")
//     .attr("x", 360)
//     .attr("y", 150)
//     .attr("width", 20)
//     .attr("height", 100)
//     .attr("fill", relief_values);
//     .append("g")
//     .attr("class", "legend")
//     .attr("transform", function(d, i) {
//      	    return "translate(" + (i*20) + "," + (height + margin.bottom - 20) + ")";
//      	}
//     );
// console.log(legend)
// legend.append("rect")
//     .attr("width", 20)
//     .attr("height", 40)
//     .attr("fill", myColor);
// 	// "width": 20,
// 	// "height": 40,
// 	// "fill": myColor});

console.log(d3.Legend);

var mousemove = function(d) {
    console.log(d);
    let cur_D = d.target.__data__.D
    let cur_k = d.target.__data__.k
    coodinates.textContent = `D: ${cur_D.toExponential(2)}, K: ${cur_k.toExponential(2)} `;
    let image_name = models.filter((model) => model["D"] == cur_D & model["k"]== cur_k)[0]["model_run_id"]
    let image_path = `hillshades/${image_name}.png`;
    displayImage.src = image_path;    
}

svg.selectAll()
    .data(models)
    .enter()
    .append("rect")
    .attr("x", function(r) {return x(r["D"])})
    .attr("y", function(r) {return y(r["k"])})
    .attr("D", r => r["D"])
    .attr("k", r => r["k"])
    .attr("width", x.bandwidth())
    .attr("height", y.bandwidth())
    .style("fill", function(r) {return myColor(r["relief"])})
    .on("mousemove", mousemove);

//Event listener for mouse move over the square

// square.addEventListener('mousemove', (event) => {
//     const rect = square.getBoundingClientRect();
//     const width =  rect.right - rect.left;
//     const height = rect.bottom - rect.top;
//     const x = (event.clientX - rect.left)/width;
//     const y = Math.abs((event.clientY - rect.bottom)/height);

//     let D_index = Math.floor(x*D_values.length);
//     let k_index = Math.floor(y*k_values.length);
//     let D_value = D_values[D_index];
//     let k_value = k_values[k_index];
//     coodinates.textContent = `D: ${D_value.toFixed(5)}, k: ${k_value.toFixed(5)})`;
//     let image_name = models.filter((model) => model["D"] == D_value & model["k"]== k_value)[0]["model_run_id"]
//     let image_path = `hillshades/${image_name}.png`;
//     displayImage.src = image_path;
//  });
