const express = require("express");

const userController = require("./queries");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/users", userController.getAllUsers);
app.get("/users/:id", userController.getUserById);
app.post("/users", userController.createUser);
app.put("/users/:id", userController.updateUser);
app.delete("/users/:id", userController.deleteUser);

app.listen(5000, () => {
	console.log('Server listening on port 5000');
});