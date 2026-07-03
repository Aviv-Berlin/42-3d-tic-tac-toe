const NavbarButton = ({children, ...props }) => {
  return (
    <button 
      className="px-4 py-2 hover:bg-stone-200 cursor-pointer flex gap-2"
      {...props}
    >{children}</button>
  )
}

export default NavbarButton
