const MainButton = ({children, ...props}) => {
  return (
    <button 
      className="border border-stone-400 px-8 py-4 hover:bg-stone-200 cursor-pointer text-xl"
      {...props}
    >{children}</button>
  )
}

export default MainButton
