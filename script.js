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

// Calculate the CDF for standard normal
function cdf(z) {
    return 0.5 * (1 + erf(z/Math.sqrt(2)));
}

function update() {
    const lowerZ = parseFloat(document.getElementById('lowerBound').value);
    const upperZ = parseFloat(document.getElementById('upperBound').value);
    document.getElementById('lowerBoundVal').innerText = lowerZ.toFixed(2);
    document.getElementById('upperBoundVal').innerText = upperZ.toFixed(2);

    const data = generateData();

    // Main line trace
    const traceLine = {
        x: data.x,
        y: data.y,
        type: 'scatter',
        mode: 'lines',
        name: 'Normal Distribution'
    };

    // Shade below lower bound
    const xShadeLeft = [];
    const yShadeLeft = [];
    for (let i = 0; i < data.x.length; i++) {
        if (data.x[i] <= lowerZ) {
            xShadeLeft.push(data.x[i]);
            yShadeLeft.push(data.y[i]);
        }
    }
    // Close the shape at lower bound
    xShadeLeft.push(lowerZ);
    yShadeLeft.push(0);

    // Shade above upper bound
    const xShadeRight = [];
    const yShadeRight = [];
    for (let i = 0; i < data.x.length; i++) {
        if (data.x[i] >= upperZ) {
            xShadeRight.push(data.x[i]);
            yShadeRight.push(data.y[i]);
        }
    }
    // Close the shape at upper bound
    xShadeRight.unshift(upperZ);
    yShadeRight.unshift(0);

    // Calculate probabilities beyond bounds
    const probLower = cdf(lowerZ);
    const probUpper = 1 - cdf(upperZ);
    const totalProbBeyond = probLower + probUpper;

    // Create fill traces
    const traceLeft = {
        x: [...xShadeLeft, lowerZ],
        y: [...yShadeLeft, 0],
        fill: 'toself',
        fillcolor: 'rgba(255,0,0,0.3)',
        line: { width: 0 },
        type: 'scatter',
        mode: 'none',
        hoverinfo: 'skip', // optional
        showlegend: false
    };

    const traceRight = {
        x: [...xShadeRight, upperZ],
        y: [...yShadeRight, 0],
        fill: 'toself',
        fillcolor: 'rgba(255,0,0,0.3)',
        line: { width: 0 },
        type: 'scatter',
        mode: 'none',
        hoverinfo: 'skip', // optional
        showlegend: false
    };

    // Set the labels for shaded regions
    const annotations = [];

    if (probLower > 0.001) {
        annotations.push({
            x: lowerZ - 0.5,
            y: Math.max(...data.y) * 0.8,
            text: `P(Z ≤ ${lowerZ.toFixed(2)}) = ${(probLower*100).toFixed(2)}%`,
            showarrow: false,
            font: { color: 'red' }
        });
    }

    if (probUpper > 0.001) {
        annotations.push({
            x: upperZ + 0.5,
            y: Math.max(...data.y) * 0.8,
            text: `P(Z ≥ ${upperZ.toFixed(2)}) = ${(probUpper*100).toFixed(2)}%`,
            showarrow: false,
            font: { color: 'red' }
        })
    }
    // Create the layout 
}