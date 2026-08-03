interface MainButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  disabled?: boolean;
  children: React.ReactNode;
}

const MainButton = ({ disabled = false, children, ...props }: MainButtonProps) => {
  return (
    <button
      className={`border bg-white rounded-md border-stone-400 px-6 py-4 hover:bg-stone-200 text-xl ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
      {...props}
    >{children}</button>
  )
}

export default MainButton
