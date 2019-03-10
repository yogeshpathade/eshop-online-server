const JwtStrategy = require('passport-jwt').Strategy;
// eslint-disable-next-line
const ExtractJwt = require('passport-jwt').ExtractJwt;

const User = require('../models/user.js');
const config = require('../config/config');

// Setup work and export for the JWT passport strategy
module.exports = function (passport) {
    // eslint-disable-next-line
    let opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
    opts.secretOrKey = config.secret;

    passport.use(new JwtStrategy(opts, async (jwtPayload, done) => {
        // console.log(jwtPayload);
        try {
            const user = await User.find({ emailId: jwtPayload.emailId });
            if (user) {
                return done(null, user);
                // eslint-disable-next-line no-else-return
            } else {
                return done(null, false, { status: 'Unauthorized' });
            }
        } catch (err) {
            return done(err, false, { status: 'failed' });
        }
    }));
};
