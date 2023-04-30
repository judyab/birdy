const User = require('../models/user.model');

module.exports.signUp = async (req, res) => {
    console.log(req.body);

    try {
        const {login, email, password, lastname, firstname} = req.body
        const user = await User.create({login, email, password, lastname, firstname});
        res.status(201).json({userID: user._id});
    }
    catch(err) {
        res.status(200).send({err});
    }
}