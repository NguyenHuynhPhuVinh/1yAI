import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ThemeManager with ChangeNotifier {
  final String _themeKey = 'theme_mode';
  ThemeMode _themeMode = ThemeMode.system;
  bool _isInitialized = false;

  ThemeManager() {
    _loadThemeMode();
  }

  ThemeMode get themeMode => _themeMode;
  bool get isInitialized => _isInitialized;

  Future<void> _loadThemeMode() async {
    final prefs = await SharedPreferences.getInstance();
    final savedThemeMode = prefs.getString(_themeKey);

    if (savedThemeMode != null) {
      _themeMode = _getThemeModeFromString(savedThemeMode);
    }
    
    _isInitialized = true;
    notifyListeners();
  }

  Future<void> setThemeMode(ThemeMode mode) async {
    if (_themeMode == mode) return;

    _themeMode = mode;
    notifyListeners();

    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_themeKey, _getStringFromThemeMode(mode));
  }

  ThemeMode _getThemeModeFromString(String value) {
    switch (value) {
      case 'light':
        return ThemeMode.light;
      case 'dark':
        return ThemeMode.dark;
      default:
        return ThemeMode.system;
    }
  }

  String _getStringFromThemeMode(ThemeMode mode) {
    switch (mode) {
      case ThemeMode.light:
        return 'light';
      case ThemeMode.dark:
        return 'dark';
      default:
        return 'system';
    }
  }
} 