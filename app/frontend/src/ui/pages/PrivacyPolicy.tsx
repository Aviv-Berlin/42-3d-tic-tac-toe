import TextLayout from '../layouts/TextLayout'

const PrivacyPolicy = () => {
  return (
    <TextLayout>
      <h1 className="text-4xl self-center">Privacy Policy</h1>
      <p>This Privacy Policy describes how your personal information is collected and used when you use this web app.</p>

      <h2 className="text-2xl mt-4">What we collect</h2>
        <p> - <span className="italic">Account credentials</span>: email, username, hashed password (your password is not stored in plain text).</p>
        <p> - <span className="italic">Activity status</span>: a timestamp of when you were last active.</p>
        <p> - <span className="italic">Game data</span>: moves, board state, opponents, results for every game you play.</p>
        <p> - <span className="italic">Friends list</span>: your connections with other users.</p>
        <p> - <span className="italic">Messages</span>: the content of your conversations with other users.</p>
      <p>We do not collect payment information, location data, or any special category data.</p>

      <h2 className="text-2xl mt-4">Why we collect this data</h2>
        <p> - <span className="italic">Account credentials</span>: used to create and authenticate your account.</p>
        <p> - <span className="italic">Activity status</span>: used to show other users when you were last online.</p>
        <p> - <span className="italic">Game data</span>: stored to power match history, statistics, and the core gameplay features of the app.</p>
        <p> - <span className="italic">Friends list</span>: supports the social features of the app.</p>
        <p> - <span className="italic">Messages</span>: stored so you and your conversation partner can access your chat history.</p>
        
      <h2 className="text-2xl mt-4">How long do we keep the data</h2>
        <p> - <span className="italic">Account credentials</span> and <span className="italic">activity status</span> are kept for as long as your account is active.</p>
        <p> - <span className="italic">Game data</span>, <span className="italic">friends list</span>, and <span className="italic">messages</span> are kept indefinitely, even after account deletion.</p>
      
      <h2 className="text-2xl mt-4">Contact</h2>
      <p>For any question, you can contact us at any of these emails:</p>
      <a className="underline underline-offset-4" href="mailto:akosloff@student.42berlin.de">akosloff@student.42berlin.de</a>
      <a className="underline underline-offset-4" href="mailto:lhagemos@student.42berlin.de">lhagemos@student.42berlin.de</a>
      <a className="underline underline-offset-4" href="mailto:sgaspari@student.42berlin.de">sgaspari@student.42berlin.de</a>
      <a className="underline underline-offset-4" href="mailto:smoon@student.42berlin.de">smoon@student.42berlin.de</a>
    </TextLayout>
  )
}

export default PrivacyPolicy
