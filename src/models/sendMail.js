const sendMail = require('nodemailer')

module.exports = {
  sendReset: (name, email, resetcode) => {
    const connection = sendMail.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      ignoreTLS: false,
      secure: false,
      auth: {
        user: 'eseamailer@gmail.com',
        pass: 'esea123esea'
      }
    })

    const options = {
      from: 'eseamailer@gmail.com',
      to: email,
      subject: 'eSea password reset confirmation',
      html: `<p>Hello ${name}</p>
                  <p>There was recently a request to change the password on your account</p>  
                  <p>This is the code to reset your password</p>  
                  <h4>${resetcode}</h4>
                  <p>Keep this code secret</p>
                  <p>Ignore it if you dont request it, maybe you can try to change your password if you feel
                  any suspicious activity in your account</p>`
    }

    return new Promise((resolve, reject) => {
      connection.sendMail(options, (error, info) => {
        if (error) {
          reject(error)
        } else {
          resolve(info)
        }
      })
    })
  },
  verifyEmail: (name, email, emailcode) => {
    const connection = sendMail.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      ignoreTLS: false,
      secure: false,
      auth: {
        user: 'eseamailer@gmail.com',
        pass: 'esea123esea'
      }
    })

    const options = {
      from: 'eseamailer@gmail.com',
      to: email,
      subject: 'eSea email verification',
      html: `<p>Hello ${name} this is your email verification code</p>
                   <h4>${emailcode}</h4>
                   <p>Use this code to verify your email address</p>
                   <p>Subscribes to our newsfeed!</p>
                   <h4>eSea easy!</h4>`
    }

    return new Promise((resolve, reject) => {
      connection.sendMail(options, (error, info) => {
        if (error) {
          reject(error)
        } else {
          resolve(info)
        }
      })
    })
  }
}
