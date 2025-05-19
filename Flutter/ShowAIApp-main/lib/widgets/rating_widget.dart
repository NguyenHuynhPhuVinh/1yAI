import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../theme/app_theme.dart';

class RatingWidget extends StatefulWidget {
  final String websiteId;
  final double initialRating;
  final Function(double) onRatingUpdate;
  final VoidCallback onRatingStart;

  const RatingWidget({
    super.key,
    required this.websiteId,
    required this.initialRating,
    required this.onRatingUpdate,
    required this.onRatingStart,
  });

  @override
  State<RatingWidget> createState() => _RatingWidgetState();
}

class _RatingWidgetState extends State<RatingWidget> {
  double? userRating;
  bool canRate = true;
  bool isLoading = false;
  final _auth = FirebaseAuth.instance;
  final _firestore = FirebaseFirestore.instance;

  @override
  void initState() {
    super.initState();
    _checkUserRating();
  }

  Future<void> _checkUserRating() async {
    final user = _auth.currentUser;
    if (user != null) {
      try {
        final doc = await _firestore.collection('users').doc(user.uid).get();
        if (doc.exists) {
          final ratedWebsites =
              doc.data()?['ratedWebsites'] as Map<String, dynamic>?;
          if (ratedWebsites != null &&
              ratedWebsites.containsKey(widget.websiteId)) {
            setState(() {
              userRating = ratedWebsites[widget.websiteId].toDouble();
              canRate = false;
            });
          }
        }
      } catch (e) {
        print('Error checking rating status: $e');
      }
    }
  }

  Future<void> _handleRating(double rating) async {
    final user = _auth.currentUser;
    if (user == null) {
      _showSnackBar('Vui lòng đăng nhập để đánh giá');
      return;
    }

    setState(() => isLoading = true);
    widget.onRatingStart();

    try {
      final userDoc = _firestore.collection('users').doc(user.uid);
      await userDoc.update({
        'ratedWebsites.${widget.websiteId}': rating,
      });

      setState(() {
        userRating = rating;
        canRate = false;
      });

      widget.onRatingUpdate(rating);

      // Gọi API cập nhật rating
      await _updateRatingAPI(rating);
    } catch (e) {
      setState(() {
        userRating = null;
        canRate = true;
      });
      _showSnackBar('Có lỗi xảy ra: ${e.toString()}', isError: true);
    } finally {
      setState(() => isLoading = false);
    }
  }

  Future<void> _removeRating() async {
    final user = _auth.currentUser;
    if (user == null) return;

    setState(() => isLoading = true);

    try {
      final userDoc = _firestore.collection('users').doc(user.uid);
      await userDoc.update({
        'ratedWebsites.${widget.websiteId}': FieldValue.delete(),
      });

      setState(() {
        userRating = null;
        canRate = true;
      });

      widget.onRatingUpdate(0);

      // Gọi API xóa rating
      await _removeRatingAPI();
    } catch (e) {
      _showSnackBar('Có lỗi xảy ra: ${e.toString()}', isError: true);
    } finally {
      setState(() => isLoading = false);
    }
  }

  Future<void> _updateRatingAPI(double rating) async {
    try {
      final response = await http.post(
        Uri.parse('https://showai.io.vn/api/updateRating'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'websiteId': widget.websiteId,
          'userId': _auth.currentUser?.uid,
          'rating': rating,
        }),
      );

      if (response.statusCode != 200) {
        throw Exception('Failed to update rating');
      }
    } catch (e) {
      print('Error updating rating API: $e');
    }
  }

  Future<void> _removeRatingAPI() async {
    try {
      final response = await http.post(
        Uri.parse('https://showai.io.vn/api/removeRating'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'websiteId': widget.websiteId,
          'userId': _auth.currentUser?.uid,
        }),
      );

      if (response.statusCode != 200) {
        throw Exception('Failed to remove rating');
      }
    } catch (e) {
      print('Error removing rating API: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Text(
              'Đánh giá',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: AppTheme.primaryColor,
              ),
            ),
            const SizedBox(width: 8),
            Icon(
              Icons.star,
              color: Colors.amber[400],
              size: 20,
            ),
            const SizedBox(width: 4),
            Text(
              widget.initialRating.toStringAsFixed(1),
              style: TextStyle(
                color: AppTheme.secondaryTextColor,
              ),
            ),
          ],
        ),
        const SizedBox(height: 8),
        Row(
          children: [
            ...List.generate(5, (index) {
              final starRating = index + 1;
              return GestureDetector(
                onTap: canRate && !isLoading
                    ? () => _handleRating(starRating.toDouble())
                    : null,
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 2),
                  child: Icon(
                    Icons.star,
                    size: 32,
                    color: userRating != null && starRating <= userRating!
                        ? Colors.amber
                        : AppTheme.secondaryTextColor.withOpacity(0.3),
                  ),
                ),
              );
            }),
            if (!canRate) ...[
              const SizedBox(width: 16),
              IconButton(
                onPressed: !isLoading ? _removeRating : null,
                icon: Icon(
                  Icons.delete,
                  color: Colors.red.shade400,
                  size: 24,
                ),
                padding: EdgeInsets.zero,
                constraints: const BoxConstraints(),
                splashRadius: 24,
              ),
            ],
          ],
        ),
        if (isLoading)
          Padding(
            padding: const EdgeInsets.only(top: 8),
            child: CircularProgressIndicator(
              strokeWidth: 2,
              color: AppTheme.primaryColor,
            ),
          ),
      ],
    );
  }

  void _showSnackBar(String message, {bool isError = false}) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          message,
          style: const TextStyle(color: AppTheme.textColor),
        ),
        backgroundColor: isError ? Colors.red : AppTheme.cardColor,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
      ),
    );
  }
}
