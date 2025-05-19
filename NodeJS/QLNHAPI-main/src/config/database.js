const { Sequelize } = require('sequelize');
const mysql2 = require('mysql2/promise'); // Import mysql2/promise để tạo CSDL

const dbName = 'QLNH';
const dbUser = 'root';
const dbPassword = 'tomisakae0000';
const dbHost = '127.0.0.1';
const dbPort = 3306;

// Hàm tạo CSDL nếu chưa tồn tại
const ensureDatabaseExists = async () => {
    try {
        const connection = await mysql2.createConnection({
            host: dbHost,
            port: dbPort,
            user: dbUser,
            password: dbPassword,
        });
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
        await connection.end();
        console.log(`Cơ sở dữ liệu '${dbName}' đã được đảm bảo tồn tại.`);
    } catch (error) {
        console.error(`Lỗi khi tạo/kiểm tra cơ sở dữ liệu '${dbName}':`, error);
        process.exit(1);
    }
};

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    port: dbPort,
    dialect: 'mysql',
    logging: false, // Tắt log SQL query ra console, có thể bật nếu cần debug
});

const connectDB = async () => {
    try {
        // 1. Đảm bảo CSDL tồn tại
        await ensureDatabaseExists();

        // 2. Kết nối Sequelize
        await sequelize.authenticate();
        console.log(`Kết nối Sequelize tới CSDL '${dbName}' thành công.`);

        // 3. Đồng bộ model với database (tạo bảng nếu chưa có)
        // Lưu ý: force: true sẽ xóa bảng cũ và tạo lại. Chỉ dùng trong môi trường dev.
        // await sequelize.sync({ force: false });
        // console.log("Đã đồng bộ model với database.");
    } catch (error) {
        console.error('Không thể kết nối đến cơ sở dữ liệu:', error);
        process.exit(1); // Thoát ứng dụng nếu không kết nối được DB
    }
};

module.exports = { sequelize, connectDB };
