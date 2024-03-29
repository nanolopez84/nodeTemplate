const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Task = require('./tasks.js');

const forbiddenPasswords = ['password', '1234'];

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid');
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        validate(value) {
            if (value.includes(' ')) {
                throw new Error('Password can\'t have spaces');
            } else {
                forbiddenPasswords.forEach(password => {
                    if (value.toLowerCase().includes(password)) {
                        throw new Error('Password too weak');
                    }
                });
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
});

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
});

userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

userSchema.pre('deleteOne', async function (next) {
    const _id = this.getQuery()["_id"];
    await Task.deleteMany({ owner: _id });
    next();
});

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });

    /*
        For security reasons these messages should be the same,
        but for dev purposes they are not.
    */
    if (!user) {
        throw new Error('User not found: [' + email + ']');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Password missmatch: ');
    }

    return user;
};

userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_KEY, { expiresIn: '7 days' });
    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
};

userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;

    return userObject;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
