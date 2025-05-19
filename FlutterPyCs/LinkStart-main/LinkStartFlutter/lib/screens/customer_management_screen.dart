import 'package:flutter/material.dart';
import '../styles/app_styles.dart';
import '../services/firebase_service.dart';

class CustomerManagementScreen extends StatefulWidget {
  @override
  _CustomerManagementScreenState createState() =>
      _CustomerManagementScreenState();
}

class _CustomerManagementScreenState extends State<CustomerManagementScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.transparent,
      appBar: AppStyles.getTechAppBar('Quản Lý Khách Hàng'),
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
                      'Thêm Khách Hàng',
                      Icons.person_add,
                      () async {
                        try {
                          await FirebaseService().updateAction('qlkh-1');
                          AppStyles.showTopSnackBar(
                              context, 'Đã chọn thêm khách hàng');
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
                      'Sửa Khách Hàng',
                      Icons.edit,
                      () async {
                        try {
                          await FirebaseService().updateAction('qlkh-2');
                          AppStyles.showTopSnackBar(
                              context, 'Đã chọn sửa khách hàng');
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
                      'Xóa Khách Hàng',
                      Icons.person_remove,
                      () async {
                        try {
                          await FirebaseService().updateAction('qlkh-0');
                          AppStyles.showTopSnackBar(
                              context, 'Đã chọn xóa khách hàng');
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
                              context, 'Đã thoát khỏi quản lý khách hàng');
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
