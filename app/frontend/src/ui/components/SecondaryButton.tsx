interface SecondaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const SecondaryButton = ({children, ...props}: SecondaryButtonProps) => {
  return (
    <button
      className="border bg-light-grey border-dark-grey px-2 py-1.5 hover:border-dark-orange hover:text-dark-orange cursor-pointer"
      {...props}
    >{children}</button>
  )
}

export default SecondaryButton
