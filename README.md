## Setup
#### 1. Create a `.env` file at the root of the project:
```
RedditNotifier/
├── api/
├── node_modules/
├── .gitignore
├── database.js
├── package-lock.json
├── package.json
├── README.md
├── server.ks
└── .env 👈🏻
```

#### 2. Add the SendGrid API Key to it:
`.env`
```
SENDGRID_API_KEY=your-api-key-without-single-or-double-quotes
```

#### 3. Install + Run the project:

```
npm install
```
```
npm run dev
```

#### 4. You should be up and running 🥳
```
RedditNotifier | status: up | port: 8000
```

---

## Email Newsletter
A newsletter is only sent when a user has at least one subreddit **and** if the `isNewsletterEnabled` is set to true.

Inside `server.js` you will find the scheduler that sends out an email every day at 8am for each existing user.

You can change the argument for the scheduler from:
```javascript
...
const job = schedule.scheduleJob(rule, function() {
  ...
}
...
```

to the following:
```javascript
...
const job = schedule.scheduleJob('*/30 * * * * *', function() {
  ...
}
```

in order to trigger an email every 30 seconds.

---

## API Endpoints

---

### **User**

---

`CREATE` <br />
**Method:** POST <br />
**Endpoint:** `localhost:8000/user` <br />
**Data:**
```
{
  "username": "Martin Lasek",
  "email": "heylasek@gmail.com",
  "isNewsletterEnabled": true
}
```

---

`LIST` <br />
**Method:** GET <br />
**Endpoint:** `localhost:8000/user/list` <br />
**Data:** not needed.

---

`FIND` <br />
**Method:** GET <br />
**Endpoint:** `localhost:8000/user/1` <br />
**Data:** User ID in the url

---

`DELETE` <br />
**Method:** DELETE <br />
**Endpoint:** `localhost:8000/user/1` <br />
**Data:** User ID in the url

---

`UPDATE` <br />
**Method:** PATCH <br />
**Endpoint:** `localhost:8000/user/1` <br />
**Data:** User ID in the url
```
{
  "username": "Luke Skywalker",
  "email": "heylasek@gmail.com",
  "isNewsletterEnabled": false
}
```

---

### **Subreddit**

---

`CREATE` <br />
**Method:** POST <br />
**Endpoint:** `localhost:8000/user/1/subreddit` <br />
**Data:** User ID in the url
```
{
  "name": "zelda",
  "category": "game"
}
```

---

`UPDATE` <br />
**Method:** PATCH <br />
**Endpoint:** `localhost:8000/user/1/subreddit/1` <br />
**Data:** User ID in the url. Subreddit ID in the url.
```
{
  "name": "batman",
  "category": "dc-universe"
}
```

---