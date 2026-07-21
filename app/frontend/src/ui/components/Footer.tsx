import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="flex justify-between items-center p-8 border-t border-stone-400 text-xs">
      <p>© 3D-tic-tac-toe {new Date().getFullYear()}</p>
      <div className="flex gap-8">
        <Link className="hover:underline underline-offset-4" to="/privacy">Privacy Policy</Link>
        <Link className="hover:underline underline-offset-4" to="/terms">Terms of Service</Link>
      </div>
    </footer>
  )
}

export default Footer
