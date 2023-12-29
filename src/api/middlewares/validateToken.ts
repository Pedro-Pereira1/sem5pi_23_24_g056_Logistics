var jwt = require('jsonwebtoken');
var config = require('../../../config')

function validateToken(req, res, next) {
    var auth = req.headers['authorization']
    if (!auth) {
        return res.status(401)
    }
    var token = auth.split(' ')[1];
    jwt.verify(token, "u2mUMiNxgfIbfXIOhOFskAI8o6doVRCH", function (err, decoded) { 
        if (err) {
            return res.status(500)
        }
        req.userId = decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']
        req.userRole = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
        next();
    })
}

module.exports = validateToken;