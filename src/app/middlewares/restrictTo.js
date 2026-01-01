/*
   (Authorization - Phân quyền): 

    chỉ cho phép những vai trò (role) nhất định truy cập
    kiểu admin/teacher 
    cấm LEANER
*/


const jwt = require('jsonwebtoken');
const HttpError = require('http-errors');

module.exports = function restrictTo(...allowedRoles) {
    return (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                throw HttpError(401, 'Authorization header missing or malformed');
            }
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);  
            if (!allowedRoles.includes(decoded.role)) {
                throw HttpError(403, 'You do not have permission to perform this action');
            }
            req.user = decoded;
            next();
        } catch (error) {
            next(error);
        }
    };
}