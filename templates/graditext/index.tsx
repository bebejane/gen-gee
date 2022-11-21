import config from './config.json'
import styles from './styles.json'
import interpolate from 'color-interpolate'

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
  },
  config: {
    width,
    height
  }
}) => {

  const rows = parseInt(gradientCols);
  const cols = parseInt(gradientRows);
  const steps = cols * rows
  const cmap = interpolate([gradientFrom, gradientTo], steps);
  const colors = new Array(steps).fill(0).map((el, idx) => cmap(idx / steps))

  return (
    <div style={{
      ...styles.container,
    }}>
      <div style={{ ...styles.gradient, transform: `rotate(0deg) scale(1)` }}>
        {colors.map((backgroundColor, i) =>
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

GradiText.config = config;
GradiText.styles = styles;

export default GradiText;
