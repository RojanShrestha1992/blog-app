const User = require('../models/User')
const jwt = require('jsonwebtoken')

// jwt
const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '30d'})
}

const cookieOptions = {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    path: '/'
}

// @desc Register a new user
// @route POST /api/auth/register
// @access Public

const registerUser = async (req, res)=>{
    const {name, email, password} = req.body

    if(!name || !email || !password){
        return res.status(400).json({message: "Please add all fields"})
    }

    const userExists = await User.findOne({email})

    if(userExists){
        return res.status(400).json({message: "User already exists"})
    }
    const user = await User.create({
        name,email,password
    })

    if(user){
        res.cookie("token", generateToken(user._id), cookieOptions);
        res.status(201).json({
            message: "User registered successfully",
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            token: generateToken(user._id)
        })
    }else{
        res.status(400).json({message: "Invalid user data"
        })
    }
}


const loginUser = async (req, res)=>{
    const {email, password} = req.body

    if(!email || !password){
        return res.status(400).json({message: "Please add all fields"})
    }

    const user = await User.findOne({
        email
    })

    if(user && (await user.matchPassword(password))){
        res.cookie("token", generateToken(user._id), cookieOptions);
        res.json({
            message: "Login successful",
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            token: generateToken(user._id)
        })
    }else{
        res.status(400).json({message: "Invalid credentials"})
    }
}


const logoutUser = async (req, res) => {
    res.clearCookie('token', cookieOptions)
    res.status(200).json({ message: 'Logout successful' })
}


const getMe = async (req, res)=> {
    if(!req.user) return res.status(401).json({message: "Not authorized"})
    res.json({
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        avatar: req.user.avatar
    })
}


module.exports = {
    registerUser,
    loginUser,
    getMe,
    logoutUser
}