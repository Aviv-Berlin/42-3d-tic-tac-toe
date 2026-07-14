import { Link } from 'react-router-dom'

const Footer = ({username}) => {
  return (
    <footer className="flex justify-between items-center p-8 border-t border-stone-400 text-xs">
      <p>© 3D-tic-tac-toe {new Date().getFullYear()}</p>
      <div className="flex gap-8">
        <Link to={`/privacy?user=${username}`}>Privacy Policy</Link>
        <Link to="/terms">Terms of Service</Link>
      </div>
    </footer>
  )
}

export default Footer
