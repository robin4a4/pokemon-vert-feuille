import {Strategy as LocalStrategy} from 'passport-local'
import passport from 'passport'
import {User} from './models'

passport.use(new LocalStrategy((username, password, done) => {
    User.query().findOne({username}).then((user) => {
        if (!user) {
            return done(null, false, {message: 'Incorrect username.'})
        }
        if (user.password !== password) {
            return done(null, false, {message: 'Incorrect password.'})
        }
        return done(null, user)
    }
)}))
