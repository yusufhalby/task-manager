const User = require('../models/user');
const bcrypt = require('bcrypt');

exports.createUser = async (req, res, next) => {
    const {name, email, password} = req.body;
    try {
        const hashedPass = await bcrypt.hash(password, 10);
        const user = new User({
            name,
            email,
            password: hashedPass
        });
        const savedUser = await user.save();
        res
            .status(201)
            .json({
                message: 'User created successfully.',
                userId: savedUser._id
            });
    } catch (err) {
        console.log('Error creating a user:', err);
        if (err.name === "ValidationError") {
            return res
                .status(400)
                .json({
                    error: err.message
                });
        } else {
            return res
                .status(500)
                .json({
                    error: 'Something went wrong'
                });
        };
    }
};

exports.postSignIn = async (req, res, next) => {
    const {email, password} = req.body;
    try{
        const user = await User.findOne({email});
        if (!user) {
            const error = new Error('No user is attached to this email');
            error.statusCode = 404;
            throw error;
        }
        // console.log(user);
        // console.log(await bcrypt.compare(password, user.password));
        const isSame = await bcrypt.compare(password, user.password);
        if(!isSame){
            const error = new Error('Password is uncorrect');
            error.statusCode = 401;
            throw error;
        }
        // Generate JWT token and send it back as response data with status code of success
        res.status(200).json({
            userId: user._id,
            
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};