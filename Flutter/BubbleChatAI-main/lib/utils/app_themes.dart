import 'package:flutter/material.dart';

class AppThemes {
  static const Color _primaryColorLight = Color(0xFF3f8bf8);
  static const Color _primaryColorDark = Color(0xFF2979FF);

  static const Color _surfaceColorLight = Colors.white;
  static const Color _surfaceColorDark = Color(0xFF121212);

  static const Color _backgroundColorLight = Color(0xFFF5F5F5);
  static const Color _backgroundColorDark = Color(0xFF1E1E1E);

  static const Color _secondaryColorLight = Color(0xFF03DAC5);
  static const Color _secondaryColorDark = Color(0xFF03DAC5);

  static ThemeData lightTheme = ThemeData(
    useMaterial3: true,
    brightness: Brightness.light,
    colorScheme: ColorScheme.light(
      primary: _primaryColorLight,
      onPrimary: Colors.white,
      secondary: _secondaryColorLight,
      onSecondary: Colors.black,
      surface: _surfaceColorLight,
      onSurface: Colors.black,
      background: _backgroundColorLight,
      onBackground: Colors.black,
    ),
    scaffoldBackgroundColor: _backgroundColorLight,
    appBarTheme: AppBarTheme(
      backgroundColor: _primaryColorLight,
      foregroundColor: Colors.white,
      elevation: 0,
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        elevation: 2,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
        ),
      ),
    ),
    cardTheme: CardTheme(
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
    ),
    inputDecorationTheme: InputDecorationTheme(
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(8),
      ),
      filled: true,
      fillColor: Colors.grey.shade100,
    ),
  );

  static ThemeData darkTheme = ThemeData(
    useMaterial3: true,
    brightness: Brightness.dark,
    colorScheme: ColorScheme.dark(
      primary: _primaryColorDark,
      onPrimary: Colors.white,
      secondary: _secondaryColorDark,
      onSecondary: Colors.black,
      surface: _surfaceColorDark,
      onSurface: Colors.white,
      background: _backgroundColorDark,
      onBackground: Colors.white,
    ),
    scaffoldBackgroundColor: _backgroundColorDark,
    appBarTheme: AppBarTheme(
      backgroundColor: _surfaceColorDark,
      foregroundColor: Colors.white,
      elevation: 0,
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        elevation: 2,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
        ),
      ),
    ),
    cardTheme: CardTheme(
      elevation: 4,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
    ),
    inputDecorationTheme: InputDecorationTheme(
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(8),
      ),
      filled: true,
      fillColor: Colors.grey.shade800,
    ),
  );
} 