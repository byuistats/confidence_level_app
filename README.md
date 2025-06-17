# Distribution Confidence Applet

This interactive web app visualizes confidence intervals for both the standard normal distribution and the Student's t-distribution. Users can adjust the confidence level, critical value, and (for the t-distribution) degrees of freedom, and see the corresponding shaded areas and probabilities.

## Features

- **Tabbed interface:** Switch between the Normal and Student's t-distributions.
- **Normal Distribution Tab:**
  - Adjust confidence level (%).
  - Adjust critical value (z) with a slider.
  - See shaded confidence region and tails.
  - Labels for confidence percentage, tail areas, and critical values.
- **Student's t-Distribution Tab:**
  - Adjust confidence level (%).
  - Adjust degrees of freedom (1–500).
  - Adjust critical value (t) with a slider.
  - See shaded confidence region and tails.
  - Labels for confidence percentage, area under the curve, tail areas, and critical values (labeled as `-t = ...` and `t = ...`).

## Usage

1. **Use the GitHub link:  https://byuistats.github.io/confidence_level_app/**
2. **Clone or download this repository.**
3. **Open `index.html` in your web browser.**
   - No server or build step is required.

## Dependencies

- [Chart.js](https://www.chartjs.org/) (via CDN)
- [jStat](https://github.com/jstat/jstat) (via CDN) for accurate t-distribution calculations

## File Structure

```
index.html
script.js
style.css
README.md
```

## Customization

- You can adjust the axis ranges, colors, and label positions in `script.js` as needed.
- The app is designed for teaching and demonstration purposes.

## License

This project is licensed under the MIT License.