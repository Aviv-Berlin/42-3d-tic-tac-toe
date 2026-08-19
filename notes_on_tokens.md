
# Notes on Tokens
What is going on here, what's working and what isn't

## Generating Token

Following Module 4 section on Token Authentication from
[Full Stack Open](https://fullstackopen.com/en/part4/token_authentication)

- When a user has successfully logged in (name & password are correct),
	we generate a token via JWT (JSON Web Token) using the user's name and id
- The token is added to local storage on the client side

## Authenticating Token
- This is done via "middleware" -- On the server side, requests to /v1/game are routed to checkToken before being routed to gameRoutes.

```
app.use("/v1/game", checkToken, gameRoutes);
```

Following Module 3 section on middleware from
[Full Stack Open](https://fullstackopen.com/en/part3/node_js_and_express#middleware)

## Sending the Token

Between generating / storing a token on the client side... and verifying that token on the server side... The missing step is actually sending the token from the client to the server.

This is where we are currently running into issues.

- On the server side, the example getTokenFrom function that we're trying from Full Stack Open expects that the token is part of the HTTP "authorization" and starts with "Bearer."

We can rig up Axios (which we're using to make all HTTP requests), to include an Authorization header bearing the token on its requests.
	- There is a way to do this granularly using Axios "instances," but to begin with, I wanted to try including the header with ALL requests:

	```
	axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
	```
	https://axios.rest/pages/advanced/create-an-instance


[Stack Overflow](https://stackoverflow.com/questions/28176933/http-authorization-header-in-eventsource-server-sent-events)

- This appears to be working -- If you turn off the middleware for a moment, you can see the the token being sent in the post request to lobby/create (when creating a game). But the reason you have to turn off middleware to see this / to get this far is ....

** The first request we send to access the lobby is not via Axios, it's via SSE ** See SSE endpoint function 'lobby()'. It uses:

```
	sendEvent(response, 'lobby-update', {
		type: "initial",
		matches: Array.from(lobbyMatches.values())
	})
```

Ok so how can we send the Authorization header with SSE, in addition to Axios?

As far as I can see, there is no easy or elegant way to do this.
[People on Stack overflow, 10 years ago, with the same issue](https://stackoverflow.com/questions/28176933/http-authorization-header-in-eventsource-server-sent-events)

Suggested alternatives are:
- cookies (good idea?)
- putting the token in a query string (bad idea -- not secure)
- a convoluted-looking method of generating and using a second temporary-token
- using an external EventSource client (good idea?)
	- https://github.com/EventSource/eventsource
	- https://github.com/mpetazzoni/sse.js


### Trying Cookies:

Reference: https://stackoverflow.com/questions/16209145/how-can-i-set-cookie-in-node-js-using-express-framework
https://stackoverflow.com/questions/38558150/cant-delete-cookie-in-express

---

TODO
- secret key should live in secrets, not ENV

// TODO: the secret key should probably live in secrets, not ENV
// saving this for later while still working on the tokens, for the sake of incremental changes
//const secretFilePath = path.join(import.meta.dirname, '../../../secrets/key')
// const secret = await readFile(secretFilePath, 'utf8');

- when tokens are working, many if not all requests should be refactored to use token instead of username. Username can be spoofed and should not be trusted. The secure way is to read username from token.
- frontend is not completely handling errors -- When we try to access lobby and get a 401 from the server (because token isn't being sent right now), we still see a page where we can click through the steps of creating a game. (However, the game isn't actually created -- Another user doesn't see it)