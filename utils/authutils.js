module.exports = {
    isLoggedIn : function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        console.log("Request is not logged in");
        res.status(401).send('Unauthorized');
    }
}


