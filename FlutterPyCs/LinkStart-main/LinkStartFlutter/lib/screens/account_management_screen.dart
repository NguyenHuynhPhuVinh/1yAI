import 'package:flutter/material.dart';
import '../styles/app_styles.dart';
import '../services/firebase_service.dart';

class AccountManagementScreen extends StatefulWidget {
  @override
  _AccountManagementScreenState createState() =>
      _AccountManagementScreenState();
}

class _AccountManagementScreenState extends State<AccountManagementScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.transparent,
      appBar: AppStyles.getTechAppBar('Quản Lý Tài Khoản'),
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
                      'Thêm Tài Khoản',
                      Icons.person_add,
                      () async {
                        try {
                          await FirebaseService().updateAction('qltk-1');
                          AppStyles.showTopSnackBar(
                              context, 'Đã chọn thêm tài khoản');
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
                      'Sửa Tài Khoản',
                      Icons.edit,
                      () async {
                        try {
                          await FirebaseService().updateAction('qltk-2');
                          AppStyles.showTopSnackBar(
                              context, 'Đã chọn sửa tài khoản');
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
                      'Xóa Tài Khoản',
                      Icons.person_remove,
                      () async {
                        try {
                          await FirebaseService().updateAction('qltk-0');
                          AppStyles.showTopSnackBar(
                              context, 'Đã chọn xóa tài khoản');
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
                              context, 'Đã thoát khỏi quản lý tài khoản');
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
