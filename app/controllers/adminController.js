const { Account, Course, Teacher, Student } = require('../models'); 
const HttpError = require('http-errors');
const { Op } = require('sequelize');

// 1. [GET] /admin/dashboard - Lấy số liệu thống kê tổng quan
exports.getDashboardStats = async (req, res, next) => {
    try {
        const [totalAccounts, totalCourses, totalTeachers] = await Promise.all([
            Account.count(),
            Course.count(),
            Teacher.count()
        ]);

        // Tính doanh thu, đếm số khóa học đang 'PUBLISHED'
        const activeCourses = await Course.count({ where: { status: 'PUBLISHED' } });

        res.status(200).json({
            status: 'success',
            data: {
                totalAccounts,
                totalCourses,
                totalTeachers,
                activeCourses
            }
        });
    } catch (error) {
        next(error);
    }
};

// 2. [GET] /admin/accounts - Quản lý danh sách người dùng (có phân trang va tìm kiếm)
exports.getAllAccounts = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, search, role } = req.query;
        const offset = (page - 1) * limit;

        // Xây dựng điều kiện lọc
        const whereClause = {};
        
        // tìm kiếm theo email
        if (search) {
            whereClause.email = { [Op.like]: `%${search}%` };
        }
        // lọc theo vai trò
        if (role) {
            whereClause.role = role;
        }

        const { count, rows } = await Account.findAndCountAll({
            where: whereClause,
            limit: parseInt(limit),
            offset: parseInt(offset),
            attributes: { exclude: ['password'] }, 
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            status: 'success',
            pagination: {
                total: count,
                currentPage: parseInt(page),
                totalPages: Math.ceil(count / limit)
            },
            data: {
                accounts: rows
            }
        });
    } catch (error) {
        next(error);
    }
};

// 3. [PATCH] /admin/accounts/:idACCOUNT/status - Cập nhật trạng thái tài khoản
exports.updateAccountStatus = async (req, res, next) => {
    try {
        const { idACCOUNT } = req.params;
        const { status } = req.body;

        if (!status || !['active', 'banned', 'pending'].includes(status)) {
            throw HttpError(400, 'Invalid status value. Must be \'active or banned or pending\'');
        }

        // Không cho phép admin tự khóa chính mình
        if (req.user && parseInt(idACCOUNT) === req.user.id) {
            throw HttpError(403, 'You cannot lock your own account.');
        }

        const account = await Account.findByPk(idACCOUNT);
        if (!account) {
            throw HttpError(404, 'Account not found');
        }

        await account.update({ status: status });
        res.status(200).json({
            message: `Account has been ${status} successfully`,
            data: {
                accountId: idACCOUNT,
                newStatus: status
            }
        });

    } catch (error) {
        next(error);
    }
};