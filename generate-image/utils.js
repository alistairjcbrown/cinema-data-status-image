const { createCanvas } = require("canvas");

function timeDifference(from, to = new Date()) {
  const fromDate = from instanceof Date ? from : new Date(from);
  const toDate = to instanceof Date ? to : new Date(to);
  const formatter = new Intl.RelativeTimeFormat("en");
  const ranges = {
    years: 3600 * 24 * 365,
    months: 3600 * 24 * 30,
    weeks: 3600 * 24 * 7,
    days: 3600 * 24,
    hours: 3600,
    minutes: 60,
    seconds: 1,
  };
  const secondsElapsed = (fromDate.getTime() - toDate.getTime()) / 1000;
  for (const key in ranges) {
    if (ranges[key] < Math.abs(secondsElapsed)) {
      const delta = secondsElapsed / ranges[key];
      return formatter.format(Math.round(delta), key).replace(" ago", "");
    }
  }
}

function setupCanvas(color) {
  const width = 320;
  const height = 240;
  const canvas = createCanvas(width, height);

  const ctx = canvas.getContext("2d");
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);

  const getLineHeight = (line) => (height / 20) * line

  function defaultStyles() {
    ctx.textAlign = "center";
    ctx.fillStyle = "#fff";
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1;
  }

  function drawText(text, line) {
    defaultStyles();
    ctx.fillText(text, width / 2, getLineHeight(line));
  }

  function drawLine(line, color) {
    if (color) ctx.fillStyle = color;
    defaultStyles();
    ctx.beginPath();
    ctx.moveTo(0, getLineHeight(line));
    ctx.lineTo(width, getLineHeight(line));
    ctx.stroke();
  }

  function getTextFor(status) {
    if (status === "success") return "✓";
    if (status === "failure") return "✕";
    if (status === "pending") return "●";
    return "";
  }

  function setupCircleStyles(status) {
    if (status === "success") {
      ctx.fillStyle = "#398a33";
      ctx.strokeStyle = "#1c4219";
    }
    if (status === "failure") {
      ctx.fillStyle = "#7c2e33";
      ctx.strokeStyle = "#511e21";
    }
    if (status === "pending") {
      ctx.fillStyle = "#dec51b";
      ctx.strokeStyle = "#988712";
    }
    if (status === "blank") {
      ctx.fillStyle = "#afafaf";
      ctx.strokeStyle = "#878787";
    }
    ctx.lineWidth = 2;
  }

  function drawCircle(column, line, status) {
    setupCircleStyles(status);
    const x = 46 + (76 * column);
    const y = getLineHeight(line);
    const radius = 18;
    const startAngle = 0;
    const endAngle = 2 * Math.PI;

    ctx.beginPath();
    ctx.arc(x, y, radius, startAngle, endAngle, false);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x, y, radius, startAngle, endAngle, false);
    ctx.stroke();

    ctx.font = "normal 18pt 'PT Sans'";
    ctx.fillStyle = "#fff";
    const text = getTextFor(status);
    const measurements = ctx.measureText(text);
    ctx.fillText(text, x, y + measurements.actualBoundingBoxAscent / 2);
  }

  function drawCircleLine(columnFrom, columnTo, line, status) {
    setupCircleStyles(status);
    const radius = 18;
    ctx.beginPath();
    ctx.moveTo(46 + (76 * columnFrom) + radius + 1, getLineHeight(line));
    ctx.lineTo(46 + (76 * columnTo) - radius - 1, getLineHeight(line));
    ctx.stroke();
  }

  return {
    ctx,
    drawText,
    drawLine,
    drawCircle,
    drawCircleLine,
  };
}

module.exports = {
  timeDifference,
  setupCanvas,
};
