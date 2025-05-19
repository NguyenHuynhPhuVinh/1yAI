import 'package:flutter/material.dart';

class AppStyles {
  // Colors
  static const backgroundColor = Colors.black87;
  static const accentColor = Colors.deepOrangeAccent;
  static const secondaryAccentColor = Colors.orangeAccent;

  // Gradients
  static const backgroundGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [
      Colors.black87,
      Color(0xFF212121), // Colors.grey[900]
      Colors.black87,
    ],
  );

  static const buttonGradient = LinearGradient(
    colors: [Colors.deepOrangeAccent, Colors.orangeAccent],
  );

  static const titleGradient = LinearGradient(
    colors: [Colors.deepOrangeAccent, Colors.orangeAccent],
  );

  // Text Styles
  static const titleStyle = TextStyle(
    fontSize: 36,
    fontWeight: FontWeight.bold,
    color: Colors.white,
    letterSpacing: 2,
  );

  static const buttonTextStyle = TextStyle(
    fontSize: 16,
    fontWeight: FontWeight.bold,
    color: Colors.white,
    letterSpacing: 1,
  );

  // Decorations
  static BoxDecoration getTechContainerDecoration() {
    return BoxDecoration(
      color: Colors.black54,
      borderRadius: BorderRadius.circular(8),
      border: Border.all(
        color: Colors.deepOrangeAccent.withOpacity(0.5),
        width: 1,
      ),
      boxShadow: [
        BoxShadow(
          color: Colors.deepOrangeAccent.withOpacity(0.2),
          spreadRadius: 1,
          blurRadius: 15,
          offset: Offset(0, 0),
        ),
      ],
    );
  }

  static BoxDecoration getTechButtonDecoration() {
    return BoxDecoration(
      gradient: buttonGradient,
      borderRadius: BorderRadius.circular(4),
      boxShadow: [
        BoxShadow(
          color: Colors.deepOrangeAccent.withOpacity(0.3),
          spreadRadius: 1,
          blurRadius: 8,
          offset: Offset(0, 2),
        ),
      ],
    );
  }

  // Common Widgets
  static Widget buildTechButton(
      String text, IconData icon, VoidCallback onPressed) {
    return Container(
      width: 220,
      height: 50,
      decoration: getTechButtonDecoration(),
      child: ElevatedButton(
        onPressed: onPressed,
        style: ElevatedButton.styleFrom(
          backgroundColor: Colors.transparent,
          shadowColor: Colors.transparent,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(4),
          ),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, color: Colors.white),
            SizedBox(width: 8),
            Text(text, style: buttonTextStyle),
          ],
        ),
      ),
    );
  }

  // AppBar Theme
  static AppBar getTechAppBar(String title) {
    return AppBar(
      title: Text(
        title,
        style: TextStyle(
          fontWeight: FontWeight.w600,
          letterSpacing: 1.2,
        ),
      ),
      centerTitle: true,
      elevation: 0,
      backgroundColor: backgroundColor,
      foregroundColor: Colors.white,
    );
  }

  static void showTopSnackBar(BuildContext context, String message,
      {bool isError = false}) {
    // Ẩn thông báo cũ nếu có
    ScaffoldMessenger.of(context).hideCurrentSnackBar();

    // Hiển thị thông báo mới
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: isError ? Colors.red : Colors.green,
        behavior: SnackBarBehavior.floating,
        margin: EdgeInsets.only(
          bottom: MediaQuery.of(context).size.height - 100,
          left: 20,
          right: 20,
        ),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(10),
        ),
      ),
    );
  }
}

// Grid Painter for background
class GridPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.deepOrangeAccent.withOpacity(0.1)
      ..strokeWidth = 1;

    for (var i = 0; i < size.height; i += 20) {
      canvas.drawLine(
          Offset(0, i.toDouble()), Offset(size.width, i.toDouble()), paint);
    }

    for (var i = 0; i < size.width; i += 20) {
      canvas.drawLine(
          Offset(i.toDouble(), 0), Offset(i.toDouble(), size.height), paint);
    }
  }

  @override
  bool shouldRepaint(CustomPainter oldDelegate) => false;
}
