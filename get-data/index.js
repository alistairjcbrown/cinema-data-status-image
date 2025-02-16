require('dotenv').config()

const { writeFileSync } = require("node:fs");
const { join } = require("node:path");

const org = "clusterflick";
const getLatestRelease = (repo) =>
  `https://api.github.com/repos/${org}/${repo}/releases/latest`;
const getLastestRuns = (repo) =>
  `https://api.github.com/repos/${org}/${repo}/actions/runs`;
const writeData = (prefix, repo, data) => {
  const outputPath = join(__dirname, `${prefix}-${repo}.json`);
  writeFileSync(outputPath, JSON.stringify(data, null, 4));
};

const repos = [
  "data-retrieved",
  "data-transformed",
  "data-combined",
  "clusterflick.com",
];

(async function () {
  for (const repo of repos) {
    console.log(`${repo} ...`);
    const releaseData = await (
      await fetch(getLatestRelease(repo), {
        method: "GET",
        headers: {
          Authorization: `token ${process.env.GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
      })
    ).json();
    releaseData.retrievedAt = Date.now();
    writeData("release", repo, releaseData);
    const runsData = await (await fetch(getLastestRuns(repo))).json();
    runsData.retrievedAt = Date.now();
    writeData("runs", repo, runsData);
  }
})();
