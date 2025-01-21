const protect = (req, res, next) => {
    if (req.oidc.isAuthenticated()) {
        return next();
    }else{
        return res.status(401).json({
            message :"Not Authorized"
        })
    }
};

export default protect;