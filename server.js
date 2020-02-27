const dotenv = require('dotenv');
dotenv.config()


const express = require('express')
const bodyParser = require('body-parser')
const database = require('./database')
const schedule = require('node-schedule')

const app = express();

const port = 8000

app.use(bodyParser.json());

require('./api/routes')(app, database);

app.listen(port, () => {
    console.log(`RedditNotifier | status: up | port: ${port}`)
});

const UserRepository = require("./api/repository/userRepository")
const RedditDispatcher = require("./api/dispatcher/redditDispatcher")
const EmailManager = require("./api/email/emailManager")

// Create a rule for a job to run at 8am.
const rule = new schedule.RecurrenceRule()
rule.hour = 8

const job = schedule.scheduleJob(rule, function() {
    const repository = new UserRepository(database)
    const redditDispatcher = new RedditDispatcher()
    const emailManager = new EmailManager()
    const result = repository.list()


    result.data.userList.forEach(async (user) => {

        // Skip in case the user don't want
        // to receive an email.
        if (!user.isNewsletterEnabled) { return }

        const favoriteSubreddits = repository.listSubredditFor(user.id)

        // Skip if no subreddits exists for that user.
        if (favoriteSubreddits.length === 0) { return }

        var subredditsWithTopPosts = []

        const start = async () => {
            await asyncForEach(favoriteSubreddits, async subreddit => {
                const topPosts = await redditDispatcher.fetchTopPostsOf(subreddit.name)
                topPosts.category = subreddit.category

                subredditsWithTopPosts.push(topPosts)
            })
        }

        await start()

        console.log("subredditsWithTopPosts", subredditsWithTopPosts)

        const templateData = {
            username: user.username,
            subredditsWithTopPosts: subredditsWithTopPosts
        }

        const html = emailManager.buildTemplate(templateData)
        await emailManager.sendEmail(user.email, html)
        console.log("Email sent!")
    })
})

// Async ForEach to help fetch each top posts
// while still using a ForeEach-Loop.
async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}