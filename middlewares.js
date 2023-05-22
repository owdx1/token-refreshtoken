const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) =>{

    const accessToken = req.headers['authorization']?.split(' ')[1];
    console.log(accessToken);
    if(!accessToken) {
        return res.status(401)

    }

    jwt.verify(accessToken , process.env.jwtSecret, (err , user) =>{
        if(err){
            console.error(err.message);
            return res.sendStatus(401);
        }
        req.user = user;
        next();
    })
}

module.exports = authMiddleware