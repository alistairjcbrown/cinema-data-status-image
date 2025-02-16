const fs = require("node:fs");
const path = require("node:path");
const { generateSuccessImage, generateFailureImage, generatePendingImage } = require("./generate-image");

const readData = (prefix, repo) => {
  const filePath = path.join(
    __dirname,
    "..",
    "get-data",
    `${prefix}-${repo}.json`,
  );
  return require(filePath);
};

const writeImage = (canvas) => {
  const buffer = canvas.toBuffer("image/png");
  const outputPath = path.join(__dirname, "image.png");
  fs.writeFileSync(outputPath, buffer);
};

const repos = [
  "data-retrieved",
  "data-transformed",
  "data-combined",
  "clusterflick.com",
];

(async function () {
  const files = [];
  for (const repo of repos) {
    files.push({
      release: readData("release", repo),
      runs: readData("runs", repo),
    });
  }

  let overallStatus;
  let runsStatus = [];
  let failedAt;
  for (const { runs } of files) {
    const latestRun = runs.workflow_runs[0];
    if (overallStatus) {
      runsStatus.push({ name: latestRun.name, status: "blank" });
      continue;
    }

    if (latestRun.status === "completed") {
      if (latestRun.conclusion === "success") {
        runsStatus.push({ name: latestRun.name, status: "success" });
      } else {
        if (!overallStatus) overallStatus = "failure";
        runsStatus.push({ name: latestRun.name, status: "failure" });
        failedAt = latestRun.updated_at;
      }
    } else {
      if (!overallStatus) overallStatus = "pending";
      runsStatus.push({ name: latestRun.name, status: "pending" });
    }
  }
  if (!overallStatus) overallStatus = "success";

    const startedAt = files[0].runs.workflow_runs[0].created_at;
    const finishedAt = files[files.length - 1].runs.workflow_runs[0].updated_at;
    const retrievedAt = files[0].release.retrievedAt;

  if (overallStatus === "success") {
    const totalSize = files[0].release.assets.reduce(
      (total, { size }) => total + size,
      0,
    );
    const assetCount = files[0].release.assets.length;
    const assetSize = Math.round(totalSize / 1024 / 1024);
    const tag = files[0].release.tag_name;
    const params = {
      runsStatus,
      startedAt,
      finishedAt,
      assetCount,
      assetSize,
      tag,
      retrievedAt
    };

    const { canvas } = generateSuccessImage(params);
    writeImage(canvas);
    return;
  }

  if (overallStatus === "failure") {
    const params = {
      runsStatus,
      startedAt,
      failedAt,
      retrievedAt
    };

    const { canvas } = generateFailureImage(params);
    writeImage(canvas);
    return;
  }

  if (overallStatus === "pending") {
    const params = {
      runsStatus,
      startedAt,
      retrievedAt
    };

    const { canvas } = generatePendingImage(params);
    writeImage(canvas);
    return;
  }

  throw new Error(`Unknown status ${overallStatus}`);
})();
