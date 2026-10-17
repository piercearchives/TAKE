import volumeOffIcon from '../../assets/images/icons/volume-off.svg'

function SiteAudioToggle() {
  return (
    <button
      type="button"
      className="site-audio-toggle"
      aria-label="Áudio do site silenciado"
      disabled
    >
      <img src={volumeOffIcon} alt="" className="site-audio-toggle__icon" />
    </button>
  )
}

export default SiteAudioToggle
