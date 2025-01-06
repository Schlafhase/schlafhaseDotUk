const fetchingDisplay = document.querySelector('#fetching');
const fetchingCommitsElement = document.querySelector('#fetching div:nth-child(1)');
const fetchingIssuesElement = document.querySelector('#fetching div:nth-child(2)');
const fetchingPullRequestsElement = document.querySelector('#fetching div:nth-child(3)');
const fetchingReposElement = document.querySelector('#fetching div:nth-child(4)');

const backgroundCanvasCtx = document.querySelector('#background').getContext('2d');
const width = backgroundCanvasCtx.canvas.width = window.innerWidth;
const height = backgroundCanvasCtx.canvas.height = window.innerHeight * 2;

const title = document.querySelector('#title');
const subtitle = document.querySelector('#subtitle');
const sectionHeader = document.querySelector('#section-header');

const data = document.querySelector('#data');
const dataContainer = document.querySelector('#data-container');

let frame = 0;

const backgroundImage = document.getElementById('star-image');
const starsNoBG = document.getElementById('stars-no-bg');

const twentyTwentyFour = new Date(2024, 0, 1, 12);

backgroundCanvasCtx.fillStyle = "black";
backgroundCanvasCtx.fillRect(0, 0, width, height);

// commits
let mostProductiveDay = twentyTwentyFour;
let mostProductiveDayCommitCount = 0;

let longestStreak = 0;
let currentStreak = 0;
let longestStreakBegin = twentyTwentyFour;
let currentStreakBegin = twentyTwentyFour;

Date.prototype.addDays = function (days) {
    const date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms * 1000));
}

function showCommitData(commits) {
    dataContainer.style.width = "var(--width)";
    dataContainer.style.opacity = "1";
    data.style.display = "grid";
    data.style.gridTemplateColumns = "repeat(50, auto)";

    for (let i = 0; i < 365; i++) {
        const commitElement = document.createElement('div');
        const commitOverlay = document.createElement('div');

        commitElement.classList.add('commit');
        commitOverlay.classList.add('commit-overlay');

        commitElement.classList.add(`commit-${i % 50}`);
        commitOverlay.classList.add(`commit-overlay-${i}`);

        commitElement.appendChild(commitOverlay);
        data.appendChild(commitElement);
    }

    showCommit(0);
    countCommits(0, commits);
}

function showCommit(index) {
    const commitElements = document.querySelectorAll(`.commit-${index}`);

    for (const commitElement of commitElements) {
        commitElement.style.transform = "scale(1)";
    }
    if (index < 49) {
        setTimeout(() => showCommit(index + 1), 15);
    }
}

function countCommits(index, commits) {
    const commitElement = document.querySelector(`.commit-overlay-${index}`);

    const thisDate = twentyTwentyFour.addDays(index);
    const thisDateString = thisDate.toISOString().slice(0, 10);

    const commitCount = commits.filter((commit) => commit.commit.author.date.slice(0, 10) === thisDateString).length;
    commitElement.style.opacity = lerp(0, 1, commitCount / 10);

    if (commitCount > mostProductiveDayCommitCount) {
        mostProductiveDayCommitCount = commitCount;
        mostProductiveDay = thisDate;
    }

    if (commitCount === 0) {
        currentStreak = 0;
        currentStreakBegin = thisDate;
    } else {
        currentStreak++;
        if (currentStreak > longestStreak) {
            longestStreak = currentStreak;
            longestStreakBegin = currentStreakBegin;
        }
    }

    if (index < 364) {
        setTimeout(() => countCommits(index + 1, commits), 0);
    }
}

function showSectionHeader(title) {
    sectionHeader.innerHTML = title;
    sectionHeader.style.transform = "translateY(0)";
}

function hideSectionHeader() {
    sectionHeader.style.transform = "translateY(-50vh)";
}

function shrinkHideTitle() {
    title.style.transform = "scale(0)";
    setTimeout(() => title.style.transition = "transform 0s", 500);
}

function flyToBottomHideTitle() {
    title.style.transform = "translateY(60vh)";
    setTimeout(() => title.style.transition = "transform 0s", 500);
}

function showTitleFromTop(newTitle, newSubtitle) {
    title.style.transform = "translateY(-60vh)";
    title.innerHTML = newTitle + "<div id=\"subtitle\">" + newSubtitle + "</div>";
    setTimeout(() => {
        title.style.transition = "transform 0.5s";
        title.style.transform = "translateY(0)";
    }, 20);
}

function showTitle(newTitle, newSubtitle) {
    title.style.transform = "scale(0)";

    title.innerHTML = newTitle + "<div id=\"subtitle\">" + newSubtitle + "</div>";
    setTimeout(() => {
        title.style.transition = "transform 0.5s";
        title.style.transform = "scale(1)";
    }, 20);
}

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
    backgroundCanvasCtx.drawImage(backgroundCanvasCtx.canvas, 0, 0, backgroundCanvasCtx.canvas.width + 0.005, backgroundCanvasCtx.canvas.height - 1.3);
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

title.style.transform = "scale(0)";
updateFetchingDisplay(0);

initializeBackground();

backgroundCanvasCtx.drawImage(starsNoBG, 0, 0, width, height)
spawnNewCirclesBackgroundLoop()
updateBackgroundCanvasLoop();


let wrapped = new WrappedStats();

// GetData("Schlafhase").then(onDataArrived);
// onDataArrived(testData);


setTimeout(() => onDataArrived(testData), 100);

function onDataArrived(ghData) {
    document.querySelector("#loading").style.display = "none";
    console.log(ghData);
    wrapped = WrappedStats.FromGitHubData(ghData);

    console.log(wrapped);

    showTitle("<h1>Your GitHub Year in Review</h1>", "<p>Let's have a look at your GitHub activity in the past year.</p>");
    setTimeout(() => commitsSection(ghData), 2000);
    // commitCount.innerHTML = wrapped.totalCommits.toString();
    // newRepos.innerHTML = wrapped.newRepos.join(", ");
    // issuesOpened.innerHTML = wrapped.issuesOpened.toString();
    // pullsOpened.innerHTML = wrapped.pullRequestsOpened.toString();
    // mostActiveRepo.innerHTML = wrapped.mostActiveRepo;
    // mostActiveRepoCommitCount.innerHTML = wrapped.mostActiveRepoCommits.toString();
    //
    // for (const message of wrapped.worstCommitMessages) {
    //     const listItem = document.createElement('li');
    //     listItem.innerHTML = message.replace("\n", "<br/>");
    //     worstCommitMessages.appendChild(listItem);
    // }
    //
    // shortestCommitMessages.innerHTML = wrapped.shortestCommitMessage.replace("\n", "<br/>");
    // longestCommitMessages.innerHTML = wrapped.longestCommitMessage.replace("\n", "<br/>");
}

function commitsSection(ghData) {
    shrinkHideTitle();

    sleep(0.5).then(() => {
        showTitleFromTop("Let's start with the commits!", "");

        sleep(1.5).then(() => {
            flyToBottomHideTitle();

            sleep(0.5).then(() => {
                title.style.top = "40%";

                showSectionHeader("Commits");
                const commits = ghData.commits.flatMap(page => page.items);
                showCommitData(commits);

                sleep(0.2).then(() => {
                    showTitle("You've commited a total of " + wrapped.totalCommits + " times!", wrapped.totalCommits > 1000 ? "Wow! You must have been busy." : wrapped.totalCommits > 500 ? "That's a lot of code!" : wrapped.totalCommits > 365 ? "That's more than one commit every day!" : "I'm sure you will code even more next year!");
                });
            });
        });
    });
}