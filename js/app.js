function products(name, filepath, timesShown) {
    this.name = name;
    this.filepath = filepath;
    this.timesShown = timesShown;
    this.clicks = 0;
}

// Prototype methods for 'products'
products.prototype.incrementClicks = function() {
    this.clicks++;
};

const itemName = ['bag', 'banana', 'bathroom', 'boots', 'breakfast', 'bubblegum', 'chair', 'cthulhu', 'dog-duck', 'dragon', 'pen', 'pet-sweep', 'scissors', 'shark', 'sweep', 'tauntaun', 'unicorn', 'water-can', 'wine-glass'];
const assets = ['assets/bag.jpg', 'assets/banana.jpg', 'assets/bathroom.jpg', 'assets/boots.jpg', 'assets/breakfast.jpg', 'assets/bubblegum.jpg',  'assets/chair.jpg', 'assets/cuthulu.jpg', 'assets/dog-duck.jpg', 'assets/dargon.jpg', 'assets/pen-sweep.jpg', 'assets/scissors.jpg', 'assets/shark.jpg', 'assets/sweep.png', 'assets/tauntaun.jpg', 'assets/unicorn.jpg', 'assets/water-can.jpg', 'assets/wine-glass.jpg'];
let imageUse = 0;

let productList = [];
for (let i = 0; i < itemName.length; i++) {
    productList.push(new products(itemName[i], assets[i], 0));
}

function imageRender() {
    let displayIndices = [];
    while (displayIndices.length < 3) {
        let index = Math.floor(Math.random() * productList.length);
        if (!displayIndices.includes(index)) {
            displayIndices.push(index);
        }
    }

    const container = document.getElementById('image-display');
    container.innerHTML = '';
    displayIndices.forEach(index => {
        let product = productList[index];
        product.timesShown = (product.timesShown || 0) + 1;

        let imageContainer = document.createElement('div');
        imageContainer.className = 'product-container';

        let img = document.createElement('img');
        img.onerror = function() { this.src = 'https://via.placeholder.com/150'; };
        img.src = product.filepath;
        img.alt = product.name;
        img.dataset.index = index;
        
        img.addEventListener('click', function() {
            productList[this.dataset.index].clicks = (productList[this.dataset.index].clicks || 0) + 1;
            imageRender();
        });

        let countDisplay = document.createElement('div');
        countDisplay.innerText = `Shown: ${product.timesShown}, Clicks: ${product.clicks}`;

        imageContainer.appendChild(img);
        imageContainer.appendChild(countDisplay);
        container.appendChild(imageContainer);
    });
}


let currentRound = 0;
let totalRounds = 25;

function startVotingSession() {
    if (currentRound < totalRounds) {
        imageRender();
    } else {
        endVotingSession();
    }
}

let lastDisplayedIndices = []; // Array to store indices of products displayed in the last iteration

function imageRender() {
    let displayIndices = [];
    while (displayIndices.length < 3) {
        let index = Math.floor(Math.random() * productList.length);
        if (!displayIndices.includes(index) && !lastDisplayedIndices.includes(index)) {
            displayIndices.push(index);
        }
    }

    lastDisplayedIndices = [...displayIndices]; // Update lastDisplayedIndices for the next iteration

    const container = document.getElementById('image-display');
    container.innerHTML = '';
    displayIndices.forEach(index => {
        let product = productList[index];
        product.timesShown = (product.timesShown || 0) + 1;

        let imageContainer = document.createElement('div');
        imageContainer.className = 'product-container';

        let img = document.createElement('img');
        img.onerror = function() { this.src = 'https://via.placeholder.com/150'; };
        img.src = product.filepath;
        img.alt = product.name;
        img.dataset.index = index;
        
        img.addEventListener('click', function() {
            productList[this.dataset.index].clicks = (productList[this.dataset.index].clicks || 0) + 1;
            currentRound++;
            startVotingSession(); // Call startVotingSession to decide the next step
        });

        let countDisplay = document.createElement('div');
        countDisplay.innerText = `Shown: ${product.timesShown}, Clicks: ${product.clicks}`;

        imageContainer.appendChild(img);
        imageContainer.appendChild(countDisplay);
        container.appendChild(imageContainer);
    });
}

// Modified endVotingSession to include serialization and reconstruction
function endVotingSession() {
    const container = document.getElementById('image-display');
    container.innerHTML = '<p>Voting session has ended. Thank you for participating!</p>';

    // Serialize productList to JSON and store it
    const productListJson = JSON.stringify(productList);
    
    // Parse JSON back to object
    const retrievedProductList = JSON.parse(productListJson);

    // Reconstruct productList using the constructor
    productList = retrievedProductList.map(item => new products(item.name, item.filepath, item.timesShown));

    // Create a button element for viewing results
    let resultsButton = document.createElement('button');
    resultsButton.textContent = 'View Results';
    resultsButton.addEventListener('click', function() {
        displayResults(); // Adjusted to work with reconstructed productList
        displayResultsChart(); // Also adjusted accordingly
    });

    container.appendChild(resultsButton);
}

function displayResults() {
    // Assume a separate container or ensures it does not remove the canvas for the chart
    const resultsContainer = document.getElementById('results-container'); // Ensure this is a different container
    resultsContainer.innerHTML = ''; // Clear the container for results

    let resultsList = document.createElement('ul');
    productList.forEach(product => {
        let item = document.createElement('li');
        item.textContent = `${product.name}: ${product.clicks} clicks, ${product.timesShown} times shown`;
        resultsList.appendChild(item);
    });

    resultsContainer.appendChild(resultsList);
    // Do not clear or alter the canvas element here
}

// This function assumes a <canvas> element with id 'resultsChart' exists in the HTML.
function displayResultsChart() {
    const ctx = document.getElementById('resultsChart').getContext('2d');
    const labels = productList.map(product => product.name);
    const clicksData = productList.map(product => product.clicks);
    const viewsData = productList.map(product => product.timesShown);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Clicks',
                data: clicksData,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }, {
                label: 'Views',
                data: viewsData,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}


startVotingSession();