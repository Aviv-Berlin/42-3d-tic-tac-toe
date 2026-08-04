import GameSettingButton from './GameSettingButton'
import BabylonImage from './BabylonImage'

interface BoardSizeSettingsProps {
  size: number;
  setSize: React.Dispatch<React.SetStateAction<number>>;
}

const BoardSizeSettings = ({size, setSize}: BoardSizeSettingsProps) => {
  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-3xl font-serif italic">Board Size:</h1>
      <div className="flex flex-col sm:flex-row gap-4">
        <GameSettingButton selected={size === 3} onClick={() => setSize(3)}>
          <div className="w-full h-full relative flex justify-center items-center">
            <BabylonImage type={"three"} />
          </div>
        </GameSettingButton>
        <GameSettingButton selected={size === 4} onClick={() => setSize(4)}>
          <div className="w-full h-full relative flex justify-center items-center">
            <BabylonImage type={"four"} />
          </div>
        </GameSettingButton>
        <GameSettingButton selected={size === 5} onClick={() => setSize(5)}>
          <div className="w-full h-full relative flex justify-center items-center">
            <BabylonImage type={"five"} />
          </div>
        </GameSettingButton>
      </div>
    </div>
  )
}

export default BoardSizeSettings
