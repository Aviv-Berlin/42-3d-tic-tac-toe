import { useNavigate } from 'react-router-dom'

const DropDownButton = ({path, children}) => {
  const navigate = useNavigate();

  return (
    <button className="w-full px-4 py-2 hover:bg-stone-200 cursor-pointer" onClick={() => navigate(path)}>
      {children}
    </button>
  )
}

export default DropDownButton
