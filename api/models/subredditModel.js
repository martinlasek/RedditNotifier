class SubredditModel {
  id
  userId
  name
  category

  constructor(subreddit) {
    this.validate(subreddit)

    this.id = subreddit.id
    this.userId = subreddit.userId
    this.name = subreddit.name
    this.category = subreddit.category
  }

  validate = (subreddit) => {
    if(!subreddit.userId) {
      throw Error("'user id' is missing.");
    }

    if(!subreddit.name) {
      throw Error("key 'name' is missing.");
    }

    if(!subreddit.category) {
      throw Error("key 'category' is missing.");
    }
  }
}

module.exports = SubredditModel;