const nodemailer = require('nodemailer');

function configmail(){
  // create reusable transporter object using the default SMTP transport
  var transporter = nodemailer.createTransport({
      service: '"Outlook365"',
      auth: {
          user: 'indicadoresacademicos@udenar.edu.co',
          pass: 'Indicadores2017'
      }
  });

  return transporter;
}

module.exports.configmail = configmail;
