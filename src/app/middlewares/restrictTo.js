/*
   (Authorization - Phân quyền): 

    chỉ cho phép những vai trò (role) nhất định truy cập
    kiểu admin/teacher 
    cấm LEANER
*/
const HttpError = require('http-errors');

const restrictTo = (...allowedRoles) => {
    // Ví dụ: nếu gọi restrictTo('ADMIN', 'TEACHER') thì allowedRoles = ['ADMIN', 'TEACHER']
    return (req, res, next) => {
        // 1. Kiểm tra an toàn: Đảm bảo isAuth đã chạy trước đó
        if (!req.user || !req.user.role) {
            return next(HttpError(500, 'Internal Server Error: Authorization check failed.'));
        }

        const userRole = req.user.role;

        // 2.  Array.includes() trả về true nếu tìm thấy, false nếu không
        if (allowedRoles.includes(userRole)) {
            // Đủ quyền -> Cho đi tiếp
            next();
        } else {
            // Không đủ quyền -> Chặn lại bằng lỗi 403
            // 403 Forbidden: Server hiểu mình là ai, nhưng từ chối phục vụ.
            return next(HttpError(403, 'Forbidden: You do not have permission to perform this action.'));
        }
    };
};

module.exports = restrictTo;