const JSON_DATA_URL = "./data.json";

const parser = new DOMParser();

const totalScoreElem = document.querySelector(".result__score__points"); 

async function fetchData(path, toJson = true) {
    try {
        const response = await fetch(path);
        const json = toJson ? await response.json() : await response.text();
        return json;
    } catch(error) {
        console.log("There was an error fetching the data", error);
    }
}

async function displayData(data) {
    let totalScore = 0;

    for (let component of data) {
        const selector = `.summary__component.${component.category.toLowerCase()}`; 
        const scoreComponent = document.querySelector(selector);
        const scoreComponentHeader = scoreComponent.querySelector("header");
        const scorePoints = scoreComponent.querySelector(".summary__component__score__points");

        const svgString = await fetchData(component.icon, false);
        const svgDoc = parser.parseFromString(svgString, "image/svg+xml");
        const svg = svgDoc.documentElement;
        scoreComponentHeader.prepend(svg); 

        scorePoints.textContent = component.score;

        totalScore += component.score;
    }

    totalScore /= data.length;
    totalScoreElem.textContent = Math.round(totalScore);    
}

async function populateData() {
    const data = await fetchData(JSON_DATA_URL);
    displayData(data);
}

populateData();