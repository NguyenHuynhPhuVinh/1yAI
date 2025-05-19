import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'dart:async';
import 'package:flutter/services.dart';
import 'change_password_screen.dart';
import 'delete_account_screen.dart';
import 'favorites_screen.dart';
import 'change_display_name_screen.dart';
import '../theme/app_theme.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../services/banner_state.dart';

class AccountPage extends StatefulWidget {
  const AccountPage({super.key});

  @override
  State<AccountPage> createState() => _AccountPageState();
}

class _AccountPageState extends State<AccountPage> {
  String? _displayName;
  String _error = '';
  bool _isLoading = true;
  bool _isGoogleUser = false;
  bool _showBanner = true;

  @override
  void initState() {
    super.initState();
    _loadUserData();
    _checkAuthProvider();
    _loadBannerPreference();
  }

  void _checkAuthProvider() {
    final user = FirebaseAuth.instance.currentUser;
    if (user != null) {
      setState(() {
        _isGoogleUser =
            user.providerData.any((info) => info.providerId == 'google.com');
      });
    }
  }

  Future<void> _loadUserData() async {
    try {
      final user = FirebaseAuth.instance.currentUser;
      if (user != null) {
        final userDoc = await FirebaseFirestore.instance
            .collection('users')
            .doc(user.uid)
            .get();

        if (userDoc.exists) {
          setState(() {
            _displayName = userDoc.data()?['displayName'];
            _isLoading = false;
          });
        }
      }
    } catch (e) {
      setState(() {
        _error = 'Lỗi khi tải thông tin người dùng';
        _isLoading = false;
      });
    }
  }

  Future<void> _handleSignOut() async {
    try {
      await FirebaseAuth.instance.signOut();
    } catch (e) {
      setState(() {
        _error = 'Lỗi khi đăng xuất';
      });
    }
  }

  Future<void> _loadBannerPreference() async {
    final prefs = await SharedPreferences.getInstance();
    final showBanner = prefs.getBool('show_banner') ?? true;
    setState(() {
      _showBanner = showBanner;
    });
    BannerState.showBanner.value = showBanner;
  }

  Future<void> _toggleBanner(bool value) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('show_banner', value);
    setState(() {
      _showBanner = value;
    });
    BannerState.showBanner.value = value;
  }

  Widget _buildInfoTab() {
    return ListView(
      padding: const EdgeInsets.only(top: 8),
      children: [
        Card(
          margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
          color: AppTheme.cardColor,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
            side: BorderSide(
              color: AppTheme.primaryColor.withOpacity(0.1),
            ),
          ),
          elevation: 0,
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Icon(Icons.person, color: AppTheme.primaryColor),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Text(
                        _displayName ?? 'Người dùng',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.textColor,
                        ),
                        softWrap: true,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 8),
        Container(
          margin: const EdgeInsets.symmetric(horizontal: 16),
          decoration: BoxDecoration(
            color: AppTheme.cardColor,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: AppTheme.primaryColor.withOpacity(0.1),
            ),
          ),
          child: Column(
            children: [
              ListTile(
                leading: Icon(Icons.edit, color: AppTheme.primaryColor),
                title: Text(
                  'Đổi tên hiển thị',
                  style: TextStyle(color: AppTheme.textColor),
                ),
                trailing: Icon(
                  Icons.chevron_right,
                  color: AppTheme.secondaryTextColor,
                ),
                onTap: () async {
                  final newName = await Navigator.push<String>(
                    context,
                    MaterialPageRoute(
                      builder: (context) => ChangeDisplayNameScreen(
                        currentDisplayName: _displayName,
                      ),
                    ),
                  );
                  if (newName != null) {
                    setState(() => _displayName = newName);
                  }
                },
              ),
              Divider(
                height: 1,
                indent: 16,
                endIndent: 16,
                color: AppTheme.primaryColor.withOpacity(0.1),
              ),
              ListTile(
                leading: Icon(Icons.favorite, color: AppTheme.primaryColor),
                title: Text(
                  'Yêu thích',
                  style: TextStyle(color: AppTheme.textColor),
                ),
                trailing: Icon(
                  Icons.chevron_right,
                  color: AppTheme.secondaryTextColor,
                ),
                onTap: () => Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => const FavoritesScreen(),
                  ),
                ),
              ),
              if (!_isGoogleUser) ...[
                Divider(
                  height: 1,
                  indent: 16,
                  endIndent: 16,
                  color: AppTheme.primaryColor.withOpacity(0.1),
                ),
                ListTile(
                  leading: Icon(Icons.lock, color: AppTheme.primaryColor),
                  title: Text(
                    'Đổi mật khẩu',
                    style: TextStyle(color: AppTheme.textColor),
                  ),
                  trailing: Icon(
                    Icons.chevron_right,
                    color: AppTheme.secondaryTextColor,
                  ),
                  onTap: () => Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => const ChangePasswordScreen(),
                    ),
                  ),
                ),
              ],
              ListTile(
                leading: Icon(Icons.web, color: AppTheme.primaryColor),
                title: Text(
                  'Banner web',
                  style: TextStyle(color: AppTheme.textColor),
                ),
                trailing: Switch(
                  value: _showBanner,
                  onChanged: _toggleBanner,
                  activeColor: AppTheme.primaryColor,
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 8),
        Container(
          margin: const EdgeInsets.symmetric(horizontal: 16),
          decoration: BoxDecoration(
            color: AppTheme.cardColor,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: AppTheme.primaryColor.withOpacity(0.1),
            ),
          ),
          child: Column(
            children: [
              ListTile(
                leading: const Icon(Icons.delete_forever, color: Colors.red),
                title: const Text(
                  'Xóa tài khoản',
                  style: TextStyle(color: Colors.red),
                ),
                trailing: const Icon(
                  Icons.chevron_right,
                  color: Colors.red,
                ),
                onTap: () => Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => const DeleteAccountScreen(),
                  ),
                ),
              ),
              Divider(
                height: 1,
                indent: 16,
                endIndent: 16,
                color: AppTheme.primaryColor.withOpacity(0.1),
              ),
              ListTile(
                leading: Icon(Icons.logout, color: AppTheme.primaryColor),
                title: Text(
                  'Đăng xuất',
                  style: TextStyle(color: AppTheme.textColor),
                ),
                trailing: Icon(
                  Icons.chevron_right,
                  color: AppTheme.secondaryTextColor,
                ),
                onTap: _handleSignOut,
              ),
            ],
          ),
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.backgroundColor,
      body: _isLoading
          ? Center(
              child: CircularProgressIndicator(
                color: AppTheme.primaryColor,
                strokeWidth: 2,
              ),
            )
          : _buildInfoTab(),
    );
  }
}
