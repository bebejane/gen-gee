import defaultConfig from './config.json'
import defaultStyles from './styles.json'
import interpolate from 'color-interpolate'

const generateColors = (gradientFrom, gradientTo, steps) => {
  try {
    const cmap = interpolate([gradientFrom, gradientTo]);
    return new Array(steps).fill(0).map((el, idx) => cmap(idx / steps))

  } catch (err) {
    return []
  }
}

const generateBackground = (image, matrix) => {

  return {
    background: `url(${image})`,
    backgroundSize: `${100 - (matrix)}% ${100 - (matrix)}%`,
    transform: `rotate(${Math.random() * matrix}deg)`,
    filter: `grayscale(${(Math.random() * matrix) / 100})`,
    transition: 'transform 0.3s ease',
    opacity: (matrix / 100)
  }

}

const GradiText = ({
  styles,
  values: {
    image,
    text,
    textAlign,
    blockAlign,
    gradientFrom,
    gradientTo,
    gradientCols,
    gradientRows,
    fontSize,
    matrix
  }
}) => {

  const rows = parseInt(gradientRows);
  const cols = parseInt(gradientCols);
  const steps = rows * cols
  const colors = generateColors(gradientFrom, gradientTo, steps);


  return (
    <div style={{ ...styles.container }}>
      <div style={{ ...styles.gradient, transform: `rotate(0deg) scale(1)` }}>
        {colors?.map((backgroundColor, i) =>
          <div key={i} style={{ backgroundColor, flex: `0 0 ${(100 / cols)}%`, minHeight: `${100 / rows}%` }}></div>
        )}
      </div>
      <div
        style={{
          ...styles.image,
          ...generateBackground(image, matrix),
          //opacity: 0.
        }}
      ></div>
      <div style={{
        ...styles.textBlock,
        alignItems: blockAlign,
        textAlign,
        fontSize: fontSize
      }}>
        {text}<br />---<br />{text.split(' ').reverse().join(' ')}
      </div>

    </div >
  )
}

GradiText.config = defaultConfig;
GradiText.styles = defaultStyles;

export default GradiText;
