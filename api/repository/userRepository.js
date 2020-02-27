class UserRepository {
  database

  constructor(db) {
    this.database = db
  }

  // MARK: - User

  // Create a new user.
  // - Only allow unique usernames.
  create = (user) => {
    const dbUser = this.database.user.find((dbUser) => { return dbUser.username === user.username })

    if (dbUser) {
      const message = `User with username '${user.username}' already exists.`
      return {error: true, message: message}
    }

    // For each new user assign a unique (up-counting) id.
    if (this.database.user.length === 0) {
      user.id = 1
    } else {
      const userWithHighestId = this.database.user.reduce((userOne, userTwo) => {
        return userOne.id > userTwo.id ? userOne : userTwo
      })

      user.id = (userWithHighestId.id + 1)
    }

    this.database.user.push(user)
    return {error: false, data: {user: user}}
  }

  // List all users.
  list = () => {
    return {error: false, data: {userList: this.database.user}}
  }

  // Find a user by its id.
  find = (userId) => {
    const user = this.database.user.find((user) => { return user.id === userId })

    if (!user) {
      return {error: true, message: `couldn't find user with id: ${userId}`}
    }
    
    return {error: false, data: {user: user}}
  }

  // Delete a user by its id.
  delete = (userId) => {
    const userIndex = this.database.user.map(user => user.id).indexOf(userId)

    if (userIndex === -1) {
      return {error: true, message: `couldn't find user with id: ${userId}`}  
    }

    // Remove 1 object starting at `userIndex`.
    this.database.user.splice(userIndex, 1)    
    return {error: false, message: `Successfully deleted user with id: ${userId}`}
  }

  update = (user, userId) => {
    const dbUser = this.database.user.find((user) => { return user.id === userId })

    if (!dbUser) {
      return {error: true, message: `couldn't find user with id: ${userId}`}
    }

    dbUser.username = user.username
    dbUser.email = user.email
    dbUser.isNewsletterEnabled = user.isNewsletterEnabled

    return {error: false, data: {user: dbUser}}
  }

  // MARK: - Subreddit

  // Add a subreddit.
  // - User for provided userId must exist.
  createSubreddit = (subreddit) => {

    // Make sure user for provided userId exists.
    const result = this.find(subreddit.userId)
    if(result.error) {
      return result
    }

    // Make sure subreddit is unique for that specific usser.
    const dbSubreddit = this.database.subreddit.find((dbSubreddit) => {
      return dbSubreddit.name === subreddit.name && dbSubreddit.userId === subreddit.userId
    })
    if (dbSubreddit) {
      const message = `Subreddit with name '${subreddit.name}' already exists for user with id: ${subreddit.userId}.`
      return {error: true, message: message}
    }

    // For each new subreddit assign a unique (up-counting) id.
    if (this.database.subreddit.length === 0) {
      subreddit.id = 1
    } else {
      const subredditWithHighestId = this.database.subreddit.reduce((subredditOne, subredditTwo) => {
        return subredditOne.id > subredditTwo.id ? subredditOne : subredditTwo
      })

      subreddit.id = (subredditWithHighestId.id + 1)
    }

    this.database.subreddit.push(subreddit)
    return {error: false, data: {subreddit: subreddit}}
  }

  listSubredditFor = (userId) => {
    return this.database.subreddit.filter(subreddit => { return subreddit.userId === userId })
  }

  updateSubreddit = (subreddit) => {
    const dbSubreddit = this.database.subreddit.find((dbSubreddit) => { return dbSubreddit.id === subreddit.id })

    if (!dbSubreddit) {
      return {error: true, message: `couldn't find subreddit with id: ${subreddit.id}`}
    }

    dbSubreddit.name = subreddit.name
    dbSubreddit.category = subreddit.category

    return {error: false, data: {subreddit: dbSubreddit}}
  }
}

module.exports = UserRepository;