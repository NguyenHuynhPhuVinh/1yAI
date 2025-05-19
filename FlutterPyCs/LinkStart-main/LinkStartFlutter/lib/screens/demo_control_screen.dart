import 'package:flutter/material.dart';
import '../styles/app_styles.dart';
import '../services/firebase_service.dart';
import 'admin_screen.dart';

class DemoControlScreen extends StatefulWidget {
  @override
  _DemoControlScreenState createState() => _DemoControlScreenState();
}

class _DemoControlScreenState extends State<DemoControlScreen> {
  bool isAdmin = false;
  final FirebaseService _firebaseService = FirebaseService();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppStyles.getTechAppBar('Điều Khiển Demo'),
      body: SafeArea(
        child: Container(
          decoration: BoxDecoration(gradient: AppStyles.backgroundGradient),
          child: Stack(
            children: [
              Positioned.fill(
                child: CustomPaint(painter: GridPainter()),
              ),
              Padding(
                padding: EdgeInsets.symmetric(horizontal: 24.0),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Container(
                      decoration: AppStyles.getTechContainerDecoration(),
                      padding: EdgeInsets.all(16),
                      child: Column(
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Text(
                                'Trạng thái Admin:',
                                style: TextStyle(
                                  color: Colors.white70,
                                  fontSize: 16,
                                ),
                              ),
                              SizedBox(width: 10),
                              GestureDetector(
                                onTap: () {
                                  setState(() {
                                    isAdmin = !isAdmin;
                                  });
                                },
                                child: Icon(
                                  isAdmin ? Icons.check_circle : Icons.cancel,
                                  color: isAdmin ? Colors.green : Colors.red,
                                  size: 24,
                                ),
                              ),
                            ],
                          ),
                          SizedBox(height: 20),
                          AppStyles.buildTechButton(
                            'Đăng Nhập',
                            Icons.login,
                            () async {
                              try {
                                await _firebaseService.updateScreenValue(
                                    isAdmin ? 'login-admin' : 'login-user');
                                AppStyles.showTopSnackBar(
                                    context,
                                    isAdmin
                                        ? 'Đăng nhập Admin thành công'
                                        : 'Đăng nhập User thành công');
                              } catch (e) {
                                AppStyles.showTopSnackBar(
                                  context,
                                  'Lỗi: Không thể đăng nhập',
                                  isError: true,
                                );
                              }
                            },
                          ),
                        ],
                      ),
                    ),
                    SizedBox(height: 20),
                    AppStyles.buildTechButton(
                      'Quản Trị',
                      Icons.admin_panel_settings,
                      () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => AdminScreen(),
                          ),
                        );
                      },
                    ),
                    SizedBox(height: 20),
                    AppStyles.buildTechButton(
                      'Thoát',
                      Icons.exit_to_app,
                      () async {
                        try {
                          await _firebaseService.updateScreenValue('exit');
                          Navigator.pop(context);
                          AppStyles.showTopSnackBar(
                              context, 'Đã gửi lệnh thoát thành công');
                        } catch (e) {
                          AppStyles.showTopSnackBar(
                            context,
                            'Lỗi: Không thể gửi lệnh thoát',
                            isError: true,
                          );
                        }
                      },
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
