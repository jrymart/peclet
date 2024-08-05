const response = await fetch("net_graph_nodes.json")
const layers = await response.json()
// const layers = [
//     { id: 0, name: "Input", t: 1 },
//     { id: 1, name: "Conv1", t: 20},
//     { id: 2, name: "Pool1", t: 20},
//     { id: 3, name: "Output", t: 1}
// ];
console.log(layers.slice(1));
const links = []

layers.slice(1).forEach((node) =>
    node.source.forEach((s) =>
	links.push({source: layers[s],
		    target: node})
    ));

// for (const node in layers.slice(1)) {
//     //console.log(node);
//     //    console.log(layers);
//     //console.log(node.source);
//     for (const source in layers[node].source) {
// 	links.push({source: layers[source],
// 		    target: node})
//     }
// };

// const links = layers.slice(1).map((layer, i) => ({
//     source: i,
//     target: i + 1
// }));

//layers[0].another = 7;

console.log(links);

const width = 2000;
const height = 2000;
const border=100;
const node_height =  10;

const svg = d3.select("#network-diagram")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

const num_layers = layers.slice(-1)[0].layer_index;
console.log(num_layers);

// Create a force simulation
const simulation = d3.forceSimulation(layers)
//    .force("link", d3.forceLink(links).id(d => d.id).distance(100))
    .force("charge", d3.forceManyBody().strength(-40))
    .force("center", d3.forceCenter(width/2, height/2))
    .force("x", d3.forceX(function(d){
	const xpos = d.layer_index*width/num_layers
	console.log(xpos)
	return xpos}))
    .force("y", d3.forceY(function(d){
        const ypos = (d.node_index*node_height)+height/2-d.layer_size*node_height/2
	console.log(ypos)
       	return ypos}));

// Create links
const link = svg.append("g")
    .selectAll("line")
    .data(links)
    .enter().append("line")
    .attr("class", "link");

// Create nodes
const node = svg.append("g")
    .selectAll("circle")
    .data(layers)
    .enter().append("circle")
    .attr("class", "node")
      .attr("r", 20);
    //.on("mouseover", showNodeInfo)
    //.on("mouseout", hideNodeInfo);

// Add labels to nodes
const label = svg.append("g")
    .selectAll("text")
    .data(layers)
    .enter().append("text")
    .text(d => d.layer)
    .attr("font-size", 12)
    .attr("dx", 22)
    .attr("dy", 4);

// Update positions on each tick of the simulation
simulation.on("tick", () => {
    link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

    node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);

    label
        .attr("x", d => d.x)
        .attr("y", d => d.y);
});
