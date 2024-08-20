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

const width = 1200;
const height = 1700;
const border=0;//100;
const node_height =  40;

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
    .force("y", d3.forceY(function(d){
	const xpos = d.layer_index*width/num_layers
	console.log(xpos)
	return xpos}))
    .force("x", d3.forceX(function(d){
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
      .attr("r", 20)
    .on("mouseover", showNodeInfo)
    .on("mouseout", hideNodeInfo);

// Add labels to nodes
const label = svg.append("g")
    .selectAll("text")
    .data(layers)
    .enter().append("text")
    .text(d => d.layer)
    .attr("font-size", 12)
    .attr("dx", -20)
    .attr("dy", 30);

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

function showNodeInfo(event, d) {
    const nodeInfo = d3.select("#node-info");
    const mousePosViz = d3.pointer(event);
    const popupWidth = 500;
    const popupHeight = 700;
    const padding = 10;

    const viewport = window.visualViewport;
    const viewportTop = viewport.pageTop;
    const viewportLeft = viewport.pageLeft;
    const viewportWidth = viewport.width;
    const viewportHeight = viewport.height;
    const viewportBottom = viewportTop + viewportHeight;
    const viewportRight = viewportLeft + viewportWidth;

    
    const spaceRight = viewportWidth - event.clientX;
    const spaceBottom = viewportHeight - event.clientY;

    const idealLeft = event.pageX + 10;
    const idealTop = event.pageY-10;

    const overshotWidth = idealLeft+popupWidth-viewportRight;
    const overshotHeight = idealTop+popupHeight-viewportBottom;

    let left = idealLeft;
    if (overshotWidth>0) {
	left = idealLeft - overshotWidth;
    }
    let top = idealTop;
    if (overshotHeight>0) {
	top = idealTop - overshotHeight;
    }
    left = viewportLeft+padding;
    top = viewportTop+padding;
    if (mousePosViz[0] < width/2) {
	left = viewportRight-padding-popupWidth
    }
    console.log(viewport)
    console.log(viewportLeft, viewportRight, viewportTop, viewportBottom);
    console.log(top, idealTop, viewportHeight, overshotHeight);
    console.log(left, idealLeft, viewportWidth, overshotWidth);
   
    //left = Math.max(padding, Math.min(left, viewportWidth - popupWidth - padding))
    //top = Math.max(padding, Math.min(top, viewportHeight - popupHeight - padding))
    
    nodeInfo.style("display", "block")
        .style("left", left + "px")
        .style("top", top + "px")
	.style("width", popupWidth + "px")
	.style("height", popupHeight + "px")
        .html(`
            <h3>${d.text}</h3>
<center>
            <div class="popoverimg">
            <img src="${d.example_img}" alt="Sample input" width="200">
<p>Output</p>
                        </div>
            <div class="popoverimg">
            <img src="${d.activation_img}" alt="max activation" width="200">
<p>Activation Max</p>
                        </div>
</center>
        `);
}

// Function to hide node information on mouseout
function hideNodeInfo() {
    d3.select("#node-info").style("display", "none");
}
