import express,  { type Request, type Response } from 'express';
const app = express()

type User = {
  username: string,
  email: string,
  password: string
}

let users: User[] = [
  {
    "username": "John Doe",
    "email": "johndoe@example.com",
    "password": "10402070"
  }
]

app.use(express.json())

app.post('/v1/auth/register', (request: Request, response: Response) => {
  const body = request.body

  if (!body.username || !body.email || !body.password) {
    return response.status(400).json({
      error: 'registration data incomplete'
    })
  }

  let check = users.find(u => u.username === body.username)
	if (check) {
		return response.status(409).json({
      error: 'username already exists'
    })}

  check = users.find(u => u.email === body.email)
  if (check) {
    return response.status(409).json({
      error: 'email already registered'
    })}

  const user = {
    username: body.username,
    email: body.email,
    password: body.password,
  }

  users = users.concat(user)

  return response.status(201).json({
    username: user.username,
    email: user.email})
})

app.post('/v1/auth/login', (request: Request, response: Response) => {
  const body = request.body

  if (!body.username || !body.password) {
    return response.status(400).json({
      error: 'login data incomplete'
    })
  }

  let check = users.find(u => u.username === body.username)
  if (!check)
    check = users.find(u => u.email === body.username)
	if (!check || check.password !== body.password) {
		return response.status(401).json({
      error: 'bad credentials'
    })}

  //this should return 201
  return response.status(200).json({
    accessToken: 'token123'
  })
})

const PORT = 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
