// Generate the normal distribution data
function generateData() {
    const x = [];
    const y = [];
    for (let i = -4; i <= 4; i += 0.01) {
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
  let xi = -4 + (8 * i) / (N - 1); // Now from -4 to 4
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
        legend: { display: false },
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
          min: -4,
          max: 4,
          ticks: {
            stepSize: 1,
            callback: function(value) {
              // Only show ticks at -4, -3, -2, -1, 0, 1, 2, 3, 4, rounded to 0 decimals
              if ([-4, -3, -2, -1, 0, 1, 2, 3, 4].includes(value)) {
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