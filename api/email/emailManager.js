const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

class EmailManager {

  buildTemplate = (templateData) => {
    const style = "margin: auto; width: 100%; max-width: 350px;"

    return `
      <div style="${style}">
        Hello ${templateData.username},
        See today's top voted posts from your favorite channel
        ${templateData.subredditsWithTopPosts.map(subredditWithTopPost => this.subredditList(subredditWithTopPost)).join("<br />")}
      </div>
    `
  }
  
  subredditList = (subredditWithTopPost) => {
    const style = "border: 2px solid black; padding: 5px; margin: 5px 0 5px;"
    return `
      <div style="${style}"> <b>${subredditWithTopPost.category}:</b> <a href="${subredditWithTopPost.url}">${subredditWithTopPost.url}</a> </div>
      ${subredditWithTopPost.list.map(topPost => this.subredditElement(topPost)).join("<br />")}
    `
  }
  
  subredditElement = (topPost) => {
    const imageStyle = "width: 100%; height: auto;margin-bottom:5px;"
    const countStyle = "color:#ffffff;font-weight:900;background:orange;border-radius:30px;display:flex;padding:5px;align-items:center;justify-content:center;float:left;"
    const titleStyle = "width: calc(100% - 35px); margin-left: 35px;"
    
    return `
      <div>
        <img src="${topPost.imageUrl}" style="${imageStyle}"/> <br />
        <div>
          <div style="${countStyle}">
            <span>${topPost.ups}</span>
          </div>  
          <div style="${titleStyle}">
            <span>${topPost.title}</span>
          </div>
        </div>
      </div>
    `
  }

  async sendEmail(recipient, html) {

    const msg = {
      to: recipient,
      from: 'heylasek@gmail.com',
      subject: 'Your Top 3 Post Of All Your Subreddits',
      text: 'some text',
      html: html
    }

    await sgMail.send(msg).catch(error => {
      
      if (error.response && error.response.body) {
        console.log("❌")
        console.log("Error", error.response.body)
        console.log("❌")
      }
      
    })
  }
}

module.exports = EmailManager