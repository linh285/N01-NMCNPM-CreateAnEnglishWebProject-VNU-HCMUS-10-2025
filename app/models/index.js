const Sequelize = require('sequelize');
// Import từ file connect ---
const { sequelize } = require('../../config/db/connect'); 
// -----------------------------------------------

const db = {};

// 2. Nạp Models 
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

// 3. Kích hoạt Associate
Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

// 4. Xuất ra
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;