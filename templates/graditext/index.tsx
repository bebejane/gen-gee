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
const GradiText = ({
  styles,
  values: {
    text,
    textAlign,
    blockAlign,
    gradientFrom,
    gradientTo,
    gradientCols,
    gradientRows,
    fontSize
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
      <div style={{
        ...styles.textBlock,
        alignItems: blockAlign,
        textAlign,
        fontSize: fontSize
      }}>
        {text}
      </div>
    </div >
  )
}

GradiText.config = defaultConfig;
GradiText.styles = defaultStyles;

export default GradiText;
