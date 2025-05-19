import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../theme/app_theme.dart';

class ChangeDisplayNameScreen extends StatefulWidget {
  final String? currentDisplayName;

  const ChangeDisplayNameScreen({super.key, this.currentDisplayName});

  @override
  State<ChangeDisplayNameScreen> createState() =>
      _ChangeDisplayNameScreenState();
}

class _ChangeDisplayNameScreenState extends State<ChangeDisplayNameScreen> {
  final _formKey = GlobalKey<FormState>();
  final _displayNameController = TextEditingController();
  String _error = '';
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _displayNameController.text = widget.currentDisplayName ?? '';
  }

  Future<void> _updateDisplayName() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() {
      _isLoading = true;
      _error = '';
    });

    try {
      final user = FirebaseAuth.instance.currentUser;
      if (user != null) {
        // Cập nhật tên hiển thị trong Firestore
        await FirebaseFirestore.instance
            .collection('users')
            .doc(user.uid)
            .update({'displayName': _displayNameController.text});

        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Cập nhật tên thành công')),
          );
          Navigator.pop(context, _displayNameController.text);
        }
      }
    } catch (e) {
      setState(() {
        _error = 'Đã có lỗi xảy ra. Vui lòng thử lại';
      });
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.backgroundColor,
      appBar: AppBar(
        title: Text(
          'Đổi tên hiển thị',
          style: TextStyle(
            color: AppTheme.textColor,
            fontWeight: FontWeight.bold,
          ),
        ),
        backgroundColor: AppTheme.cardColor,
        elevation: 0,
        iconTheme: IconThemeData(color: AppTheme.primaryColor),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              TextFormField(
                controller: _displayNameController,
                style: TextStyle(color: AppTheme.textColor),
                decoration: InputDecoration(
                  labelText: 'Tên hiển thị',
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
                    return 'Vui lòng nhập tên hiển thị';
                  }
                  return null;
                },
              ),
              if (_error.isNotEmpty) ...[
                const SizedBox(height: 16),
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.red.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    _error,
                    style: TextStyle(
                      color: Colors.red[700],
                      fontSize: 14,
                    ),
                  ),
                ),
              ],
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: _isLoading ? null : _updateDisplayName,
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.primaryColor,
                  foregroundColor: AppTheme.cardColor,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  elevation: 0,
                ),
                child: _isLoading
                    ? SizedBox(
                        height: 20,
                        width: 20,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          valueColor: AlwaysStoppedAnimation<Color>(
                            AppTheme.cardColor,
                          ),
                        ),
                      )
                    : const Text(
                        'Cập nhật',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
