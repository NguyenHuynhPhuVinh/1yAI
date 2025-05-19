import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../theme/app_theme.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final _formKey = GlobalKey<FormState>();
  bool _isLogin = true;
  bool _agreeToTerms = false;
  String _error = '';

  final _usernameController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();

  Future<void> _handleEmailAuth() async {
    if (!_agreeToTerms) {
      setState(() {
        _error = 'Vui lòng đồng ý với điều khoản và chính sách bảo mật';
      });
      return;
    }

    if (_formKey.currentState!.validate()) {
      try {
        final email = '${_usernameController.text}@gmail.com';
        if (_isLogin) {
          await FirebaseAuth.instance.signInWithEmailAndPassword(
            email: email,
            password: _passwordController.text,
          );
        } else {
          final userCredential =
              await FirebaseAuth.instance.createUserWithEmailAndPassword(
            email: email,
            password: _passwordController.text,
          );

          await FirebaseFirestore.instance
              .collection('users')
              .doc(userCredential.user!.uid)
              .set({
            'email': email,
            'username': _usernameController.text,
            'displayName': 'User${userCredential.user!.uid}',
          });
        }
      } on FirebaseAuthException catch (e) {
        setState(() {
          _error = _getErrorMessage(e.code);
        });
      }
    }
  }

  Future<void> _handleGoogleAuth() async {
    if (!_agreeToTerms) {
      setState(() {
        _error = 'Vui lòng đồng ý với điều khoản và chính sách bảo mật';
      });
      return;
    }

    try {
      final GoogleSignIn googleSignIn = GoogleSignIn();

      await googleSignIn.signOut();

      final GoogleSignInAccount? googleUser = await googleSignIn.signIn();

      if (googleUser == null) {
        setState(() {
          _error = 'Đăng nhập Google bị hủy';
        });
        return;
      }

      final GoogleSignInAuthentication googleAuth =
          await googleUser.authentication;

      final AuthCredential credential = GoogleAuthProvider.credential(
        accessToken: googleAuth.accessToken,
        idToken: googleAuth.idToken,
      );

      final UserCredential userCredential =
          await FirebaseAuth.instance.signInWithCredential(credential);

      final userDoc = await FirebaseFirestore.instance
          .collection('users')
          .doc(userCredential.user!.uid)
          .get();

      if (!userDoc.exists) {
        await FirebaseFirestore.instance
            .collection('users')
            .doc(userCredential.user!.uid)
            .set({
          'email': userCredential.user!.email,
          'username': userCredential.user!.displayName,
          'displayName': userCredential.user!.displayName,
          'createdAt': FieldValue.serverTimestamp(),
        });
      }
    } on FirebaseAuthException catch (e) {
      print('Lỗi Firebase Auth: ${e.message}');
      setState(() {
        _error = 'Lỗi xác thực: ${e.message}';
      });
    } catch (e) {
      print('Lỗi không xác định: $e');
      setState(() {
        _error = 'Đã xảy ra lỗi khi đăng nhập với Google';
      });
    }
  }

  String _getErrorMessage(String code) {
    switch (code) {
      case 'user-not-found':
        return 'Tài khoản không tồn tại';
      case 'wrong-password':
        return 'Sai mật khẩu';
      case 'invalid-email':
        return 'Tài khoản không hợp lệ';
      case 'email-already-in-use':
        return 'Tài khoản đã được sử dụng';
      default:
        return 'Đã xảy ra lỗi trong quá trình xác thực';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.backgroundColor,
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Form(
              key: _formKey,
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    _isLogin ? 'Đăng nhập' : 'Đăng ký',
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.primaryColor,
                    ),
                  ),
                  const SizedBox(height: 24),
                  TextFormField(
                    controller: _usernameController,
                    style: TextStyle(color: AppTheme.textColor),
                    decoration: InputDecoration(
                      labelText: 'Tên đăng nhập',
                      labelStyle: TextStyle(color: AppTheme.secondaryTextColor),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: BorderSide(
                          color: AppTheme.primaryColor.withOpacity(0.3),
                        ),
                      ),
                      enabledBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: BorderSide(
                          color: AppTheme.primaryColor.withOpacity(0.3),
                        ),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: BorderSide(color: AppTheme.primaryColor),
                      ),
                      filled: true,
                      fillColor: AppTheme.cardColor,
                    ),
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Vui lòng nhập tên đăng nhập';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 16),
                  TextFormField(
                    controller: _passwordController,
                    style: TextStyle(color: AppTheme.textColor),
                    decoration: InputDecoration(
                      labelText: 'Mật khẩu',
                      labelStyle: TextStyle(color: AppTheme.secondaryTextColor),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: BorderSide(
                          color: AppTheme.primaryColor.withOpacity(0.3),
                        ),
                      ),
                      enabledBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: BorderSide(
                          color: AppTheme.primaryColor.withOpacity(0.3),
                        ),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: BorderSide(color: AppTheme.primaryColor),
                      ),
                      filled: true,
                      fillColor: AppTheme.cardColor,
                    ),
                    obscureText: true,
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Vui lòng nhập mật khẩu';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 16),
                  if (!_isLogin) ...[
                    TextFormField(
                      controller: _confirmPasswordController,
                      style: TextStyle(color: AppTheme.textColor),
                      decoration: InputDecoration(
                        labelText: 'Xác nhận mật khẩu',
                        labelStyle:
                            TextStyle(color: AppTheme.secondaryTextColor),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                          borderSide: BorderSide(
                            color: AppTheme.primaryColor.withOpacity(0.3),
                          ),
                        ),
                        enabledBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                          borderSide: BorderSide(
                            color: AppTheme.primaryColor.withOpacity(0.3),
                          ),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                          borderSide: BorderSide(color: AppTheme.primaryColor),
                        ),
                        filled: true,
                        fillColor: AppTheme.cardColor,
                      ),
                      obscureText: true,
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Vui lòng xác nhận mật khẩu';
                        }
                        if (value != _passwordController.text) {
                          return 'Mật khẩu không khớp';
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: 16),
                  ],
                  CheckboxListTile(
                    value: _agreeToTerms,
                    onChanged: (value) {
                      setState(() {
                        _agreeToTerms = value ?? false;
                      });
                    },
                    title: Text(
                      'Tôi đồng ý với điều khoản sử dụng',
                      style: TextStyle(color: AppTheme.textColor),
                    ),
                    checkColor: AppTheme.cardColor,
                    activeColor: AppTheme.primaryColor,
                  ),
                  if (_error.isNotEmpty)
                    Padding(
                      padding: const EdgeInsets.all(8.0),
                      child: Text(
                        _error,
                        style: const TextStyle(color: Colors.red),
                      ),
                    ),
                  const SizedBox(height: 24),
                  ElevatedButton(
                    onPressed: _handleEmailAuth,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppTheme.primaryColor,
                      foregroundColor: AppTheme.cardColor,
                      padding: const EdgeInsets.symmetric(
                        horizontal: 32,
                        vertical: 12,
                      ),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    child: Text(_isLogin ? 'Đăng nhập' : 'Đăng ký'),
                  ),
                  const SizedBox(height: 16),
                  ElevatedButton.icon(
                    onPressed: _handleGoogleAuth,
                    icon: const Icon(Icons.g_mobiledata),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppTheme.cardColor,
                      foregroundColor: AppTheme.primaryColor,
                      padding: const EdgeInsets.symmetric(
                        horizontal: 32,
                        vertical: 12,
                      ),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                        side: BorderSide(
                          color: AppTheme.primaryColor.withOpacity(0.3),
                        ),
                      ),
                    ),
                    label: const Text('Đăng nhập với Google'),
                  ),
                  const SizedBox(height: 16),
                  TextButton(
                    onPressed: () {
                      setState(() {
                        _isLogin = !_isLogin;
                        _error = '';
                      });
                    },
                    style: TextButton.styleFrom(
                      foregroundColor: AppTheme.primaryColor,
                    ),
                    child: Text(
                      _isLogin
                          ? 'Chưa có tài khoản? Đăng ký'
                          : 'Đã có tài khoản? Đăng nhập',
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
