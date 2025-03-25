import nodemailer from 'nodemailer';
import ApiError from '../errors/ApiError';
import { StatusCodes } from 'http-status-codes';
import config from '../config';

export async function sendEmail(email: string, subject: string, text: string) {
  try {
    const transporter = nodemailer.createTransport({
      host: config.email.host,
      port: Number(config.email.port),
      secure: false,
      auth: {
        user: config.email.user,
        pass: config.email.pass,
      },
    });

    const info = await transporter.sendMail({
      from: `"FARBABYZ-DRIP" ${config.email.from}`,
      to: email,
      subject: subject,
      html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Premium Email Design</title>
          <style>
              body {
                  font-family: 'Arial', sans-serif;
                  background-color: #f4f4f4;
                  margin: 0;
                  padding: 0;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  min-height: 100vh;
              }
              .container {
                  background-color: #fff;
                  border-radius: 10px;
                  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
                  width: 80%;
                  max-width: 600px;
                  overflow: hidden;
              }
              .header {
                  background-color: #3498db;
                  color: #fff;
                  text-align: center;
                  padding: 2rem;
              }
              .header h1 {
                  margin: 0;
                  font-size: 2.5rem;
              }
              .content {
                  padding: 2rem;
                  color: #555;
                  line-height: 1.6;
              }
              .content p {
                  margin-bottom: 1.5rem;
              }
              .button {
                  display: inline-block;
                  padding: 1rem 2rem;
                  background-color: #e74c3c;
                  color: #fff;
                  text-decoration: none;
                  border-radius: 5px;
                  font-weight: bold;
                  transition: background-color 0.3s ease;
              }
              .button:hover {
                  background-color: #c0392b;
              }
              .footer {
                  background-color: #2c3e50;
                  color: #fff;
                  text-align: center;
                  padding: 1rem;
                  font-size: 0.8rem;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h1>${subject}</h1>
              </div>
              <div class="content">
                  <p>${text}</p>
                  <a href="#" class="button">Explore More</a>
              </div>
              <div class="footer">
                  &copy; ${new Date().getFullYear()} FARBABYZ-DRIP. All rights reserved.
              </div>
          </div>
      </body>
      </html>
      `,
    });

    return info;
  } catch (error) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Error sending email'
    );
  }
}
