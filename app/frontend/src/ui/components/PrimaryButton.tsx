interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  disabled?: boolean;
  children: React.ReactNode;
}

const PrimaryButton = ({ disabled = false, children, ...props }: PrimaryButtonProps) => {
  return (
    <button
      className={`text-xl bg-light-grey border border-dark-grey px-4 py-2 ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:text-dark-orange hover:border-dark-orange"}`}
      {...props}
    >{children}</button>
  )
}

export default PrimaryButton
