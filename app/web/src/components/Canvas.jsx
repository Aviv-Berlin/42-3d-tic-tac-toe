const Canvas = ({size = 3}) => {
  console.log(`grid size: ${size}`); // this prints the size selected by the user through the slider

  // here goes the babylon code

  return (
    <div className="flex-1 flex">
      <canvas className="flex-1" />
    </div>
  )
}

export default Canvas
