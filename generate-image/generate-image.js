const { setupCanvas, timeDifference } = require("./utils");

function generateSuccessImage({
  runsStatus,
  startedAt,
  finishedAt,
  assetCount,
  assetSize,
  tag,
  retrievedAt
}) {
  const { ctx, drawLine, drawText, drawCircle, drawCircleLine } = setupCanvas("#4BB543");
  /*
    ClusterFlick
    (✓) - (✓) - (✓) - (✓)
    Pipeline started X time ago and run took X time
    X of data retrieved
    Tagged X tag
    Status generated X time ago
  */
  ctx.font = "bold 30pt 'PT Sans'";
  drawText("Clusterflick", 3);

  for (const [index, { status }] of runsStatus.entries()) {
    drawCircle(index, 6, status);
    if (index < runsStatus.length - 1) {
      drawCircleLine(index, index+1, 6, status)
    }
  }

  drawLine(8.5, "#8dd387");

  ctx.font = "bold 16pt 'PT Sans'";
  drawText(`Pipeline started ${timeDifference(startedAt)} ago`, 11);
  drawText(`and took ${timeDifference(startedAt, finishedAt)}`, 13);

  ctx.font = "normal 14pt 'PT Sans'";
  drawText(`${assetSize}MB data retrieved (${assetCount} assets)`, 15.5);
  drawText(`Tagged with ${tag}`, 17.5);

  ctx.font = "normal 10pt 'PT Sans'";
  drawText(`Status generated ${timeDifference(retrievedAt)} ago`, 19.5);

  return ctx;
}

function generateFailureImage({
  runsStatus,
  startedAt,
  failedAt,
  retrievedAt
}) {
  const { ctx, drawLine, drawText, drawCircle, drawCircleLine } = setupCanvas("#b5434b");
  /*
    ClusterFlick
    (✓) - (✕) - ( ) - ( )
    Pipeline started X time ago and failed X time ago
    Failed on second step X
    Status generated X time ago
  */
  ctx.font = "bold 30pt 'PT Sans'";
  drawText("Clusterflick", 3);

  for (const [index, { status }] of runsStatus.entries()) {
    if (index !== 0) {
      drawCircleLine(index - 1, index, 6, status)
    }
    drawCircle(index, 6, status);
  }

  drawLine(8.5, "#cd787e");

  ctx.font = "bold 16pt 'PT Sans'";
  drawText(`Pipeline started ${timeDifference(startedAt)} ago`, 11);
  drawText(`and failed ${timeDifference(failedAt)} ago`, 13);

  ctx.font = "normal 14pt 'PT Sans'";
  const failedStep = runsStatus.find(({ status }) => status === "failure");
  drawText(`Failed on step ${runsStatus.indexOf(failedStep) + 1},`, 14.5)
  ctx.font = "bold 14pt 'PT Sans'";
  drawText(`"${failedStep.name}"`, 16.5);

  ctx.font = "normal 10pt 'PT Sans'";
  drawText(`Status generated ${timeDifference(retrievedAt)} ago`, 19.5);

  return ctx;
}

function generatePendingImage({
  runsStatus,
  startedAt,
  retrievedAt
}) {
  const { ctx, drawLine, drawText, drawCircle, drawCircleLine } = setupCanvas("#bba616");
  /*
    ClusterFlick
    (✓) - (⬤) - ( ) - ( )
    Pipeline started X time ago
    Currently running second step X
    Status generated X time ago
  */
  ctx.font = "bold 30pt 'PT Sans'";
  drawText("Clusterflick", 3);

  for (const [index, { status }] of runsStatus.entries()) {
    if (index !== 0) {
      drawCircleLine(index - 1, index, 6, status)
    }
    drawCircle(index, 6, status);
  }

  drawLine(8.5, "#eee780");

  ctx.font = "bold 16pt 'PT Sans'";
  drawText(`Pipeline started ${timeDifference(startedAt)} ago`, 11);

  ctx.font = "normal 14pt 'PT Sans'";
  const pendingStep = runsStatus.find(({ status }) => status === "pending");
  drawText(`Currently running step ${runsStatus.indexOf(pendingStep) + 1},`, 14.5)
  ctx.font = "bold 14pt 'PT Sans'";
  drawText(`"${pendingStep.name}"`, 16.5);

  ctx.font = "normal 10pt 'PT Sans'";
  drawText(`Status generated ${timeDifference(retrievedAt)} ago`, 19.5);

  return ctx;
}

module.exports = {
  generateSuccessImage,
  generateFailureImage,
  generatePendingImage,
};
