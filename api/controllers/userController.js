const UserModel = require("../models/userModel")
const SubredditModel = require("../models/subredditModel")

class UserController {
  userRepository

  constructor(userRepository) {
    this.userRepository = userRepository
  }

  // MARK: - User

  // Create a new user.
  // - username must be unique.
  create = (req, res) => {
    let user

    try { user = new UserModel(req.body) }
    catch (error) { res.send({error: true, message: error.message}); return }

    const result = this.userRepository.create(user)
    res.send(result)
  }

  // Return a list of all existing users.
  list = (req, res) => {
    const result = this.userRepository.list()

    const userListWithSubreddit = result.data.userList.map( user => {
      return {
        user: user,
        subreddit: this.userRepository.listSubredditFor(user.id)
      }
    })

    result.data.userList = userListWithSubreddit

    res.send(result)
  }

  // Returns user based on his id.
  // - userId is required.
  find = (req, res) => {
    let userId = Number(req.params.userId)

    if(!userId)  {
      res.send({error: true, message: "User id is malformed or missing in the url."})
      return
    }
    
    const result = this.userRepository.find(userId)
    res.send(result)
  }

  // Delete a user based on his id.
  delete = (req, res) => {
    let userId = Number(req.params.userId)

    if(!userId)  {
      res.send({error: true, message: "User id is malformed or missing in the url."})
      return
    }
    
    const result = this.userRepository.delete(userId)
    res.send(result)
  }

  // Update a user based on his id.
  update = (req, res) => {
    let userId = Number(req.params.userId)

    if(!userId)  {
      res.send({error: true, message: "User id is malformed or missing in the url."})
      return
    }

    let user

    try { user = new UserModel(req.body)
    } catch (error) { res.send({error: true, error: error.message}); return }
    
    const result = this.userRepository.update(user, userId)
    res.send(result)
  }

  // MARK: - Subreddit

  // Create a new subreddit.
  // A user can only have one subreddit with the same name.
  addSubreddit = (req, res) => {
    let subreddit

    let userId = Number(req.params.userId)

    if (!userId)  {
      res.send({error: true, message: "User id is malformed or missing in the url."})
      return
    }

    const result = this.userRepository.find(userId)

    if (result.error) {
      res.send(result)
      return
    }

    const subredditData = {
      userId: userId,
      name: req.body.name,
      category: req.body.category
    }

    try { subreddit = new SubredditModel(subredditData) }
    catch (error) {res.send({error: true, message: error.message}); return}

    const createResult = this.userRepository.createSubreddit(subreddit)
    res.send(createResult)
  }

  updateSubreddit = (req, res) => {
    let subredditId = Number(req.params.subredditId)
    let userId = Number(req.params.userId)

    if(!subredditId || !userId)  {
      res.send({error: true, message: "Subreddit id or User id is malformed or missing in the url."})
      return
    }

    const subredditData = {
      id: subredditId,
      userId: userId,
      name: req.body.name,
      category: req.body.category
    }

    let subreddit

    try { subreddit = new SubredditModel(subredditData)
    } catch (error) { res.send({error: true, message: error.message}); return }
    
    const result = this.userRepository.updateSubreddit(subreddit)
    res.send(result)
  }
}

module.exports = UserController;
