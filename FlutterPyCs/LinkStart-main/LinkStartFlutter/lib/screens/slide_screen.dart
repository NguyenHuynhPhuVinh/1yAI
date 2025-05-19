import 'package:flutter/material.dart';
import '../styles/app_styles.dart';
import '../services/firebase_service.dart';

class SlideScreen extends StatefulWidget {
  @override
  _SlideScreenState createState() => _SlideScreenState();
}

class _SlideScreenState extends State<SlideScreen> {
  final FirebaseService _firebaseService = FirebaseService();
  bool _isPressingUp = false;
  bool _isPressingDown = false;

  Widget _buildButton({
    required bool isPressed,
    required IconData icon,
    required String text,
    required VoidCallback onTap,
    required BorderSide borderSide,
  }) {
    return GestureDetector(
      onTapDown: (_) => setState(
          () => text == 'Lùi' ? _isPressingUp = true : _isPressingDown = true),
      onTapUp: (_) {
        setState(() =>
            text == 'Lùi' ? _isPressingUp = false : _isPressingDown = false);
        onTap();
      },
      onTapCancel: () => setState(() =>
          text == 'Lùi' ? _isPressingUp = false : _isPressingDown = false),
      child: AnimatedContainer(
        duration: Duration(milliseconds: 150),
        decoration: BoxDecoration(
          border: Border(bottom: borderSide),
          color: isPressed
              ? AppStyles.accentColor.withOpacity(0.3)
              : Colors.transparent,
        ),
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                icon,
                size: 48,
                color: isPressed ? Colors.white : Colors.white70,
              ),
              SizedBox(height: 16),
              Text(
                text,
                style: TextStyle(
                  color: isPressed ? Colors.white : Colors.white70,
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 1.5,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppStyles.getTechAppBar('Chuyển Slide'),
      body: SafeArea(
        child: Container(
          decoration: BoxDecoration(gradient: AppStyles.backgroundGradient),
          child: Stack(
            children: [
              Positioned.fill(
                child: CustomPaint(painter: GridPainter()),
              ),
              Column(
                children: [
                  // Nút Lùi
                  Expanded(
                    child: _buildButton(
                      isPressed: _isPressingUp,
                      icon: Icons.arrow_downward,
                      text: 'Lùi',
                      borderSide: BorderSide(
                        color: AppStyles.accentColor.withOpacity(0.3),
                        width: 1,
                      ),
                      onTap: () async {
                        try {
                          await _firebaseService.updateSlideValue(0);
                          AppStyles.showTopSnackBar(
                              context, 'Đã gửi lệnh lùi slide');
                        } catch (e) {
                          AppStyles.showTopSnackBar(
                            context,
                            'Lỗi: Không thể gửi lệnh lùi',
                            isError: true,
                          );
                        }
                      },
                    ),
                  ),
                  // Nút Tiến
                  Expanded(
                    child: _buildButton(
                      isPressed: _isPressingDown,
                      icon: Icons.arrow_upward,
                      text: 'Tiến',
                      borderSide: BorderSide(
                        color: AppStyles.accentColor.withOpacity(0.3),
                        width: 1,
                      ),
                      onTap: () async {
                        try {
                          await _firebaseService.updateSlideValue(1);
                          AppStyles.showTopSnackBar(
                              context, 'Đã gửi lệnh tiến slide');
                        } catch (e) {
                          AppStyles.showTopSnackBar(
                            context,
                            'Lỗi: Không thể gửi lệnh tiến',
                            isError: true,
                          );
                        }
                      },
                    ),
                  ),
                ],
              ),
              // Hiệu ứng hover
              _buildHoverEffect(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHoverEffect() {
    return Positioned.fill(
      child: IgnorePointer(
        child: Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: [
                AppStyles.accentColor.withOpacity(0.1),
                Colors.transparent,
                Colors.transparent,
                AppStyles.accentColor.withOpacity(0.1),
              ],
              stops: [0.0, 0.3, 0.7, 1.0],
            ),
          ),
        ),
      ),
    );
  }
}
