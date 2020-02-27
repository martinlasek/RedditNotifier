const fetch = require("node-fetch")

class RedditDispatcher {
  baseUrl = "https://www.reddit.com/r/"
  query = "/top/.json?limit=3"

  fetchTopPostsOf = async (subredditName) => {
    const url = this.baseUrl + subredditName + this.query
    
    console.log("~~> fetching from: ", url)

    const result = await fetch(url)
    const redditJson = await result.json()

    const top3 = redditJson.data.children.map(child => {
      const post = child.data

      const topPost = {
        title: post.title,
        ups: Number(post.ups) < 10 ? `0${post.ups}` : post.ups
      }

      if (post.thumbnail && post.thumbnail.includes(".jpg")) {
        topPost["imageUrl"] = post.thumbnail
      } else {
        topPost["imageUrl"] = "https://www.okcballet.org/wp-content/uploads/2016/09/placeholder-image.png"
      }

      return topPost
    })

    const topPosts = {url: this.baseUrl + subredditName, list: top3}

    console.log("~~> Top Posts: ", topPosts)

    return topPosts
  }
}

module.exports = RedditDispatcher