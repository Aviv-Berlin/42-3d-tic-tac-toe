import { ReactNode } from 'react'

interface GameSettingButtonProps {
  selected: boolean;
  children: ReactNode;
  onClick: () => void;
}

const GameSettingButton = ({selected, children, onClick}: GameSettingButtonProps) => {
  return (
    <button 
      className={`border rounded-xl h-40 w-40 hover:bg-stone-200 cursor-pointer text-xl ${selected ? 'border-stone-800' : 'border-stone-400'}`}
      onClick={onClick}
    >{children}
    </button>
  )
}

export default GameSettingButton
