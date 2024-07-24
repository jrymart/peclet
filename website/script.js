import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
let models = [];
let D_values = [];
let k_values = [];
d3.csv("model_key.csv", function(data) {
    models.push({"D": parseFloat(data["model_param.diffuser.D"]),
		 "k": parseFloat(data["model_param.streampower.k"]),
		 "model_run_id": data["model_run_id"]});
    D_values = models.map(model => model["D"]).filter((value, index, array) => array.indexOf(value) === index);
    k_values = models.map(model => model["k"]).filter((value, index, array) => array.indexOf(value) === index);
    D_values.sort();
    k_values.sort();
});

const square = document.getElementById('square');
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

// Event listener for mouse move over the square
square.addEventListener('mousemove', (event) => {
    const rect = square.getBoundingClientRect();
    const width =  rect.right - rect.left;
    const height = rect.bottom - rect.top;
    const x = (event.clientX - rect.left)/width;
    const y = Math.abs((event.clientY - rect.bottom)/height);

 /* displayImage.src = newImage*/
    let D_index = Math.floor(x*D_values.length);
    let k_index = Math.floor(y*k_values.length);
    let D_value = D_values[D_index];
    let k_value = k_values[k_index];
    coodinates.textContent = `D: ${D_value.toFixed(5)}, k: ${k_value.toFixed(5)})`;
    let image_name = models.filter((model) => model["D"] == D_value & model["k"]== k_value)[0]["model_run_id"]
    let image_path = `hillshades/${image_name}.png`;
    displayImage.src = image_path;
});
