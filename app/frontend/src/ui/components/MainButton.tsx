interface MainButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  disabled?: boolean;
  children: React.ReactNode;
}

const MainButton = ({ disabled = false, children, ...props }: MainButtonProps) => {
  return (
    <button
      className={`border bg-white rounded-md border-black px-6 py-4 text-xl ${disabled ? "opacity-40 cursor-not-allowed hover:bg-white" : "cursor-pointer hover:bg-mauve-200"}`}
      {...props}
    >{children}</button>
  )
}

export default MainButton
