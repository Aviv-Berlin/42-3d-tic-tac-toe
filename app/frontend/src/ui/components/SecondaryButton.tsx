interface SecondaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const SecondaryButton = ({children, ...props}: SecondaryButtonProps) => {
  return (
    <button
      className="border bg-white rounded-md border-stone-400 px-2 py-1.5 hover:bg-stone-200 cursor-pointer"
      {...props}
    >{children}</button>
  )
}

export default SecondaryButton
