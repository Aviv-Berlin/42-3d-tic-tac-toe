import { ReactNode } from 'react'

interface BoardSizeButtonProps {
  selected: boolean;
  children: ReactNode;
  onClick: () => void;
}

const BoardSizeButton = ({selected, children, onClick}: BoardSizeButtonProps) => {
  return (
    <button 
      className={`border h-40 w-40 hover:bg-stone-200 cursor-pointer text-xl ${selected ? 'border-stone-800' : 'border-stone-400'}`}
      onClick={onClick}
    >{children}
    </button>
  )
}

export default BoardSizeButton
