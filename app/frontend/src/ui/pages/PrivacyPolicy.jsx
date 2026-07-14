import TextLayout from '../layouts/TextLayout'

const PrivacyPolicy = () => {
  return (
    <TextLayout>
      <h1 className="text-4xl w-2/3">Privacy Policy</h1>
      <p>This Privacy Policy describes how your personal information is collected and used when you use this web app.</p>
      <h2 className="text-2xl">What we collect</h2>
        <p> - <span className="italic">Account credentials</span>: email, username, hashed password (your password is not stored in plain text).</p>
        <p> - <span className="italic">Activity status</span>: a timestamp of when you were last active.</p>
        <p> - <span className="italic">Game data</span>: moves, board state, opponents, results for every game you play.</p>
        <p> - <span className="italic">Friends list</span>: your connections with other users.</p>
        <p> - <span className="italic">Messages</span>: the content of your conversations with other users.</p>
      <p>We do not collect payment information, location data, or any special category data.</p>
      <h2 className="text-2xl">Why we collect this data</h2>
        <p> - Account credentials are used to create and authenticate your account.</p>
        <p> - Activity status is used to show other users when you were last online.</p>
        <p> - Game data is stored to power match history, statistics, and the core gameplay features of the app.</p>
        <p> - Friends list data supports the social features of the app.</p>
        <p> - Messages are stored so you and your conversation partner can access your chat history.</p>
      <h2 className="text-2xl">Contact</h2>
      <p>For any question, you can contact us at any of these emails:</p>
      <a className="underline underline-offset-4" href="mailto:akosloff@student.42berlin.de">akosloff@student.42berlin.de</a>
      <a className="underline underline-offset-4" href="mailto:lhagemos@student.42berlin.de">lhagemos@student.42berlin.de</a>
      <a className="underline underline-offset-4" href="mailto:sgaspari@student.42berlin.de">sgaspari@student.42berlin.de</a>
      <a className="underline underline-offset-4" href="mailto:smoon@student.42.berlin.de">smoon@student.42berlin.de</a>
    </TextLayout>
  )
}

export default PrivacyPolicy
