import TextLayout from '../layouts/TextLayout'

const PrivacyPolicy = () => {
  return (
    <TextLayout>
      <h1 className="text-4xl">Privacy Policy</h1>
      <p>This Privacy Policy describes how your personal information is collected and used when you use this web app.</p>
      <h2 className="text-2xl">What we collect</h2>
      <ul>
        <li> - Account credentials: email, username, hashed password (your password is not stored in plain text).</li>
        <li> - Game data: moves, board state, opponenets, results for every game you play.</li>
      </ul>
      <h2 className="text-2xl">Contact</h2>
      <p>simone.gasparini.2@gmail.com</p>
    </TextLayout>
  )
}

export default PrivacyPolicy
