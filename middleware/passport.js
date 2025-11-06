const User = require('../models/User');
const { SECRET } = require('../config');
const { ExtractJwt, Strategy } = require('passport-jwt');

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: SECRET
}

module.exports = (passport) => {
    passport.use(new Strategy(opts, async (jwt_payload, done) => {
        try {
            let user = await User.findById(jwt_payload.id);
            if (user) {
                return done(null, user);
            }
            return done(null, false);
        } catch (err) {
            console.error(err);
        }
    }));
}