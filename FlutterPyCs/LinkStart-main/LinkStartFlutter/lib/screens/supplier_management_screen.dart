import 'package:flutter/material.dart';
import '../styles/app_styles.dart';
import '../services/firebase_service.dart';

class SupplierManagementScreen extends StatefulWidget {
  @override
  _SupplierManagementScreenState createState() =>
      _SupplierManagementScreenState();
}

class _SupplierManagementScreenState extends State<SupplierManagementScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.transparent,
      appBar: AppStyles.getTechAppBar('Quản Lý Nhà Cung Cấp'),
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
            Center(
              child: Container(
                constraints: BoxConstraints(maxWidth: 400),
                padding: EdgeInsets.symmetric(horizontal: 24.0),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    AppStyles.buildTechButton(
                      'Thêm Nhà Cung Cấp',
                      Icons.business,
                      () async {
                        try {
                          await FirebaseService().updateAction('qlncc-1');
                          AppStyles.showTopSnackBar(
                              context, 'Đã chọn thêm nhà cung cấp');
                        } catch (e) {
                          AppStyles.showTopSnackBar(
                            context,
                            'Lỗi: Không thể thực hiện thao tác',
                            isError: true,
                          );
                        }
                      },
                    ),
                    SizedBox(height: 16),
                    AppStyles.buildTechButton(
                      'Sửa Nhà Cung Cấp',
                      Icons.edit,
                      () async {
                        try {
                          await FirebaseService().updateAction('qlncc-2');
                          AppStyles.showTopSnackBar(
                              context, 'Đã chọn sửa nhà cung cấp');
                        } catch (e) {
                          AppStyles.showTopSnackBar(
                            context,
                            'Lỗi: Không thể thực hiện thao tác',
                            isError: true,
                          );
                        }
                      },
                    ),
                    SizedBox(height: 16),
                    AppStyles.buildTechButton(
                      'Xóa Nhà Cung Cấp',
                      Icons.delete_forever,
                      () async {
                        try {
                          await FirebaseService().updateAction('qlncc-0');
                          AppStyles.showTopSnackBar(
                              context, 'Đã chọn xóa nhà cung cấp');
                        } catch (e) {
                          AppStyles.showTopSnackBar(
                            context,
                            'Lỗi: Không thể thực hiện thao tác',
                            isError: true,
                          );
                        }
                      },
                    ),
                    SizedBox(height: 16),
                    AppStyles.buildTechButton(
                      'Thoát',
                      Icons.exit_to_app,
                      () async {
                        try {
                          await FirebaseService().updateScreenValue('exit');
                          Navigator.pop(context);
                          AppStyles.showTopSnackBar(
                              context, 'Đã thoát khỏi quản lý nhà cung cấp');
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
