class UserModel {
  username
  email
  isNewsletterEnabled

  constructor(user) {
    this.validate(user)

    this.username = user.username
    this.email = user.email
    this.isNewsletterEnabled = user.isNewsletterEnabled
  }

  validate = (user) => {

    if (!user.username) {
      throw Error("key 'username' is missing.")
    }

    if (!user.email) {
      throw Error("key 'email' is missing.")
    }

    if (user.isNewsletterEnabled === undefined) {
      throw Error("key 'isNewsletterEnabled' is missing.")
    }
  }
}

module.exports = UserModel;