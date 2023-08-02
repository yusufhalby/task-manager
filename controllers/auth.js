const User = require('../models/user');
const bcrypt = require('bcrypt');
const {
    validationResult
} = require('express-validator');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');



exports.createUser = async (req, res, next) => {
    const {
        name,
        email,
        password
    } = req.body;
    const errors = validationResult(req);
    // console.log(errors);
    try {
        if (!errors.isEmpty()) {
            const error = new Error('Validation failed.');
            error.statusCode = 422;
            error.data = errors.array();
            throw error;
        }
        const hashedPass = await bcrypt.hash(password, 10);
        const verKey = crypto.randomBytes(32).toString('base64');
        const user = new User({
            name,
            email,
            password: hashedPass,
            verKey
        });
        const savedUser = await user.save();
        sendVerMail(savedUser);
        res
            .status(201)
            .json({
                message: 'User created successfully. Please check email to verify your email.',
                userId: savedUser._id
            });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.postSignIn = async (req, res, next) => {
    const {
        email,
        password
    } = req.body;
    try {
        const user = await User.findOne({
            email
        });
        if (!user) {
            const error = new Error('No user is attached to this email');
            error.statusCode = 404;
            throw error;
        }
        // console.log(user);
        // console.log(await bcrypt.compare(password, user.password));
        const isSame = await bcrypt.compare(password, user.password);
        if (!isSame) {
            const error = new Error('Password is uncorrect');
            error.statusCode = 401;
            throw error;
        }
        if (!user.isVerified) {
            const error = new Error('Please verify your email');
            error.statusCode = 402;
            throw error;
        }
        // Generate JWT token and send it back as response data with status code of success

        const token = jwt.sign({
                userId: user._id,
            },
            process.env.JWT_SECRET, {
                expiresIn: '1h'
            }
        );
        res.status(200).json({
            userId: user._id,
            token
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.getVerify = async (req, res, next) => {
    const token = req.params.token;
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        if (!decodedToken) {
            const error = new Error('Email has not been verified.')
            error.statusCode = 401;
            throw error;
        }
        const {
            id,
            verKey
        } = decodedToken;
        const user = await User.findById(id);
        if (!user || verKey !== user.verKey) {
            let error
            user.isVerified ? error = new Error('Email is already verified.') :
                error = new Error('Email has not been verified.')
            error.statusCode = 401;
            throw error;
        }
        user.verKey = "";
        user.isVerified = true;
        await user.save();
        res.status(200).json({
            message: 'Email address has been verified successfully.'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.getResend = async (req, res, next) => {
    const id = req.params.id;
    try {
        const user = await User.findById(id);
        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }
        if (user.isVerified) {
            const error = new Error('Email is already verified.');
            error.statusCode = 400;
            throw error;
        }
        const verKey = crypto.randomBytes(32).toString('base64');
        user.verKey = verKey;
        await user.save();
        sendVerMail(user);
        res
            .status(201)
            .json({
                message: 'Mail has been sent. Please check email to verify your email.'
            });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};
// mail handelers


const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

transporter.verify(function (error, success) {
    if (error) {
        console.log(error);
    } else {
        console.log("Server is ready to take our messages");
    }
});

const sendVerMail = (recipient) => {
    const token = jwt.sign({
            id: recipient.id,
            verKey: recipient.verKey
        },
        process.env.JWT_SECRET, {
            expiresIn: '24h'
        }
    );
    const mailDetails = {
        from: process.env.EMAIL_USER,
        to: recipient.email,
        subject: 'verification mail',
        html: `
        <!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Verification</title>
  <style>
    /* Add your custom styling here */
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      margin: 0;
      padding: 0;
    }

    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      border: 1px solid #ccc;
      border-radius: 10px;
    }

    .logo {
      text-align: center;
      margin-bottom: 20px;
    }

    .logo img {
      max-width: 150px;
    }

    .message {
      text-align: center;
      margin-bottom: 20px;
    }

    .button {
      display: inline-block;
      background-color: #007bff;
      color: #ffffff;
      text-decoration: none;
      padding: 10px 20px;
      border-radius: 5px;
    }

    .footer {
      text-align: center;
      margin-top: 20px;
    }
  </style>
</head>

<body>
  <div class="container">
    <div class="logo">
      <img src="https://cdn.vectorstock.com/i/preview-1x/73/92/simple-modern-eagle-color-logo-design-vector-20997392.jpg" alt="My Logo">
    </div>
    <div class="message">
      <p>Dear ${recipient.name},</p>
      <p>Thank you for signing up! To complete your registration, please click the button below to verify your email address.</p>
    </div>
    <div class="button">
      <a href="${process.env.API}/verify/${token}">Verify Email</a>
    </div>
    <div class="footer">
      <p>If you did not sign up for this account, please ignore this email.</p>
    </div>
  </div>
</body>

</html>
        `
    };

    transporter.sendMail(mailDetails, function (err, data) {
        if (err) {
            console.log('Error Occurs');
        } else {
            console.log('Email sent successfully');
        }
    });
}