import './Slider.css'

const Slider = ({size, setSize}) => {
  const handleChange = (e) => {
    setSize(e.target.value);
  }

  return (
    <div className="slider-container">
      <p>GRID SIZE</p>
      <div className="slider-values">
        <div>3</div>
        <div>4</div>
        <div>5</div>
      </div>
      <input type="range" min="3" max="5" value={size} onChange={handleChange} />
    </div>
  )
}

export default Slider;
