import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="flex flex-col sm:flex-row justify-between items-center p-8 border-t text-xs gap-4">
      <p>© 3D-tic-tac-toe {new Date().getFullYear()}</p>
      <div className="flex flex-col justify-between items-center sm:flex-row gap-4 sm:gap-8">
        <Link className="hover:text-dark-orange" to="/privacy">Privacy Policy</Link>
        <Link className="hover:text-dark-orange" to="/terms">Terms of Service</Link>
      </div>
    </footer>
  )
}

export default Footer
