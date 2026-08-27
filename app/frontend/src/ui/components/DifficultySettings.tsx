import GameSettingButton from './GameSettingButton'
import BabylonImage from './BabylonImage'

interface DifficultySettingsProps {
  level: number;
  setLevel: React.Dispatch<React.SetStateAction<number>>;
}

const DifficultySettings = ({level, setLevel}: DifficultySettingsProps) => {
  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-xl">Difficulty:</h1>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-1 items-center">
          <GameSettingButton selected={level === 1} onClick={() => setLevel(1)}>
            <div className="w-full h-full relative flex justify-center items-center">
              <BabylonImage type={"easy"} />
            </div>
          </GameSettingButton>
          <p className="text-xs">easy</p>
        </div>
        <div className="flex flex-col gap-1 items-center">
          <GameSettingButton selected={level === 2} onClick={() => setLevel(2)}>
            <div className="w-full h-full relative flex justify-center items-center">
              <BabylonImage type={"medium"} />
            </div>
          </GameSettingButton>
          <p className="text-xs">medium</p>
        </div>
        <div className="flex flex-col gap-1 items-center">
          <GameSettingButton selected={level === 3} onClick={() => setLevel(3)}>
            <div className="w-full h-full relative flex justify-center items-center">
              <BabylonImage type={"hard"} />
            </div>
          </GameSettingButton>
          <p className="text-xs">hard</p>
        </div>
      </div>
    </div>
  )

}

export default DifficultySettings
