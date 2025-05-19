import 'package:flutter/material.dart';
import '../styles/app_styles.dart';
import '../services/firebase_service.dart';
import '../screens/product_management_screen.dart';
import 'staff_management_screen.dart';
import 'customer_management_screen.dart';
import 'account_management_screen.dart';
import 'supplier_management_screen.dart';
import 'product_search_screen.dart';
import 'staff_search_screen.dart';
import 'customer_search_screen.dart';
import 'account_search_screen.dart';
import 'create_invoice_screen.dart';
import 'product_import_screen.dart';
import 'calculation_screen.dart';
import 'report_screen.dart';
import 'statistics_screen.dart';

class AdminScreen extends StatefulWidget {
  @override
  _AdminScreenState createState() => _AdminScreenState();
}

class _AdminScreenState extends State<AdminScreen> {
  final FirebaseService _firebaseService = FirebaseService();
  String expandedMenu = '';

  Widget _buildMenuItem(String title, IconData icon, VoidCallback onTap) {
    return ListTile(
      leading: Icon(icon, color: Colors.white70),
      title: Text(title, style: TextStyle(color: Colors.white70)),
      onTap: onTap,
    );
  }

  Widget _buildExpandableMenu(
      String title, IconData icon, List<Map<String, dynamic>> subMenus) {
    bool isExpanded = expandedMenu == title.toLowerCase();
    String menuPrefix = title
        .toLowerCase()
        .replaceAll(' ', '')
        .replaceAll('ả', 'a')
        .replaceAll('ý', 'y')
        .replaceAll('ứ', 'u')
        .replaceAll('ầ', 'a')
        .replaceAll('ậ', 'a')
        .replaceAll('ấ', 'a')
        .replaceAll('ê', 'e')
        .replaceAll('ề', 'e')
        .replaceAll('ế', 'e')
        .replaceAll('ệ', 'e')
        .replaceAll('ể', 'e')
        .replaceAll('ễ', 'e')
        .replaceAll('ư', 'u')
        .replaceAll('ừ', 'u')
        .replaceAll('ử', 'u')
        .replaceAll('ữ', 'u')
        .replaceAll('ự', 'u')
        .replaceAll('í', 'i')
        .replaceAll('ì', 'i')
        .replaceAll('ỉ', 'i')
        .replaceAll('ĩ', 'i')
        .replaceAll('ị', 'i')
        .replaceAll('ó', 'o')
        .replaceAll('ò', 'o')
        .replaceAll('ỏ', 'o')
        .replaceAll('õ', 'o')
        .replaceAll('ọ', 'o')
        .replaceAll('ố', 'o')
        .replaceAll('ồ', 'o')
        .replaceAll('ổ', 'o')
        .replaceAll('ỗ', 'o')
        .replaceAll('ộ', 'o')
        .replaceAll('ớ', 'o')
        .replaceAll('ờ', 'o')
        .replaceAll('ở', 'o')
        .replaceAll('ỡ', 'o')
        .replaceAll('ợ', 'o')
        .replaceAll('ă', 'a')
        .replaceAll('ắ', 'a')
        .replaceAll('ằ', 'a')
        .replaceAll('ẳ', 'a')
        .replaceAll('ẵ', 'a')
        .replaceAll('ặ', 'a')
        .replaceAll('đ', 'd');

    return Container(
      decoration: AppStyles.getTechContainerDecoration(),
      margin: EdgeInsets.only(bottom: 8),
      child: Column(
        children: [
          InkWell(
            onTap: () {
              setState(() {
                expandedMenu = isExpanded ? '' : title.toLowerCase();
              });
            },
            child: Container(
              padding: EdgeInsets.all(16),
              child: Row(
                children: [
                  Icon(icon, color: Colors.white),
                  SizedBox(width: 8),
                  Text(
                    title,
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  Spacer(),
                  Icon(
                    isExpanded
                        ? Icons.keyboard_arrow_up
                        : Icons.keyboard_arrow_down,
                    color: Colors.white,
                  ),
                ],
              ),
            ),
          ),
          if (isExpanded) ...[
            Divider(color: AppStyles.accentColor.withOpacity(0.3), height: 1),
            ...subMenus.map((menu) => _buildMenuItem(
                  menu['title'],
                  menu['icon'],
                  () async {
                    if (menu['value'] == 'sanpham') {
                      try {
                        if (menuPrefix == 'quanly') {
                          await _firebaseService
                              .updateScreenValue('qt-quanly-sanpham');
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => ProductManagementScreen(),
                            ),
                          );
                          AppStyles.showTopSnackBar(
                              context, 'Đã chuyển đến quản lý sản phẩm');
                        } else if (menuPrefix == 'tracuu') {
                          await _firebaseService
                              .updateScreenValue('qt-tracuu-sanpham');
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => ProductSearchScreen(),
                            ),
                          );
                          AppStyles.showTopSnackBar(
                              context, 'Đã chuyển đến tra cứu sản phẩm');
                        }
                      } catch (e) {
                        AppStyles.showTopSnackBar(
                          context,
                          'Lỗi: Không thể thực hiện thao tác',
                          isError: true,
                        );
                      }
                    } else if (menu['value'] == 'nhanvien') {
                      try {
                        if (menuPrefix == 'quanly') {
                          await _firebaseService
                              .updateScreenValue('qt-quanly-nhanvien');
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => StaffManagementScreen(),
                            ),
                          );
                          AppStyles.showTopSnackBar(
                              context, 'Đã chuyển đến quản lý nhân viên');
                        } else if (menuPrefix == 'tracuu') {
                          await _firebaseService
                              .updateScreenValue('qt-tracuu-nhanvien');
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => StaffSearchScreen(),
                            ),
                          );
                          AppStyles.showTopSnackBar(
                              context, 'Đã chuyển đến tra cứu nhân viên');
                        }
                      } catch (e) {
                        AppStyles.showTopSnackBar(
                          context,
                          'Lỗi: Không thể thực hiện thao tác',
                          isError: true,
                        );
                      }
                    } else if (menu['value'] == 'khachhang') {
                      try {
                        if (menuPrefix == 'quanly') {
                          await _firebaseService
                              .updateScreenValue('qt-quanly-khachhang');
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => CustomerManagementScreen(),
                            ),
                          );
                          AppStyles.showTopSnackBar(
                              context, 'Đã chuyển đến quản lý khách hàng');
                        } else if (menuPrefix == 'tracuu') {
                          await _firebaseService
                              .updateScreenValue('qt-tracuu-khachhang');
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => CustomerSearchScreen(),
                            ),
                          );
                          AppStyles.showTopSnackBar(
                              context, 'Đã chuyển đến tra cứu khách hàng');
                        }
                      } catch (e) {
                        AppStyles.showTopSnackBar(
                          context,
                          'Lỗi: Không thể thực hiện thao tác',
                          isError: true,
                        );
                      }
                    } else if (menu['value'] == 'taikhoan') {
                      try {
                        if (menuPrefix == 'quanly') {
                          await _firebaseService
                              .updateScreenValue('qt-quanly-taikhoan');
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => AccountManagementScreen(),
                            ),
                          );
                          AppStyles.showTopSnackBar(
                              context, 'Đã chuyển đến quản lý tài khoản');
                        } else if (menuPrefix == 'tracuu') {
                          await _firebaseService
                              .updateScreenValue('qt-tracuu-taikhoan');
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => AccountSearchScreen(),
                            ),
                          );
                          AppStyles.showTopSnackBar(
                              context, 'Đã chuyển đến tra cứu tài khoản');
                        }
                      } catch (e) {
                        AppStyles.showTopSnackBar(
                          context,
                          'Lỗi: Không thể thực hiện thao tác',
                          isError: true,
                        );
                      }
                    } else if (menu['value'] == 'nhacungcap') {
                      try {
                        if (menuPrefix == 'quanly') {
                          await _firebaseService
                              .updateScreenValue('qt-quanly-nhacungcap');
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => SupplierManagementScreen(),
                            ),
                          );
                          AppStyles.showTopSnackBar(
                              context, 'Đã chuyển đến quản lý nhà cung cấp');
                        } else {
                          await _firebaseService.updateScreenValue(
                              'qt-$menuPrefix-${menu['value']}');
                          AppStyles.showTopSnackBar(
                              context, 'Đã chuyển đến tra cứu nhà cung cấp');
                        }
                      } catch (e) {
                        AppStyles.showTopSnackBar(
                          context,
                          'Lỗi: Không thể thực hiện thao tác',
                          isError: true,
                        );
                      }
                    } else {
                      try {
                        await _firebaseService.updateScreenValue(
                            'qt-$menuPrefix-${menu['value']}');
                        AppStyles.showTopSnackBar(
                            context, 'Đã chuyển đến ${menu['title']}');
                      } catch (e) {
                        AppStyles.showTopSnackBar(
                          context,
                          'Lỗi: Không thể chuyển đến ${menu['title']}',
                          isError: true,
                        );
                      }
                    }
                  },
                )),
          ],
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.transparent,
      appBar: AppStyles.getTechAppBar('Quản Trị'),
      body: Container(
        width: double.infinity,
        height: double.infinity,
        decoration: BoxDecoration(
          gradient: AppStyles.backgroundGradient,
        ),
        child: Stack(
          children: [
            Positioned.fill(
              child: CustomPaint(painter: GridPainter()),
            ),
            Container(
              width: double.infinity,
              height: double.infinity,
              color: Colors.transparent,
              child: SingleChildScrollView(
                padding: EdgeInsets.all(24.0),
                child: Column(
                  children: [
                    _buildExpandableMenu(
                      'Quản Lý',
                      Icons.manage_accounts,
                      [
                        {
                          'title': 'Sản Phẩm',
                          'icon': Icons.inventory_2,
                          'value': 'sanpham'
                        },
                        {
                          'title': 'Nhân Viên',
                          'icon': Icons.people,
                          'value': 'nhanvien'
                        },
                        {
                          'title': 'Khách Hàng',
                          'icon': Icons.person,
                          'value': 'khachhang'
                        },
                        {
                          'title': 'Tài Khoản',
                          'icon': Icons.account_circle,
                          'value': 'taikhoan'
                        },
                        {
                          'title': 'Nhà Cung Cấp',
                          'icon': Icons.local_shipping,
                          'value': 'nhacungcap'
                        },
                      ],
                    ),
                    SizedBox(height: 8),
                    _buildExpandableMenu(
                      'Tra Cứu',
                      Icons.search,
                      [
                        {
                          'title': 'Sản Phẩm',
                          'icon': Icons.inventory_2,
                          'value': 'sanpham'
                        },
                        {
                          'title': 'Nhân Viên',
                          'icon': Icons.people,
                          'value': 'nhanvien'
                        },
                        {
                          'title': 'Khách Hàng',
                          'icon': Icons.person,
                          'value': 'khachhang'
                        },
                        {
                          'title': 'Tài Khoản',
                          'icon': Icons.account_circle,
                          'value': 'taikhoan'
                        },
                      ],
                    ),
                    SizedBox(height: 8),
                    AppStyles.buildTechButton(
                      'Tính Toán',
                      Icons.calculate,
                      () async {
                        try {
                          await _firebaseService
                              .updateScreenValue('qt-tinhtoan');
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => CalculationScreen(),
                            ),
                          );
                          AppStyles.showTopSnackBar(
                              context, 'Đã chuyển đến Tính Toán');
                        } catch (e) {
                          AppStyles.showTopSnackBar(
                            context,
                            'Lỗi: Không thể chuyển đến Tính Toán',
                            isError: true,
                          );
                        }
                      },
                    ),
                    SizedBox(height: 8),
                    AppStyles.buildTechButton(
                      'Thống Kê',
                      Icons.bar_chart,
                      () async {
                        try {
                          await _firebaseService
                              .updateScreenValue('qt-thongke');
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => StatisticsScreen(),
                            ),
                          );
                          AppStyles.showTopSnackBar(
                              context, 'Đã chuyển đến Thống Kê');
                        } catch (e) {
                          AppStyles.showTopSnackBar(
                            context,
                            'Lỗi: Không thể chuyển đến Thống Kê',
                            isError: true,
                          );
                        }
                      },
                    ),
                    SizedBox(height: 8),
                    AppStyles.buildTechButton(
                      'Báo Biểu',
                      Icons.assessment,
                      () async {
                        try {
                          await _firebaseService
                              .updateScreenValue('qt-baobieu');
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => ReportScreen(),
                            ),
                          );
                          AppStyles.showTopSnackBar(
                              context, 'Đã chuyển đến Báo Biểu');
                        } catch (e) {
                          AppStyles.showTopSnackBar(
                            context,
                            'Lỗi: Không thể chuyển đến Báo Biểu',
                            isError: true,
                          );
                        }
                      },
                    ),
                    SizedBox(height: 8),
                    AppStyles.buildTechButton(
                      'Lập Hóa Đơn',
                      Icons.receipt_long,
                      () async {
                        try {
                          await _firebaseService
                              .updateScreenValue('qt-laphoadon');
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => CreateInvoiceScreen(),
                            ),
                          );
                          AppStyles.showTopSnackBar(
                              context, 'Đã chuyển đến Lập Hóa Đơn');
                        } catch (e) {
                          AppStyles.showTopSnackBar(
                            context,
                            'Lỗi: Không thể chuyển đến Lập Hóa Đơn',
                            isError: true,
                          );
                        }
                      },
                    ),
                    SizedBox(height: 8),
                    AppStyles.buildTechButton(
                      'Nhập Sản Phẩm',
                      Icons.add_shopping_cart,
                      () async {
                        try {
                          await _firebaseService
                              .updateScreenValue('qt-nhapsanpham');
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => ProductImportScreen(),
                            ),
                          );
                          AppStyles.showTopSnackBar(
                              context, 'Đã chuyển đến Nhập Sản Phẩm');
                        } catch (e) {
                          AppStyles.showTopSnackBar(
                            context,
                            'Lỗi: Không thể chuyển đến Nhập Sản Phẩm',
                            isError: true,
                          );
                        }
                      },
                    ),
                    SizedBox(height: 8),
                    AppStyles.buildTechButton(
                      'Thoát',
                      Icons.exit_to_app,
                      () async {
                        try {
                          await _firebaseService.updateScreenValue('exit');
                          Navigator.pop(context);
                          AppStyles.showTopSnackBar(
                              context, 'Đã thoát khỏi màn hình quản trị');
                        } catch (e) {
                          AppStyles.showTopSnackBar(
                            context,
                            'Lỗi: Không thể thực hiện thao tác',
                            isError: true,
                          );
                        }
                      },
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
