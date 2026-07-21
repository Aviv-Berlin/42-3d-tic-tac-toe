import { PropsWithChildren } from 'react'

const SubmitButton = ({children}: PropsWithChildren) => {
 return (
   <button type="submit" className="border border-stone-400 px-4 py-2 cursor-pointer hover:bg-stone-200">{children}</button>
  )
}

export default SubmitButton
