class GitHubRepo {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}

class GitHubUser {
    constructor(id, login) {
        this.id = id;
        this.login = login;
    }
}

class GitHubEvent {
    constructor(id, type, actor, repo, created_at, payload) {
        this.id = id;
        this.type = type;
        this.actor = actor;
        this.repo = repo;
        this.created_at = created_at;
        this.payload = payload;
    }
}

class GitHubPayload {
    constructor() {
        this.commits = [];
        this.ref_type = "";
        this.action = "";
    }
}

class GitHubCommit {
    constructor(message) {
        this.message = message;
    }
}

class WrappedStats {
    constructor() {
        this.totalCommits = 0;
        this.newRepos = [];
        this.issuesOpened = 0;
        this.pullRequestsOpened = 0;
        this.worstCommitMessages = [];
        this.longestCommitMessage = "";
        this.shortestCommitMessage = "";
        this.mostActiveRepo = "";
        this.mostActiveRepoCommits = 0;
    }

    static FromGitHubData(data) {
        let totalCommits = 0;
        let newRepos = [];
        let issuesOpened = 0;
        let pullRequestsOpened = 0;
        let commitMessages = [];
        let longestCommitMessage = "";
        let shortestCommitMessage = "";
        let shortestCommitMessageSet = false;
        let commitsInRepo = [];

        totalCommits = data.commits[0] ? data.commits[0].total_count : 0;
        issuesOpened = data.issues[0] ? data.issues[0].total_count : 0;
        pullRequestsOpened = data.pull_requests[0] ? data.pull_requests[0].total_count : 0;
        newRepos = data.repos.filter(r => !r.fork).map(r => r.name);

        for (const commitPage of data.commits) {
            for (const commit of commitPage.items) {
                commitMessages.push({
                    message: commit.commit.message,
                    score: rateCommitMessage(commit.commit.message)
                });

                if (commitsInRepo.filter((kvp) => kvp.name === commit.repository.name).length === 0) {
                    commitsInRepo.push({
                        name: commit.repository.name,
                        count: 1
                    });
                } else {
                    commitsInRepo.filter((kvp) => kvp.name === commit.repository.name)[0].count++;
                }
            }
        }
        //
        // for (const issuePage of data.issues) {
        //     for (const issue of issuePage.items) {
        //         if (issue.created_at.slice(0, 4) === "2024") {
        //             issuesOpened++;
        //         }
        //     }
        // }
        //
        // for (const pullRequestPage of data.pull_requests) {
        //     for (const pullRequest of pullRequestPage.items) {
        //         if (pullRequest.created_at.slice(0, 4) === "2024") {
        //             pullRequestsOpened++;
        //         }
        //     }
        // }

        // for (const repo of data.repos) {
        //     if (repo.created_at.slice(0, 4) === "2024" && repo.fork === false) {
        //         newRepos.push(repo.name);
        //     }
        // }

        for (const message of commitMessages) {
            if (!shortestCommitMessageSet || message.message.length < shortestCommitMessage.length) {
                shortestCommitMessage = message.message;
                shortestCommitMessageSet = true;
            }

            if (message.message.length > longestCommitMessage.length) {
                longestCommitMessage = message.message;
            }
        }

        let worstCommitMessages = commitMessages.sort((a, b) => a.score - b.score).slice(0, 10);
        let mostActiveRepo = commitsInRepo.sort((a, b) => b.count - a.count)[0];

        return {
            totalCommits: totalCommits,
            newRepos: newRepos,
            issuesOpened: issuesOpened,
            pullRequestsOpened: pullRequestsOpened,
            worstCommitMessages: worstCommitMessages.map((message) => message.message),
            longestCommitMessage: longestCommitMessage,
            shortestCommitMessage: shortestCommitMessage,
            mostActiveRepo: mostActiveRepo.name,
            mostActiveRepoCommits: mostActiveRepo.count
        };
    }
}

function rateCommitMessage(message) {
    let score = 0;
    score += message.length;
    score *= message.split(" ").length;
    return score;
}
