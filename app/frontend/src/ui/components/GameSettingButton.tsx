import { ReactNode } from 'react'

interface GameSettingButtonProps {
  selected: boolean;
  children: ReactNode;
  onClick: () => void;
}

const GameSettingButton = ({selected, children, onClick}: GameSettingButtonProps) => {
  return (
    <button
      className={`h-24 w-24 border border-dark-grey overflow-hidden cursor-pointer text-xl ${selected ? 'border-dark-orange' : ''}`}
      onClick={onClick}
    >{children}
    </button>
  )
}

export default GameSettingButton
