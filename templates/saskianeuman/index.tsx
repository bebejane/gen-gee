import config from './config.json'
import styles from './styles.json'

const SaskiaNeuman = ({
  styles,
  values: {
    backgroundImage,
    color,
    artist,
    titleEnglish,
    titleSwedish,
    startDate,
    endDate,
    alignText
  } }) => {

  return (
    <div style={{ ...styles.container }}>
      {backgroundImage &&
        <img src={backgroundImage} style={{ ...styles.image }} />
      }
      <div style={{
        ...styles.text,
        color,
        alignItems: alignText
      }}>
        <div style={{ ...styles.flex }}>
          {artist}
        </div>
        <div style={{ ...styles.flex }}>
          {titleSwedish}
        </div>
        <div style={{ ...styles.flex, ...styles.italic }}>
          {titleEnglish ? `— ${titleEnglish}` : ''}
        </div>
        {(startDate && endDate) &&
          <div style={{ ...styles.flex }}>{startDate}—{endDate}</div>
        }
      </div>
    </div >
  )
}

SaskiaNeuman.config = config;
SaskiaNeuman.styles = styles;

export default SaskiaNeuman;
