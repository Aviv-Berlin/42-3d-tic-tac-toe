import { PropsWithChildren } from 'react'

const SubmitButton = ({children}: PropsWithChildren) => {
 return (
   <button type="submit" className="border bg-white rounded-md border-black px-4 py-3 mt-4 cursor-pointer hover:bg-mauve-200">{children}</button>
  )
}

export default SubmitButton
