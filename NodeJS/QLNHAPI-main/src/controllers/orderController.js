const { Order, MonAn, ChiTietOrder, Ban, sequelize } = require('../models');

// Tạo đơn đặt món mới (Nhân viên)
exports.createOrder = async (req, res) => {
    const transaction = await sequelize.transaction(); // Bắt đầu transaction
    try {
        const { BanSo, items } = req.body; // items là một mảng [{ MaMon, SoLuong }, ...]

        if (!BanSo || !items || !Array.isArray(items) || items.length === 0) {
            await transaction.rollback();
            return res.status(400).json({ message: "Dữ liệu không hợp lệ. Cần BanSo và danh sách items." });
        }

        // Kiểm tra bàn có tồn tại không
        const ban = await Ban.findByPk(BanSo, { transaction });
        if (!ban) {
            await transaction.rollback();
            return res.status(404).json({ message: `Không tìm thấy bàn ${BanSo}` });
        }
        // TODO: Kiểm tra trạng thái bàn (ví dụ: bàn trống mới được tạo order)

        // Tạo Order mới
        const newOrder = await Order.create({
            BanSo: BanSo,
            TrangThai: false, // Mặc định là chưa thanh toán
            TongTien: 0 // Sẽ cập nhật sau
        }, { transaction });

        let tongTienOrder = 0;

        // Thêm các món ăn vào ChiTietOrder
        for (const item of items) {
            const monAn = await MonAn.findByPk(item.MaMon, { transaction });
            if (!monAn) {
                await transaction.rollback();
                return res.status(404).json({ message: `Không tìm thấy món ăn với mã ${item.MaMon}` });
            }
            if (!monAn.TrangThai) {
                await transaction.rollback();
                return res.status(400).json({ message: `Món ăn '${monAn.TenMon}' (${item.MaMon}) hiện không có sẵn.` });
            }

            const thanhTienItem = monAn.Gia * item.SoLuong;
            tongTienOrder += thanhTienItem;

            await ChiTietOrder.create({
                SoOrder: newOrder.SoOrder,
                MaMon: item.MaMon,
                SoLuong: item.SoLuong,
                ThanhTien: thanhTienItem // Lưu thành tiền của từng chi tiết
            }, { transaction });
        }

        // Cập nhật tổng tiền cho Order
        newOrder.TongTien = tongTienOrder;
        await newOrder.save({ transaction });

        // Commit transaction nếu mọi thứ thành công
        await transaction.commit();

        // Lấy lại thông tin order đầy đủ để trả về
        const createdOrder = await Order.findByPk(newOrder.SoOrder, {
            include: [
                { model: Ban, as: 'ban' },
                {
                    model: MonAn,
                    as: 'monAns',
                    through: { attributes: ['SoLuong', 'ThanhTien'] } // Lấy cả thông tin từ bảng trung gian
                }
            ]
        });

        res.status(201).json(createdOrder);

    } catch (error) {
        // Rollback transaction nếu có lỗi
        await transaction.rollback();
        res.status(500).json({ message: "Lỗi tạo đơn đặt món", error: error.message });
    }
};

// Lấy tất cả Order (có thể filter theo trạng thái, bàn,...)
exports.getAllOrders = async (req, res) => {
    try {
        // TODO: Thêm filter, pagination
        const orders = await Order.findAll({
            include: [
                { model: Ban, as: 'ban' },
                {
                    model: MonAn,
                    as: 'monAns',
                    through: { attributes: ['SoLuong', 'ThanhTien'] }
                },
                { model: HoaDon, as: 'hoaDon' } // Include HoaDon nếu có
            ],
            order: [['ThoiGianOrder', 'DESC']] // Sắp xếp theo thời gian mới nhất
        });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "Lỗi lấy danh sách order", error: error.message });
    }
};


// Lấy Order theo SoOrder
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.soOrder, {
            include: [
                { model: Ban, as: 'ban' },
                {
                    model: MonAn,
                    as: 'monAns',
                    through: { attributes: ['SoLuong', 'ThanhTien'] }
                },
                { model: HoaDon, as: 'hoaDon' }
            ]
        });
        if (!order) {
            return res.status(404).json({ message: "Không tìm thấy order" });
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: "Lỗi lấy thông tin order", error: error.message });
    }
};

// Thanh toán Order (Đánh dấu Order là đã thanh toán)
exports.thanhToanOrder = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const soOrder = req.params.soOrder;
        const order = await Order.findByPk(soOrder, { transaction });

        if (!order) {
            await transaction.rollback();
            return res.status(404).json({ message: "Không tìm thấy order để thanh toán" });
        }

        if (order.TrangThai) { // Nếu đã thanh toán rồi
            await transaction.rollback();
            return res.status(400).json({ message: "Order này đã được thanh toán trước đó." });
        }

        // Cập nhật trạng thái Order
        order.TrangThai = true;
        await order.save({ transaction });

        // TODO: Có thể tự động tạo Hóa Đơn ở đây luôn nếu logic nghiệp vụ yêu cầu
        // Ví dụ:
        // await HoaDon.create({ SoOrder: order.SoOrder, TongTien: order.TongTien, PhuongThucTT: req.body.PhuongThucTT || 'Tiền mặt' }, { transaction });

        await transaction.commit();
        res.status(200).json({ message: `Order ${soOrder} đã được thanh toán thành công.` });

    } catch (error) {
        await transaction.rollback();
        res.status(500).json({ message: "Lỗi thanh toán order", error: error.message });
    }
};


// TODO: Thêm chức năng cập nhật order (thêm/bớt món, đổi bàn?), xóa order (nếu chưa thanh toán?)
