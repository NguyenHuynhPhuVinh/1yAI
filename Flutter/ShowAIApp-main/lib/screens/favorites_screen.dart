import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../models/website.dart';
import '../widgets/website_card.dart';
import '../theme/app_theme.dart';

class FavoritesScreen extends StatefulWidget {
  const FavoritesScreen({super.key});

  @override
  State<FavoritesScreen> createState() => _FavoritesScreenState();
}

class _FavoritesScreenState extends State<FavoritesScreen> {
  List<Website> _favoriteWebsites = [];
  bool _isLoading = true;
  String _error = '';

  @override
  void initState() {
    super.initState();
    _loadFavoriteWebsites();
  }

  Future<void> _loadFavoriteWebsites() async {
    try {
      setState(() => _isLoading = true);

      final user = FirebaseAuth.instance.currentUser;
      if (user != null) {
        final userDoc = await FirebaseFirestore.instance
            .collection('users')
            .doc(user.uid)
            .get();

        if (userDoc.exists) {
          final List<dynamic> heartedIds =
              userDoc.data()?['heartedWebsites'] ?? [];

          if (heartedIds.isEmpty) {
            setState(() {
              _favoriteWebsites = [];
              _isLoading = false;
            });
            return;
          }

          final idsString = heartedIds.join(',');

          final response = await http.get(
            Uri.parse('https://showai.io.vn/api/showai?list=$idsString'),
          );

          if (response.statusCode == 200) {
            final data = json.decode(utf8.decode(response.bodyBytes));

            if (data['data'] != null) {
              final List<Website> websites = (data['data'] as List)
                  .map((item) => Website.fromJson(item))
                  .toList();

              setState(() {
                _favoriteWebsites = websites;
                _isLoading = false;
              });
            }
          } else {
            throw Exception('Failed to load favorites');
          }
        }
      }
    } catch (e) {
      setState(() {
        _isLoading = false;
        _error = 'Không thể tải danh sách yêu thích';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.backgroundColor,
      appBar: AppBar(
        backgroundColor: AppTheme.cardColor,
        elevation: 0,
        title: Text(
          'Yêu thích',
          style: TextStyle(
            color: AppTheme.textColor,
            fontWeight: FontWeight.bold,
          ),
        ),
        iconTheme: IconThemeData(color: AppTheme.primaryColor),
      ),
      body: _buildBody(),
    );
  }

  Widget _buildBody() {
    if (_isLoading) {
      return Center(
        child: CircularProgressIndicator(
          color: AppTheme.primaryColor,
          strokeWidth: 2,
        ),
      );
    }

    if (_error.isNotEmpty) {
      return Center(
        child: Text(
          _error,
          style: TextStyle(
            color: Colors.red,
            fontSize: 16,
          ),
          textAlign: TextAlign.center,
        ),
      );
    }

    if (_favoriteWebsites.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.favorite_border,
              size: 48,
              color: AppTheme.secondaryTextColor,
            ),
            const SizedBox(height: 16),
            Text(
              'Chưa có mục yêu thích nào',
              style: TextStyle(
                color: AppTheme.secondaryTextColor,
                fontSize: 16,
              ),
            ),
          ],
        ),
      );
    }

    final screenWidth = MediaQuery.of(context).size.width;
    final crossAxisCount = screenWidth > 1200
        ? 4
        : screenWidth > 800
            ? 3
            : 2;

    final padding = 16.0;
    final spacing = 16.0;
    final availableWidth =
        screenWidth - (padding * 2) - (spacing * (crossAxisCount - 1));
    final itemWidth = availableWidth / crossAxisCount;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Wrap(
        spacing: spacing,
        runSpacing: spacing,
        children: List.generate(
          _favoriteWebsites.length,
          (index) => SizedBox(
            width: itemWidth,
            child: Container(
              decoration: BoxDecoration(
                color: AppTheme.cardColor,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: AppTheme.primaryColor.withOpacity(0.3),
                ),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.1),
                    blurRadius: 8,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: WebsiteCard(
                  website: _favoriteWebsites[index], showDescription: false),
            ),
          ),
        ),
      ),
    );
  }
}
