import config from './config.json'
import styles from './styles.json'

const GradiText = ({
  styles,
  values: {
    text,
    textAlign,
    blockAlign,
    gradientFrom,
    gradientTo,
    gradientDegree,
    fontSize
  }
}) => {

  return (
    <div style={{
      ...styles.container,
      background: `linear-gradient(${gradientDegree}deg, ${gradientFrom}, ${gradientTo})`,
    }}>
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
