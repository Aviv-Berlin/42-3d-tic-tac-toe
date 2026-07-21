import TextLayout from '../layouts/TextLayout'

const TermsOfService = () => {
  return (
    <TextLayout>
      <h1 className="text-4xl self-center">Terms of Service</h1>
      <p>These Terms of Service govern your use of this web app. By creating an account or using the app, you agree to these Terms.</p>

      <h2 className="text-2xl mt-4">Accounts</h2>
        <p> - You must provide a valid email and username to register, and are responsible for keeping your login credentials secure.</p>
        <p> - Authentication is handled via JWT (JSON Web Tokens). You agree not to tamper with, forge, or misuse authentication tokens, including your own.</p>
        <p> - You are responsible for all activity that occurs under your account.</p>

      <h2 className="text-2xl mt-4">Acceptable use</h2>
        <p> - Do not use the app for any unlawful purpose.</p>
        <p> - Do not attempt to hack, disrupt, or reverse-engineer the app's authentication, servers, or gameplay logic.</p>
        <p> - Do not use bots, scripts, or automated tools to play games on your behalf.</p>
        <p> - Do not harass, abuse, or impersonate other users, including through the messaging feature.</p>
        <p> - Do not attempt to access another user's account or data without authorization.</p>

      <h2 className="text-2xl mt-4">Social features</h2>
        <p> - The app lets you add friends and exchange messages with other users. Message content is visible to your conversation partner and may be retained as part of their account history even if you delete your own account.</p>
        <p> - Your username, activity status, and game results may be visible to other users, including your friends.</p>

      <h2 className="text-2xl mt-4">Your content and data</h2>
        <p> - Game data, friends list, and message content are collected and retained as described in our Privacy Policy.</p>
        <p> - You retain no ownership claim over gameplay statistics or match history generated through your use of the app; we may retain this data, including in anonymized form, as described in our Privacy Policy.</p>

      <h2 className="text-2xl mt-4">Contact</h2>
      <p>For any question, you can contact us at any of these emails:</p>
      <a className="underline underline-offset-4" href="mailto:akosloff@student.42berlin.de">akosloff@student.42berlin.de</a>
      <a className="underline underline-offset-4" href="mailto:lhagemos@student.42berlin.de">lhagemos@student.42berlin.de</a>
      <a className="underline underline-offset-4" href="mailto:sgaspari@student.42berlin.de">sgaspari@student.42berlin.de</a>
      <a className="underline underline-offset-4" href="mailto:smoon@student.42berlin.de">smoon@student.42berlin.de</a>
    </TextLayout>
  )
}

export default TermsOfService
