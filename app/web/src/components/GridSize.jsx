import './GridSize.css'

const GridSize = ({size, setSize}) => {
  const gridSizes = [3, 4, 5];

  return (
    <div className="grid-size-container">
      <p>GRID SIZE</p>
      <div className="grid-size-values">
        {gridSizes.map((s) => (
          <button 
            key={s} 
            className={`grid-size-button ${s === size ? 'active' : ''}`}
            onClick={() => setSize(s)}
          >{s}</button>
        ))}
      </div>
    </div>
  )
}

export default GridSize;
