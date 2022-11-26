import config from './config.json'
import styles from './styles.json'

const SaskiaNeumanStory = ({
  styles,
  values: {
    backgroundImage,
    text,
    color,
    alignText,
    objectFit
  } }) => {

  return (
    <div style={{ ...styles.container, justifyContent: alignText }}>
      {backgroundImage &&
        <img src={backgroundImage} style={{ ...styles.image, objectFit }} />
      }
      <div style={{ ...styles.text, color }}>
        {text.split('\n').map((line, key) =>
          <div key={key}>{line}</div>
        )}
      </div>
    </div>
  )   
}

SaskiaNeumanStory.config = config;
SaskiaNeumanStory.styles = styles;

export default SaskiaNeumanStory;
