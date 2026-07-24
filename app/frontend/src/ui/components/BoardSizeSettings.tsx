import GameSettingButton from '../components/GameSettingButton'

const BoardSizeSettings = ({size, setSize}) => {
  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-3xl font-serif italic">Board Size:</h1>
      <div className="flex flex-col sm:flex-row gap-4">
        <GameSettingButton selected={size === 3} onClick={() => setSize(3)}>
          <div className="w-full h-full relative flex justify-center items-center">
            <p className="text-xs absolute bottom-2 right-2">3x3x3</p>
          </div>
        </GameSettingButton>
        <GameSettingButton selected={size === 4} onClick={() => setSize(4)}>
          <div className="w-full h-full relative flex justify-center items-center">
            <p className="text-xs absolute bottom-2 right-2">4x4x4</p>
          </div>
        </GameSettingButton>
        <GameSettingButton selected={size === 5} onClick={() => setSize(5)}>
          <div className="w-full h-full relative flex justify-center items-center">
            <p className="text-xs absolute bottom-2 right-2">5x5x5</p>
          </div>
        </GameSettingButton>
      </div>
    </div>
  )
}

export default BoardSizeSettings
