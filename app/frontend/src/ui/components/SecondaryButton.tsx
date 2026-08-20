interface SecondaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const SecondaryButton = ({children, ...props}: SecondaryButtonProps) => {
  return (
    <button
      className="border bg-white rounded-md border-black px-2 py-1.5 hover:bg-mauve-200 cursor-pointer"
      {...props}
    >{children}</button>
  )
}

export default SecondaryButton
