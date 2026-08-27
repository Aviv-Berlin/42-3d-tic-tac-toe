interface MainButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  disabled?: boolean;
  children: React.ReactNode;
}

const MainButton = ({ disabled = false, children, ...props }: MainButtonProps) => {
  return (
    <button
      className={`rounded-md py-4 text-xl ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
      {...props}
    >{children}</button>
  )
}

export default MainButton
