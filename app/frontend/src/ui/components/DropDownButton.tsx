import { ReactNode, ButtonHTMLAttributes } from 'react';

interface DropDownButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

const DropDownButton = ({children, ...props}: DropDownButtonProps) => {
  return (
    <button
      className="flex px-4 py-2 hover:text-dark-orange cursor-pointer gap-2"
      {...props}
    >
      {children}
    </button>
  )
}

export default DropDownButton
