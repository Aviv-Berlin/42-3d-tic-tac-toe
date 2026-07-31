import GameSettingButton from './GameSettingButton'
import BabylonImage from './BabylonImage'

interface DifficultySettingsProps {
  level: number;
  setLevel: React.Dispatch<React.SetStateAction<number>>;
}

const DifficultySettings = ({level, setLevel}: DifficultySettingsProps) => {
  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-3xl font-serif italic">Difficulty:</h1>
      <div className="flex flex-col sm:flex-row gap-4">
        <GameSettingButton selected={level === 1} onClick={() => setLevel(1)}>
          <div className="w-full h-full relative flex justify-center items-center">
            <BabylonImage type={"easy"} />
            <p className="text-xs absolute bottom-2 right-2">easy</p>
          </div>
        </GameSettingButton>
        <GameSettingButton selected={level === 2} onClick={() => setLevel(2)}>
          <div className="w-full h-full relative flex justify-center items-center">
            <BabylonImage type={"medium"} />
            <p className="text-xs absolute bottom-2 right-2">medium</p>
          </div>
        </GameSettingButton>
        <GameSettingButton selected={level === 3} onClick={() => setLevel(3)}>
          <div className="w-full h-full relative flex justify-center items-center">
            <BabylonImage type={"hard"} />
            <p className="text-xs absolute bottom-2 right-2">hard</p>
          </div>
        </GameSettingButton>
      </div>
    </div>
  )

}

export default DifficultySettings
