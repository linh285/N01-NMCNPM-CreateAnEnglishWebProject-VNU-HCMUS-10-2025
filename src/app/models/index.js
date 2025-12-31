
const Sequelize = require('sequelize');
// Lấy môi trường hiện tại (development, test, hay production)
const env = process.env.NODE_ENV || 'development';
// Đọc file config.json để lấy user, password, tên DB
const config = require(__dirname + '/../config/config.json')[env]; 


let sequelize;
// Khởi tạo kết nối đến PostgreSQL
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}


db.connect = {};


db.Admin = require('./Admin')(sequelize, Sequelize.DataTypes);
db.Account = require('./Account')(sequelize, Sequelize.DataTypes);
db.Learner = require('./Learner')(sequelize, Sequelize.DataTypes);
db.Teacher = require('./Teacher')(sequelize, Sequelize.DataTypes);

db.Course = require('./Course')(sequelize, Sequelize.DataTypes);
db.Lesson = require('./Lesson')(sequelize, Sequelize.DataTypes);
db.Question = require('./Question')(sequelize, Sequelize.DataTypes);
db.OfflineSchedule = require('./OfflineSchedule')(sequelize, Sequelize.DataTypes);

db.Enrollment = require('./Enrollment')(sequelize, Sequelize.DataTypes);
db.LearningProgress = require('./LearningProgress')(sequelize, Sequelize.DataTypes);
db.TestSession = require('./TestSession')(sequelize, Sequelize.DataTypes);
db.SpeakingResult = require('./SpeakingResult')(sequelize, Sequelize.DataTypes);

db.CartItem = require('./CartItem')(sequelize, Sequelize.DataTypes);
db.Order = require('./Order')(sequelize, Sequelize.DataTypes);
db.OrderItem = require('./OrderItem')(sequelize, Sequelize.DataTypes);
db.Review = require('./Review')(sequelize, Sequelize.DataTypes);

// 5. kích hoạt associate
Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

// 6. xuất ra để dùng
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
