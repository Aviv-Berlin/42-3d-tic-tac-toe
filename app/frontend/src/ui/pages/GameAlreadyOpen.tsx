import CenteredLayout from "../layouts/CenteredLayout"

const AlreadyOpen = () => {
  return (
    <CenteredLayout>
      <h1 className="text-3xl">ERROR</h1>
      <p className="text-lg"> This game is already open in another tab.</p>
    </CenteredLayout>
  )
}

export default AlreadyOpen
