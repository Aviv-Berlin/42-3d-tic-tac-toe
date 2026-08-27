interface MainButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  disabled?: boolean;
  children: React.ReactNode;
}

// Button for 3D elements
const MainButton = ({ disabled = false, children, ...props }: MainButtonProps) => {
  return (
    <button
      className={`text-xl ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:text-dark-orange"}`}
      {...props}
    >{children}</button>
  )
}

export default MainButton
