const { HoaDon, Order, Ban, MonAn } = require('../models');

// Lấy tất cả hóa đơn
exports.getAllHoaDon = async (req, res) => {
    try {
        const hoaDons = await HoaDon.findAll({
            include: { // Bao gồm thông tin Order liên quan
                model: Order,
                as: 'order',
                include: [ // Bao gồm cả thông tin Bàn và Món ăn từ Order
                    { model: Ban, as: 'ban' },
                    {
                        model: MonAn,
                        as: 'monAns',
                        through: { attributes: ['SoLuong', 'ThanhTien'] }
                    }
                ]
            },
            order: [['NgayLap', 'DESC']]
        });
        res.status(200).json(hoaDons);
    } catch (error) {
        res.status(500).json({ message: "Lỗi lấy danh sách hóa đơn", error: error.message });
    }
};

// Lấy hóa đơn theo MaHoaDon
exports.getHoaDonById = async (req, res) => {
    try {
        const hoaDon = await HoaDon.findByPk(req.params.maHoaDon, {
            include: {
                model: Order,
                as: 'order',
                include: [
                    { model: Ban, as: 'ban' },
                    {
                        model: MonAn,
                        as: 'monAns',
                        through: { attributes: ['SoLuong', 'ThanhTien'] }
                    }
                ]
            }
        });
        if (!hoaDon) {
            return res.status(404).json({ message: "Không tìm thấy hóa đơn" });
        }
        res.status(200).json(hoaDon);
    } catch (error) {
        res.status(500).json({ message: "Lỗi lấy thông tin hóa đơn", error: error.message });
    }
};

// Tạo hóa đơn mới (Thường được tạo tự động khi thanh toán, nhưng có thể tạo thủ công nếu cần)
exports.createHoaDon = async (req, res) => {
    try {
        const { MaHoaDon, SoOrder, PhuongThucTT } = req.body;

        if (!MaHoaDon || !SoOrder) {
            return res.status(400).json({ message: "Cần MaHoaDon và SoOrder để tạo hóa đơn." });
        }

        // Kiểm tra Order có tồn tại và đã thanh toán chưa?
        const order = await Order.findByPk(SoOrder);
        if (!order) {
            return res.status(404).json({ message: `Không tìm thấy Order với số ${SoOrder}` });
        }
        // Logic nghiệp vụ có thể yêu cầu Order phải được thanh toán trước khi tạo hóa đơn
        // if (!order.TrangThai) {
        //     return res.status(400).json({ message: `Order ${SoOrder} chưa được thanh toán.` });
        // }

        // Kiểm tra xem Order này đã có hóa đơn chưa (vì là quan hệ 1-1)
        const existingHoaDon = await HoaDon.findOne({ where: { SoOrder: SoOrder } });
        if (existingHoaDon) {
            return res.status(400).json({ message: `Order ${SoOrder} đã có hóa đơn (Mã: ${existingHoaDon.MaHoaDon}).` });
        }

        const newHoaDon = await HoaDon.create({
            MaHoaDon: MaHoaDon,
            SoOrder: SoOrder,
            TongTien: order.TongTien, // Lấy tổng tiền từ Order liên quan
            PhuongThucTT: PhuongThucTT || 'Tiền mặt' // Mặc định là tiền mặt nếu không cung cấp
        });

        res.status(201).json(newHoaDon);
    } catch (error) {
        // Bắt lỗi khóa chính trùng lặp (MaHoaDon) hoặc khóa ngoại (SoOrder)
        if (error.name === 'SequelizeUniqueConstraintError' || error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(400).json({ message: "Lỗi tạo hóa đơn: " + error.message, fields: error.fields });
        }
        res.status(400).json({ message: "Lỗi tạo hóa đơn", error: error.message });
    }
};

// TODO: Thêm chức năng cập nhật, xóa hóa đơn (nếu cần thiết và logic nghiệp vụ cho phép)
