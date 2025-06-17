// Generate the normal distribution data
function generateData() {
    const x = [];
    const y = [];
    for (let i = -5; i <= 5; i += 0.01) {
        x.push(i);
        y.push((1/Math.sqrt(2*Math.PI))*Math.exp(-0.5*i*i));
    }
    return {x, y};
}

function normalDensity(x) {
  return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
}

const x = [];
const y = [];
const N = 1000;
for (let i = 0; i < N; i++) {
  let xi = -5 + (10 * i) / (N - 1); // Now from -5 to 4
  x.push(xi);
  y.push(normalDensity(xi));
}

let critValue = 1.96;

// Approximate the error function erf
function erf(x) {
    const sign = (x >= 0) ? 1 : -1;
    x = Math.abs(x);
    const a1 =  0.254829592;
    const a2 = -0.284496736;
    const a3 =  1.421413741;
    const a4 = -1.453152027;
    const a5 =  1.061405429;
    const p  =  0.3275911;
    const t = 1.0/(1.0 + p*x);
    const y = 1.0 - (((((a5*t + a4)*t) + a3)*t + a2)*t + a1)*t*Math.exp(-x*x);
    return sign*y;
}

function inverseErf(x) {
  // Approximation of inverse error function
  // Source: https://stackoverflow.com/a/49766115
  let a = 0.147;
  let the_sign_of_x = x < 0 ? -1 : 1;
  let ln1minusxsqrd = Math.log(1 - x * x);
  let firstPart = (2 / (Math.PI * a)) + (ln1minusxsqrd / 2);
  let secondPart = ln1minusxsqrd / a;
  return the_sign_of_x * Math.sqrt(Math.sqrt(firstPart * firstPart - secondPart) - firstPart);
}

// Calculate the CDF for standard normal
function cdf(z) {
    return 0.5 * (1 + erf(z/Math.sqrt(2)));
}

// Inverse CDF for standard normal
function normalInv(p) {
  // p between 0 and 1
  if (p <= 0 || p >= 1) return NaN;
  return Math.sqrt(2) * inverseErf(2 * p - 1);
}

function getShadedData(crit) {
  const left = x.map((xi, i) => (xi <= -crit ? y[i] : null));
  const center = x.map((xi, i) => (xi > -crit && xi < crit ? y[i] : null));
  const right = x.map((xi, i) => (xi >= crit ? y[i] : null));
  return { left, center, right };
}

const ctx = document.getElementById('normalChart').getContext('2d');
let chart;

function drawChart(crit) {
  const { left, center, right } = getShadedData(crit);

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: x,
      datasets: [
        {
          label: 'Normal Curve',
          data: y,
          borderColor: 'black',
          borderWidth: 2,
          fill: false,
          pointRadius: 0,
        },
        {
          label: 'Left Tail',
          data: left,
          backgroundColor: 'rgba(255,0,0,0.3)',
          borderColor: 'rgba(255,0,0,0.0)',
          fill: true,
          pointRadius: 0,
        },
        {
          label: 'Center',
          data: center,
          backgroundColor: 'rgba(0,0,255,0.3)',
          borderColor: 'rgba(0,0,255,0.0)',
          fill: true,
          pointRadius: 0,
        },
        {
          label: 'Right Tail',
          data: right,
          backgroundColor: 'rgba(255,0,0,0.3)',
          borderColor: 'rgba(255,0,0,0.0)',
          fill: true,
          pointRadius: 0,
        },
      ],
    },
    options: {
      responsive: false,
      animation: false, // <-- Add this line to turn off animation
      plugins: {
        legend: { display: false }, // This hides the legend
        title: {
          display: true,
          text: `Standard Normal Distribution with Tails Colored Beyond ±${crit.toFixed(2)} SD`,
        },
        annotation: {
          annotations: {
            line1: {
              type: 'line',
              xMin: -crit,
              xMax: -crit,
              borderColor: 'blue',
              borderWidth: 2,
              borderDash: [6, 6],
            },
            line2: {
              type: 'line',
              xMin: crit,
              xMax: crit,
              borderColor: 'blue',
              borderWidth: 2,
              borderDash: [6, 6],
            },
          },
        },
      },
      scales: {
        x: {
          type: 'linear', // <-- Add this line
          title: { display: true, text: 'z-score' },
          min: -5,
          max: 5,
          ticks: {
            stepSize: 1,
            callback: function(value) {
              // Only show ticks at -4, -3, -2, -1, 0, 1, 2, 3, 4, rounded to 0 decimals
              if ([-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5].includes(value)) {
                return Math.round(value).toString();
              }
              return '';
            }
          }
        },
        y: {
          display: false,
          min: 0,
          max: 0.45,
        },
      },
    },
    plugins: [{
      id: 'custom-annotations',
      afterDraw: (chart) => {
        const ctx = chart.ctx;
        const xAxis = chart.scales.x;
        const yAxis = chart.scales.y;
        // Draw text annotations
        ctx.save();
        ctx.font = 'bold 16px Arial';
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.fillText(
          `${(100 * (1 - 2 * (1 - normalCdf(crit)))).toFixed(1)}% Confidence`,
          xAxis.getPixelForValue(0),
          yAxis.getPixelForValue(0.42)
        );
        ctx.font = '14px Arial';
        ctx.fillStyle = 'blue';
        ctx.fillText(
          `-${crit.toFixed(2)}`,
          xAxis.getPixelForValue(-crit) - 20,
          yAxis.getPixelForValue(0.43)
        );
        ctx.fillText(
          `${crit.toFixed(2)}`,
          xAxis.getPixelForValue(crit) + 20,
          yAxis.getPixelForValue(0.43)
        );
        ctx.fillStyle = 'red';
        ctx.fillText(
          (normalCdf(-crit)).toFixed(3),
          xAxis.getPixelForValue(-3),
          yAxis.getPixelForValue(0.025)
        );
        ctx.fillText(
          (normalCdf(-crit)).toFixed(3),
          xAxis.getPixelForValue(3),
          yAxis.getPixelForValue(0.025)
        );
        ctx.restore();
      }
    }]
  });
}

// Cumulative distribution function for standard normal
function normalCdf(z) {
  return 0.5 * (1 + erf(z / Math.sqrt(2)));
}

drawChart(critValue);

const confInput = document.getElementById('confLevel');
const confLabel = document.getElementById('confLevelLabel');
const slider = document.getElementById('critValue');
const label = document.getElementById('critValueLabel');

confInput.addEventListener('input', function () {
  let conf = parseFloat(this.value);
  if (isNaN(conf) || conf <= 50 || conf >= 100) return;
  let alpha = 1 - conf / 100;
  // Two-tailed, so area in each tail is alpha/2
  let crit = Math.abs(normalInv(1 - alpha / 2));
  critValue = crit;
  slider.value = crit.toFixed(2);
  label.textContent = crit.toFixed(2);
  drawChart(critValue);
});

slider.addEventListener('input', function () {
  critValue = parseFloat(this.value);
  label.textContent = critValue.toFixed(2);
  // Update confidence level box to match slider
  let conf = (100 * (1 - 2 * (1 - normalCdf(critValue)))).toFixed(2);
  confInput.value = conf;
  drawChart(critValue);
});

// --- Tab switching logic ---
document.getElementById('normalTab').onclick = function() {
  document.getElementById('normalTab').classList.add('active');
  document.getElementById('tTab').classList.remove('active');
  document.getElementById('normalContent').classList.remove('hidden');
  document.getElementById('tContent').classList.add('hidden');
};
document.getElementById('tTab').onclick = function() {
  document.getElementById('tTab').classList.add('active');
  document.getElementById('normalTab').classList.remove('active');
  document.getElementById('tContent').classList.remove('hidden');
  document.getElementById('normalContent').classList.add('hidden');
  // Force redraw of tChart
  if (typeof drawTChart === 'function') {
    drawTChart(tCritValue, tDf);
  }
};

// --- Student's t-distribution logic ---

// PDF for Student's t-distribution
function tDensity(x, df) {
  // Gamma function approximation
  function gamma(z) {
    // Lanczos approximation
    const g = 7;
    const p = [
      0.99999999999980993, 676.5203681218851, -1259.1392167224028,
      771.32342877765313, -176.61502916214059, 12.507343278686905,
      -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7
    ];
    if(z < 0.5) return Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z));
    z -= 1;
    let x = p[0];
    for(let i = 1; i < g + 2; i++) x += p[i] / (z + i);
    let t = z + g + 0.5;
    return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
  }
  let num = gamma((df + 1) / 2);
  let denom = Math.sqrt(df * Math.PI) * gamma(df / 2);
  return num / denom * Math.pow(1 + (x * x) / df, -(df + 1) / 2);
}

// CDF for Student's t-distribution (using numerical integration)
function tCdf(x, df) {
  return jStat.studentt.cdf(x, df);
}

// Inverse CDF for Student's t-distribution (bisection method)
function tInv(p, df) {
  return jStat.studentt.inv(p, df);
}

// Generate t-distribution data
function getTData(df) {
  const tx = [], ty = [];
  const N = 1000;
  for (let i = 0; i < N; i++) {
    let xi = -5 + (10 * i) / (N - 1); // Now from -5 to 5
    tx.push(xi);
    ty.push(tDensity(xi, df));
  }
  return { tx, ty };
}

// Chart.js for t-distribution
const tCtx = document.getElementById('tChart').getContext('2d');
let tChart;
let tCritValue = 2.23;
let tDf = 10;
let tConf = 95;

function drawTChart(crit, df) {
  const { tx, ty } = getTData(df);
  const left = tx.map((xi, i) => (xi <= -crit ? ty[i] : null));
  const center = tx.map((xi, i) => (xi > -crit && xi < crit ? ty[i] : null));
  const right = tx.map((xi, i) => (xi >= crit ? ty[i] : null));

  if (tChart) tChart.destroy();

  tChart = new Chart(tCtx, {
    type: 'line',
    data: {
      labels: tx,
      datasets: [
        {
          label: "t Curve",
          data: ty,
          borderColor: 'black',
          borderWidth: 2,
          fill: false,
          pointRadius: 0,
        },
        {
          label: 'Left Tail',
          data: left,
          backgroundColor: 'rgba(255,0,0,0.3)',
          borderColor: 'rgba(255,0,0,0.0)',
          fill: true,
          pointRadius: 0,
        },
        {
          label: 'Center',
          data: center,
          backgroundColor: 'rgba(0,0,255,0.3)',
          borderColor: 'rgba(0,0,255,0.0)',
          fill: true,
          pointRadius: 0,
        },
        {
          label: 'Right Tail',
          data: right,
          backgroundColor: 'rgba(255,0,0,0.3)',
          borderColor: 'rgba(255,0,0,0.0)',
          fill: true,
          pointRadius: 0,
        },
      ],
    },
    options: {
      responsive: false,
      animation: false,
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: `Student's t-Distribution (df = ${df}) with Tails Beyond ±${crit.toFixed(2)}`,
        }
      },
      scales: {
        x: {
          type: 'linear',
          title: { display: true, text: 't-score' },
          min: -5,
          max: 5,
          ticks: {
            stepSize: 1,
            callback: function(value) {
              if ([-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5].includes(value)) {
                return Math.round(value).toString();
              }
              return '';
            }
          }
        },
        y: {
          display: false,
          min: 0,
          max: 0.45,
        },
      },
      plugins: [{
        id: 'custom-annotations-t',
        afterDraw: (chart) => {
          const ctx = chart.ctx;
          const xAxis = chart.scales.x;
          const yAxis = chart.scales.y;
          const yMax = yAxis.max || 0.45;

          ctx.save();

          // % Confidence in the center
          ctx.font = 'bold 16px Arial';
          ctx.fillStyle = 'black';
          ctx.textAlign = 'center';
          const confPct = (100 * (tCdf(tCritValue, tDf) - tCdf(-tCritValue, tDf))).toFixed(1);
          ctx.fillText(
            `${confPct}% Confidence`,
            xAxis.getPixelForValue(0),
            yAxis.getPixelForValue(yMax * 0.93)
          );

          // Area under the curve (center)
          ctx.font = '14px Arial';
          ctx.fillStyle = 'blue';
          ctx.textAlign = 'center';
          ctx.fillText(
            `Area: ${(tCdf(tCritValue, tDf) - tCdf(-tCritValue, tDf)).toFixed(3)}`,
            xAxis.getPixelForValue(0),
            yAxis.getPixelForValue(yMax * 0.85)
          );

          // Label -tCritValue
          ctx.font = '14px Arial';
          ctx.fillStyle = 'blue';
          ctx.textAlign = 'right';
          ctx.fillText(
            `-t = ${tCritValue.toFixed(2)}`,
            xAxis.getPixelForValue(-tCritValue) - 5,
            yAxis.getPixelForValue(yMax * 0.80)
          );

          // Label +tCritValue
          ctx.textAlign = 'left';
          ctx.fillText(
            `t = ${tCritValue.toFixed(2)}`,
            xAxis.getPixelForValue(tCritValue) + 5,
            yAxis.getPixelForValue(yMax * 0.80)
          );

          // Area under the left tail
          ctx.fillStyle = 'red';
          ctx.textAlign = 'left';
          ctx.fillText(
            `Tail: ${tCdf(-tCritValue, tDf).toFixed(3)}`,
            xAxis.getPixelForValue(-4.5),
            yAxis.getPixelForValue(yMax * 0.15)
          );
          // Area under the right tail
          ctx.textAlign = 'right';
          ctx.fillText(
            `Tail: ${tCdf(-tCritValue, tDf).toFixed(3)}`,
            xAxis.getPixelForValue(4.5),
            yAxis.getPixelForValue(yMax * 0.15)
          );

          // Tail Area labels
          ctx.font = 'bold 14px Arial';
          ctx.fillStyle = 'red';
          ctx.textAlign = 'left';
          ctx.fillText(
            'Tail Area',
            xAxis.getPixelForValue(-4.5),
            yAxis.getPixelForValue(yMax * 0.08)
          );
          ctx.restore();
        }
      }]
    }
  });
}

// --- t-distribution controls ---
const tConfInput = document.getElementById('tConfLevel');
const tDfInput = document.getElementById('df');
const tSlider = document.getElementById('tCritValue');
const tLabel = document.getElementById('tCritValueLabel');

tConfInput.addEventListener('input', function () {
  let conf = parseFloat(this.value);
  // Only update if input is a valid number in range
  if (!isNaN(conf) && conf >= 50 && conf <= 99.9) {
    let alpha = 1 - conf / 100;
    let crit = Math.abs(tInv(1 - alpha / 2, tDf));
    tCritValue = crit;
    tSlider.value = crit.toFixed(2);
    tLabel.textContent = crit.toFixed(2);
    drawTChart(tCritValue, tDf);
  }
  // If invalid or empty, do nothing and let the user finish editing
});

tDfInput.addEventListener('input', function () {
  tDf = parseInt(this.value);
  let conf = parseFloat(tConfInput.value);
  let alpha = 1 - conf / 100;
  let crit = Math.abs(tInv(1 - alpha / 2, tDf));
  tCritValue = crit;
  tSlider.value = crit.toFixed(2);
  tLabel.textContent = crit.toFixed(2);
  drawTChart(tCritValue, tDf);
});

tSlider.addEventListener('input', function () {
  tCritValue = parseFloat(this.value);
  tLabel.textContent = tCritValue.toFixed(2);
  // Correct confidence level calculation:
  let conf = (100 * (tCdf(tCritValue, tDf) - tCdf(-tCritValue, tDf))).toFixed(2);
  tConfInput.value = conf;
  drawTChart(tCritValue, tDf);
});

// Initial draw
drawTChart(tCritValue, tDf);

const customAnnotationsT = {
  id: 'custom-annotations-t',
  afterDraw: (chart) => {
    const ctx = chart.ctx;
    const xAxis = chart.scales.x;
    const yAxis = chart.scales.y;
    const yMax = yAxis.max || 0.45;

    ctx.save();

    // % Confidence in the center
    ctx.font = 'bold 16px Arial';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    const confPct = (100 * (tCdf(tCritValue, tDf) - tCdf(-tCritValue, tDf))).toFixed(1);
    ctx.fillText(
      `${confPct}% Confidence`,
      xAxis.getPixelForValue(0),
      yAxis.getPixelForValue(yMax * 0.93)
    );

    // Label -tCritValue
    ctx.font = '14px Arial';
    ctx.fillStyle = 'blue';
    ctx.textAlign = 'right';
    ctx.fillText(
      `-t = ${tCritValue.toFixed(2)}`,
      xAxis.getPixelForValue(-tCritValue) - 5,
      yAxis.getPixelForValue(yMax * 0.80)
    );

    // Label +tCritValue
    ctx.textAlign = 'left';
    ctx.fillText(
      `t = ${tCritValue.toFixed(2)}`,
      xAxis.getPixelForValue(tCritValue) + 5,
      yAxis.getPixelForValue(yMax * 0.80)
    );

    // Area under the left tail
    ctx.fillStyle = 'red';
    ctx.textAlign = 'left';
    ctx.fillText(
      `${tCdf(-tCritValue, tDf).toFixed(3)}`,
      xAxis.getPixelForValue(-4.5),
      yAxis.getPixelForValue(yMax * 0.15)
    );
    // Area under the right tail
    ctx.textAlign = 'right';
    ctx.fillText(
      `${tCdf(-tCritValue, tDf).toFixed(3)}`,
      xAxis.getPixelForValue(4.5),
      yAxis.getPixelForValue(yMax * 0.15)
    );

    ctx.restore();
  }
};
Chart.register(customAnnotationsT);