const fetchingDisplay = document.querySelector('#fetching');
const fetchingCommitsElement = document.querySelector('#fetching div:nth-child(1)');
const fetchingIssuesElement = document.querySelector('#fetching div:nth-child(2)');
const fetchingPullRequestsElement = document.querySelector('#fetching div:nth-child(3)');
const fetchingReposElement = document.querySelector('#fetching div:nth-child(4)');

const backgroundCanvasCtx = document.querySelector('#background').getContext('2d');
const width = backgroundCanvasCtx.canvas.width = window.innerWidth;
const height = backgroundCanvasCtx.canvas.height = window.innerHeight * 2;

let frame = 0;

const backgroundImage = document.getElementById('star-image');
const starsNoBG = document.getElementById('stars-no-bg');

backgroundCanvasCtx.fillStyle = "black";
backgroundCanvasCtx.fillRect(0, 0, width, height);

function lerp(a, b, t) {
    return a + (b - a) * t;
}

function initializeBackground() {
    for (let i = 0; i < 40; i++) {
        spawnNewCirclesBackground();

        for (let j = 0; j < 30; j++) {
            updateBackgroundCanvas();
        }
    }
}

function spawnNewCirclesBackground() {

    backgroundCanvasCtx.fillStyle = "black";
    backgroundCanvasCtx.fillRect(0, height - 10, width, height);
    for (let x = 0; x < width; x += 20) {
        backgroundCanvasCtx.fillStyle = `hsl(${lerp(0 + frame / 20, 360 + frame / 20, x / width)}, 100%, 70%)`;
        // backgroundCanvasCtx.fillRect(x, height-(Math.random()*30*Math.sin(x/100)+50), 9*Math.random(), 30*Math.random());
        backgroundCanvasCtx.beginPath();
        backgroundCanvasCtx.arc(x, height - (Math.random() * 50 * Math.sin(x / 100) + 50), 9 * Math.random(), 0, 2 * Math.PI);
        backgroundCanvasCtx.fill();
    }
}

function spawnNewCirclesBackgroundLoop() {
    spawnNewCirclesBackground();
    setTimeout(spawnNewCirclesBackgroundLoop, 300);
}

function updateBackgroundCanvas() {
    backgroundCanvasCtx.drawImage(backgroundCanvasCtx.canvas, 0, 0, backgroundCanvasCtx.canvas.width+0.005, backgroundCanvasCtx.canvas.height - 1.3);
    frame++;
}



function updateBackgroundCanvasLoop() {
    updateBackgroundCanvas();
    setTimeout(updateBackgroundCanvasLoop, 10);
}

function updateFetchingDisplay(pos) {
    fetchingDisplay.style.transform = `translateY(calc(${2 - pos}em)`;

    fetchingCommitsElement.style.opacity = (1 - Math.abs(0 - pos) / 3.5).toString();
    fetchingIssuesElement.style.opacity = (1 - Math.abs(1 - pos) / 3.5).toString();
    fetchingPullRequestsElement.style.opacity = (1 - Math.abs(2 - pos) / 3.5).toString();
    fetchingReposElement.style.opacity = (1 - Math.abs(3 - pos) / 3.5).toString();

    fetchingCommitsElement.style.color = pos >= 0 ? "lime" : "red";
    fetchingIssuesElement.style.color = pos >= 1 ? "lime" : "red";
    fetchingPullRequestsElement.style.color = pos >= 2 ? "lime" : "red";
    fetchingReposElement.style.color = pos >= 3 ? "lime" : "red";
}

const FetchAllPages = async (url) => {
    let result = [];

    for (let page = 1; page < 100; page++) {
        const pageURL = `${url}&page=${page}`;
        let response;

        try {
            response = await fetch(pageURL);
        } catch {
        }

        if (!response.ok) {
            break;
        }

        let responseJSON = await response.json();

        if (responseJSON.length == 0 || (responseJSON.items && responseJSON.items.length == 0)) {
            break;
        }
        result = result.concat(responseJSON);
    }

    return result;
}

const GetData = async (user) => {
    let commits;
    let issues;
    let pull_requests;
    let repos;

    let url = `https://api.github.com/search/commits?per_page=100&q=author:${user}`;
    commits = await FetchAllPages(url);
    updateFetchingDisplay(1);

    url = `https://api.github.com/search/issues?per_page=100&q=author:${user}+is:issue`;
    issues = await FetchAllPages(url);
    updateFetchingDisplay(2);

    url = `https://api.github.com/search/issues?per_page=100&q=author:${user}+is:pull-request`;
    pull_requests = await FetchAllPages(url);
    updateFetchingDisplay(3);

    url = `https://api.github.com/users/${user}/repos?per_page=100`;
    repos = await FetchAllPages(url);
    fetchingDisplay.style.display = "none";

    return {
        commits: commits,
        issues: issues,
        repos: repos,
        pull_requests: pull_requests
    };
}

console.log("im alive");


const commitCount = document.querySelector('#commits');
const newRepos = document.querySelector('#new-repos');
const issuesOpened = document.querySelector('#issues');
const pullsOpened = document.querySelector('#pulls');
const pullsMerged = document.querySelector('#merged');
const mostActiveRepo = document.querySelector('#most-active');
const mostActiveRepoCommitCount = document.querySelector('#most-active-repo-commits');
const worstCommitMessages = document.querySelector('#worst-commits');
const shortestCommitMessages = document.querySelector('#shortest-commit');
const longestCommitMessages = document.querySelector('#longest-commit');

updateFetchingDisplay(0);

initializeBackground();

backgroundCanvasCtx.drawImage(starsNoBG, 0, 0, width, height)
spawnNewCirclesBackgroundLoop()
updateBackgroundCanvasLoop();


let wrapped = new WrappedStats();

// GetData("Schlafhase").then(onDataArrived);
// onDataArrived(testData);

document.querySelector("#loading").style.display = "none";


function onDataArrived(data) {
    console.log(data);
    wrapped = WrappedStats.FromGitHubData(data);

    console.log(wrapped);

    commitCount.innerHTML = wrapped.totalCommits.toString();
    newRepos.innerHTML = wrapped.newRepos.join(", ");
    issuesOpened.innerHTML = wrapped.issuesOpened.toString();
    pullsOpened.innerHTML = wrapped.pullRequestsOpened.toString();
    mostActiveRepo.innerHTML = wrapped.mostActiveRepo;
    mostActiveRepoCommitCount.innerHTML = wrapped.mostActiveRepoCommits.toString();

    for (const message of wrapped.worstCommitMessages) {
        const listItem = document.createElement('li');
        listItem.innerHTML = message.replace("\n", "<br/>");
        worstCommitMessages.appendChild(listItem);
    }

    shortestCommitMessages.innerHTML = wrapped.shortestCommitMessage.replace("\n", "<br/>");
    longestCommitMessages.innerHTML = wrapped.longestCommitMessage.replace("\n", "<br/>");
}