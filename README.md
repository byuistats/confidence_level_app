# Normal Distribution Applet

This project is a simple JavaScript applet that visualizes the standard normal distribution and allows users to adjust the critical value for shading the tails of the distribution.

## Project Structure

```
normal-dist-applet
├── src
│   ├── index.html       # Main HTML document
│   ├── app.js          # JavaScript code for generating the plot
│   └── style.css       # Styles for the applet
├── package.json        # npm configuration file
└── README.md           # Project documentation
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd normal-dist-applet
   ```

2. Install the dependencies:
   ```
   npm install
   ```

## Usage

1. Open `src/index.html` in a web browser to view the applet.
2. Adjust the critical value using the input field to see how the plot updates.
3. The shaded areas represent the tails of the distribution beyond the critical value, with the confidence interval highlighted.

## Functionality

- The applet visualizes the standard normal distribution curve.
- Users can input a critical value to dynamically adjust the plot.
- The tails of the distribution are shaded to indicate areas beyond the critical value, with a confidence interval highlighted in blue.

## License

This project is licensed under the MIT License.