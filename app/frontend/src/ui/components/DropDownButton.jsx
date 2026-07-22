const DropDownButton = ({children, ...props}) => {
  return (
    <button 
      className="flex px-4 py-2 hover:bg-stone-200 cursor-pointer gap-2"
      {...props}
    >
      {children}
    </button>
  )
}

export default DropDownButton
