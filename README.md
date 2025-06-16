# Normal Distribution App

This project is a JavaScript application that visualizes the standard normal distribution curve. It allows users to interactively drag a critical value and see the corresponding areas under the curve dynamically updated.

## Features

- Visual representation of the standard normal distribution.
- Interactive dragging of the critical value to adjust shaded areas.
- Shaded regions representing the tails and the confidence interval.

## Technologies Used

- React: For building the user interface.
- D3.js or Chart.js: For rendering the normal distribution curve.
- CSS: For styling the application.

## Project Structure

```
normal-dist-app
├── src
│   ├── index.js          # Entry point of the application
│   ├── components
│   │   └── NormalCurve.js # Component for rendering the normal curve
│   └── styles
│       └── main.css      # Styles for the application
├── public
│   └── index.html        # Main HTML file
├── package.json          # npm configuration file
└── README.md             # Project documentation
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd normal-dist-app
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Usage

To start the application, run:
```
npm start
```
This will launch the app in your default web browser.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.

## License

This project is licensed under the MIT License.