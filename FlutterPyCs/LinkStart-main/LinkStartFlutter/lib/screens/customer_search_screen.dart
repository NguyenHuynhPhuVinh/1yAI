import 'package:flutter/material.dart';
import '../styles/app_styles.dart';
import '../services/firebase_service.dart';

class CustomerSearchScreen extends StatefulWidget {
  @override
  _CustomerSearchScreenState createState() => _CustomerSearchScreenState();
}

class _CustomerSearchScreenState extends State<CustomerSearchScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.transparent,
      appBar: AppStyles.getTechAppBar('Tra Cứu Khách Hàng'),
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
                      'Tìm Theo Tên',
                      Icons.badge,
                      () async {
                        try {
                          await FirebaseService().updateAction('tckh-1');
                          AppStyles.showTopSnackBar(
                              context, 'Đã chọn tìm theo mã khách hàng');
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
                      'Tìm Theo Email',
                      Icons.person_search,
                      () async {
                        try {
                          await FirebaseService().updateAction('tckh-2');
                          AppStyles.showTopSnackBar(
                              context, 'Đã chọn tìm theo tên khách hàng');
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
                      'Tìm Theo Số Điện Thoại',
                      Icons.phone,
                      () async {
                        try {
                          await FirebaseService().updateAction('tckh-3');
                          AppStyles.showTopSnackBar(
                              context, 'Đã chọn tìm theo số điện thoại');
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
                              context, 'Đã thoát khỏi tra cứu khách hàng');
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
