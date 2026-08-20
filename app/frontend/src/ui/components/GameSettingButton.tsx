import { ReactNode } from 'react'

interface GameSettingButtonProps {
  selected: boolean;
  children: ReactNode;
  onClick: () => void;
}

const GameSettingButton = ({selected, children, onClick}: GameSettingButtonProps) => {
  return (
    <button
      className={`rounded-xl h-32 w-32 overflow-hidden cursor-pointer text-xl border ${selected ? 'border-3' : 'border'}`}
      onClick={onClick}
    >{children}
    </button>
  )
}

export default GameSettingButton
