const { Account, Learner, Admin, Teacher } = require('../models');
const HttpError = require('http-errors');

exports.getProfile = async (req, res, next) => {
    try {
        const { id, role } = req.user;

        let profile = await Account.findByPk(id, {
            attributes: { exclude: ['password'] }
        });

        if (!profile) {
            throw HttpError(404, 'User not found');
        }

        if (role === 'LEARNER') {
            // nhét thêm một cái chìa khóa mới tên là learnerDetails vào cái túi dữ liệu thậ
            const learnerDetails = await Learner.findOne({ where: { idACCOUNT: id } });
            if (learnerDetails) {
                // gan them thong tin chi tiet vao profile
                profile.dataValues.learnerDetails = learnerDetails;
            }
        } else if (role === 'TEACHER') {
            const teacherDetails = await Teacher.findOne({ where: { idACCOUNT: id } });
            if (teacherDetails) {
                profile.dataValues.teacherDetails = teacherDetails;
            }
        }
        else if (role === 'ADMIN') {
            const adminDetails = await Admin.findOne({ where: { idACCOUNT: id } });
            if (adminDetails) {
                profile.dataValues.adminDetails = adminDetails;
            }
        }
        res.status(200).json({
            message: 'Profile fetched successfully',
            profile
        });
    } catch (error) {
        next(error);
    }   
};

exports.updateProfile = async (req, res, next) => {
    try {
        const { id, role } = req.user;
        const updates = req.body; // Dữ liệu cập nhật từ client
        let account = await Account.findByPk(id);

        if (!account) {
            throw HttpError(404, 'User not found');
        }

        // Cập nhật thông tin chung trong bảng Account
        await Account.update(updates, { where: { idACCOUNT: id } });

        // Cập nhật thông tin chi tiết theo vai trò
        if (role === 'LEARNER') {
            await Learner.update(updates, { where: { idACCOUNT: id } });
        } else if (role === 'TEACHER') {
            await Teacher.update(updates, { where: { idACCOUNT: id } });
        } else if (role === 'ADMIN') {
            await Admin.update(updates, { where: { idACCOUNT: id } });
        }

        res.status(200).json({
            message: 'Profile updated successfully'
        });
    } catch (error) {
        next(error);
    }
};