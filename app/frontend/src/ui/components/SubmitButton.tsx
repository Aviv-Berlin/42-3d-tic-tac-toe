import { PropsWithChildren } from 'react'

const SubmitButton = ({children}: PropsWithChildren) => {
 return (
   <button type="submit" className="border border-dark-grey px-4 py-3 mt-4 cursor-pointer hover:border-dark-orange hover:text-dark-orange">{children}</button>
  )
}

export default SubmitButton
