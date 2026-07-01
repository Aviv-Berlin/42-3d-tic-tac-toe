import './Canvas.css'

const Canvas = ({size}) => {
  console.log(`grid size: ${size}`); // this prints the size selected by the user through the slider

  // here goes the babylon code

  return (
    <div className="canvas-container">
      <canvas className="canvas" />
    </div>
  )
}

export default Canvas
