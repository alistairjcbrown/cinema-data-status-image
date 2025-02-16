const { setupCanvas, timeDifference } = require("./utils");

function generateSuccessImage({
  runsStatus,
  finishedAt,
  assetCount,
  assetSize,
  tag,
}) {
  const { ctx, drawLine, drawText, drawCircle, drawCircleLine } =
    setupCanvas("#4BB543");
  ctx.font = "bold 30pt 'PT Sans'";
  drawText("Clusterflick", 3);

  for (const [index, { status }] of runsStatus.entries()) {
    drawCircle(index, 6, status);
    if (index < runsStatus.length - 1) {
      drawCircleLine(index, index + 1, 6, status);
    }
  }

  drawLine(8.5, "#8dd387");

  const duration = runsStatus.reduce(
    (total, { startedAt, finishedAt }) =>
      total + new Date(finishedAt).getTime() - new Date(startedAt).getTime(),
    0,
  );
  ctx.font = "bold 15pt 'PT Sans'";
  drawText(`Completed ${timeDifference(finishedAt)} ago`, 11);
  drawText(`Total time taken ${timeDifference(Date.now() - duration)}`, 13);

  ctx.font = "normal 13pt 'PT Sans'";
  drawText(`${assetSize}MB data retrieved (${assetCount} assets)`, 15.5);
  drawText(`Tagged with ${tag}`, 17.5);

  ctx.font = "normal 9pt 'PT Sans'";
  drawText(`Status generated at ${new Date().toISOString()}`, 19.5);

  return ctx;
}

function generateFailureImage({ runsStatus, failedAt }) {
  const { ctx, drawLine, drawText, drawCircle, drawCircleLine } =
    setupCanvas("#b5434b");
  ctx.font = "bold 30pt 'PT Sans'";
  drawText("Clusterflick", 3);

  const failedStep = runsStatus.find(({ status }) => status === "failure");
  for (const [index, { status }] of runsStatus.entries()) {
    if (index !== 0) {
      drawCircleLine(index - 1, index, 6, status);
    }
    drawCircle(index, 6, status);
  }

  drawLine(8.5, "#cd787e");

  ctx.font = "bold 15pt 'PT Sans'";
  drawText(`Step started ${timeDifference(failedStep.startedAt)} ago`, 11);
  drawText(`and failed ${timeDifference(failedAt)} ago`, 13);

  ctx.font = "normal 13pt 'PT Sans'";
  drawText(`Failed on step ${runsStatus.indexOf(failedStep) + 1},`, 14.5);
  ctx.font = "bold 14pt 'PT Sans'";
  drawText(`"${failedStep.name}"`, 16.5);

  ctx.font = "normal 9pt 'PT Sans'";
  drawText(`Status generated at ${new Date().toISOString()}`, 19.5);

  return ctx;
}

function generatePendingImage({ runsStatus }) {
  const { ctx, drawLine, drawText, drawCircle, drawCircleLine } =
    setupCanvas("#bba616");
  ctx.font = "bold 30pt 'PT Sans'";
  drawText("Clusterflick", 3);

  const pendingStep = runsStatus.find(({ status }) => status === "pending");
  for (const [index, { status }] of runsStatus.entries()) {
    if (index !== 0) {
      drawCircleLine(index - 1, index, 6, status);
    }
    drawCircle(index, 6, status);
  }

  drawLine(8.5, "#eee780");

  ctx.font = "bold 15pt 'PT Sans'";
  drawText(`Step started ${timeDifference(pendingStep.startedAt)} ago`, 11);

  ctx.font = "normal 13pt 'PT Sans'";
  drawText(
    `Currently running step ${runsStatus.indexOf(pendingStep) + 1},`,
    14.5,
  );
  ctx.font = "bold 14pt 'PT Sans'";
  drawText(`"${pendingStep.name}"`, 16.5);

  ctx.font = "normal 9pt 'PT Sans'";
  drawText(`Status generated at ${new Date().toISOString()}`, 19.5);

  return ctx;
}

module.exports = {
  generateSuccessImage,
  generateFailureImage,
  generatePendingImage,
};
