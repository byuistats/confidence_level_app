import React from 'react';
import ReactDOM from 'react-dom';
import NormalCurve from './components/NormalCurve';
import './styles/main.css';

const App = () => {
    return (
        <div className="app">
            <h1>Normal Distribution Visualizer</h1>
            <NormalCurve />
        </div>
    );
};

ReactDOM.render(<App />, document.getElementById('root'));