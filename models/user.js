const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    emailId: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
});


// Saves the user's password hashed (plain text password storage is not good)
userSchema.pre('save', function (next) {
    const user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, (err, salt) => {
            if (err) {
                return next(err);
                // eslint-disable-next-line no-else-return
            } else {
                bcrypt.hash(user.password, salt, (berr, hash) => {
                    if (berr) {
                        return next(berr);
                        // eslint-disable-next-line no-else-return
                    } else {
                        user.password = hash;
                        next();
                    }
                    return undefined;
                });
            }
            return undefined;
        });
    } else {
        return next();
    }
    return undefined;
});


// Create method to compare password input to password saved in database
userSchema.methods.comparePassword = function (pw, cb) {
    bcrypt.compare(pw, this.password, (err, isMatch) => {
        if (err) {
            console.log(err);
            return cb(err);
        }
        return cb(null, isMatch);
    });
};


module.exports = mongoose.model('User', userSchema);
