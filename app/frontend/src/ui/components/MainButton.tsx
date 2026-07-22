interface MainButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const MainButton = ({children, ...props}: MainButtonProps) => {
  return (
    <button 
      className="border border-stone-400 px-6 py-2 hover:bg-stone-200 cursor-pointer text-xl"
      {...props}
    >{children}</button>
  )
}

export default MainButton
