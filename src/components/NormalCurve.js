import React, { useState } from 'react';
import * as d3 from 'd3';

const NormalCurve = () => {
    const [critValue, setCritValue] = useState(1.96);
    const width = 800;
    const height = 400;
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };

    const x = d3.range(-4, 4, 0.01);
    const y = x.map(d => d3.scaleLinear().domain([-4, 4]).range([0, 1])(d3.randomNormal(0, 1)(d)));

    const handleDrag = (event) => {
        const newCritValue = Math.max(-4, Math.min(4, event.x));
        setCritValue(newCritValue);
    };

    return (
        <svg width={width} height={height}>
            <g transform={`translate(${margin.left}, ${margin.top})`}>
                <path
                    d={d3.line()(x.map((d, i) => [d3.scaleLinear().domain([-4, 4]).range([0, width - margin.left - margin.right])(d), height - margin.bottom - y[i] * (height - margin.top - margin.bottom)]))}
                    fill="none"
                    stroke="black"
                    strokeWidth={1}
                />
                <g>
                    <rect
                        x={0}
                        y={0}
                        width={d3.scaleLinear().domain([-4, 4]).range([0, width - margin.left - margin.right])(critValue) - margin.left}
                        height={height - margin.top - margin.bottom}
                        fill="blue"
                        opacity={0.3}
                    />
                    <rect
                        x={d3.scaleLinear().domain([-4, 4]).range([0, width - margin.left - margin.right])(critValue)}
                        y={0}
                        width={width - margin.left - margin.right - d3.scaleLinear().domain([-4, 4]).range([0, width - margin.left - margin.right])(critValue)}
                        height={height - margin.top - margin.bottom}
                        fill="red"
                        opacity={0.3}
                    />
                </g>
                <line x1={d3.scaleLinear().domain([-4, 4]).range([0, width - margin.left - margin.right])(critValue)} y1={0} y2={height - margin.bottom} stroke="blue" strokeDasharray="5,5" />
                <text x={d3.scaleLinear().domain([-4, 4]).range([0, width - margin.left - margin.right])(critValue)} y={10} fill="black">{critValue.toFixed(2)}</text>
            </g>
            <circle
                cx={d3.scaleLinear().domain([-4, 4]).range([0, width - margin.left - margin.right])(critValue)}
                cy={height / 2}
                r={10}
                fill="black"
                draggable
                onDrag={handleDrag}
            />
        </svg>
    );
};

export default NormalCurve;