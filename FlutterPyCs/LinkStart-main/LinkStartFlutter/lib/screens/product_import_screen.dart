import 'package:flutter/material.dart';
import '../styles/app_styles.dart';
import '../services/firebase_service.dart';

class ProductImportScreen extends StatefulWidget {
  @override
  _ProductImportScreenState createState() => _ProductImportScreenState();
}

class _ProductImportScreenState extends State<ProductImportScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.transparent,
      appBar: AppStyles.getTechAppBar('Nhập Sản Phẩm'),
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
                      'Nhập Sản Phẩm',
                      Icons.add_shopping_cart,
                      () async {
                        try {
                          await FirebaseService().updateAction('nsp');
                          AppStyles.showTopSnackBar(
                              context, 'Đã chọn nhập sản phẩm mới');
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
                              context, 'Đã thoát khỏi nhập sản phẩm');
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
