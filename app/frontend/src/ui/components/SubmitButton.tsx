import { PropsWithChildren } from 'react'

const SubmitButton = ({children}: PropsWithChildren) => {
 return (
   <button type="submit" className="border rounded-4xl border-stone-400 px-4 py-3 mt-4 cursor-pointer hover:bg-stone-200">{children}</button>
  )
}

export default SubmitButton
