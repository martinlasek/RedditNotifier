const UserRepository = require("../repository/userRepository")
const UserController = require("../controllers/userController")

module.exports = function(app, db) {
  
  const userRepository = new UserRepository(db)
  const userController = new UserController(userRepository)

  // MARK: - User

  // POST: Create a user.
  app.post('/user', userController.create)
  
  // GET: List all users.
  app.get('/user/list', userController.list)

  // GET: Return a user based on his id.
  app.get('/user/:userId', userController.find)

  // DELETE: Delete a user based on his id.
  app.delete('/user/:userId', userController.delete)

  // PATCH: Update a user based on his id.
  app.patch('/user/:userId', userController.update)

  // MARK: - Subreddit

  app.post('/user/:userId/subreddit', userController.addSubreddit)

  app.patch('/user/:userId/subreddit/:subredditId', userController.updateSubreddit)
}