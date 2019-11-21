const nodemailer = require('nodemailer')
const pug = require('pug')
const juice = require('juice')
const htmlToText = require('html-to-text')
const util = require('util')
const emailConfig = require('../config/email')


let transport = nodemailer.createTransport({
  host: emailConfig.host,
  port: emailConfig.port,
  auth: {
    user: emailConfig.user, // generated ethereal user
    pass: emailConfig.pass // generated ethereal password
  }
})

const createHtml = (nameFile, options = {}) => {
  const html = pug.renderFile(`${__dirname}/../views/emails/${nameFile}.pug`, options)
  return juice(html)
}


exports.runEmail = async (options) => {

  const html = createHtml(options.file, options)
  const text = htmlToText.fromString(html)

  let config = {
    from: 'UpProjects <no-reply@upprojects.com>',
    to: options.user.email, 
    subject: options.subject, 
    text,
    html
  }

  const sendEmail = util.promisify(transport.sendMail, transport)
  return sendEmail.call(transport, config)

}


