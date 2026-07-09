import TextLayout from '../layouts/TextLayout'
import {useSearchParams} from 'react-router-dom'

const PrivacyPolicy = () => {
  const [searchParams] = useSearchParams();

  const username = searchParams.get('user') || "";

  return (
    <TextLayout username={username}>
      <h1>Privacy Policy</h1>
      <p>This Privacy Policy describes how your personal information is collected and used when you use this web app.</p>
    </TextLayout>
  )
}

export default PrivacyPolicy
