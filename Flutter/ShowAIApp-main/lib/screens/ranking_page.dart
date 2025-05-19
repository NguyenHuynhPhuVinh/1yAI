import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../widgets/website_card.dart';
import '../models/website.dart';

class RankingPage extends StatefulWidget {
  const RankingPage({super.key});

  @override
  State<RankingPage> createState() => _RankingPageState();
}

class _RankingPageState extends State<RankingPage> {
  List<Map<String, dynamic>> viewRankings = [];
  List<Map<String, dynamic>> heartRankings = [];
  List<Map<String, dynamic>> starRankings = [];
  List<Map<String, dynamic>> evaluationRankings = [];
  bool isLoading = true;
  String activeTab = 'view';

  @override
  void initState() {
    super.initState();
    fetchAllRankings();
  }

  Future<void> fetchAllRankings() async {
    try {
      final viewResponse = await http
          .get(Uri.parse('https://showai.io.vn/api/showai?sort=view&limit=9'));
      final heartResponse = await http
          .get(Uri.parse('https://showai.io.vn/api/showai?sort=heart&limit=9'));
      final starResponse = await http
          .get(Uri.parse('https://showai.io.vn/api/showai?sort=star&limit=9'));
      final evaluationResponse = await http.get(
          Uri.parse('https://showai.io.vn/api/showai?sort=evaluation&limit=9'));

      if (!mounted) return;

      if (viewResponse.statusCode == 200 &&
          heartResponse.statusCode == 200 &&
          starResponse.statusCode == 200 &&
          evaluationResponse.statusCode == 200) {
        setState(() {
          try {
            viewRankings = List<Map<String, dynamic>>.from(
                json.decode(utf8.decode(viewResponse.bodyBytes))['data'] ?? []);
            heartRankings = List<Map<String, dynamic>>.from(
                json.decode(utf8.decode(heartResponse.bodyBytes))['data'] ??
                    []);
            starRankings = List<Map<String, dynamic>>.from(
                json.decode(utf8.decode(starResponse.bodyBytes))['data'] ?? []);
            evaluationRankings = List<Map<String, dynamic>>.from(json.decode(
                    utf8.decode(evaluationResponse.bodyBytes))['data'] ??
                []);
          } catch (e) {
            print('Lỗi khi parse dữ liệu: $e');
          }
          isLoading = false;
        });
      } else {
        throw Exception('Lỗi khi tải dữ liệu: ${viewResponse.statusCode}');
      }
    } catch (e) {
      if (!mounted) return;
      setState(() {
        print('Lỗi khi tải bảng xếp hạng: $e');
        isLoading = false;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  String _getRankingTitle(int index) {
    switch (index) {
      case 0:
        return 'Bảng Xếp Hạng Lượt Xem';
      case 1:
        return 'Bảng Xếp Hạng Yêu Thích';
      case 2:
        return 'Bảng Xếp Hạng Phổ Biến';
      case 3:
        return 'Bảng Xếp Hạng Đánh Giá';
      default:
        return 'Bảng Xếp Hạng';
    }
  }

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    final isMobile = screenWidth < 600;

    return DefaultTabController(
      length: 4,
      child: Builder(
        builder: (context) {
          final TabController tabController = DefaultTabController.of(context);
          tabController.addListener(() {
            if (!tabController.indexIsChanging) {
              setState(() {});
            }
          });

          return Scaffold(
            backgroundColor: AppTheme.backgroundColor,
            appBar: AppBar(
              title: Text(_getRankingTitle(tabController.index)),
              bottom: TabBar(
                isScrollable: isMobile,
                indicatorColor: AppTheme.primaryColor,
                labelColor: AppTheme.primaryColor,
                unselectedLabelColor: AppTheme.secondaryTextColor,
                tabs: [
                  Tab(
                    icon: Icon(
                      Icons.visibility,
                      color: const Color(0xFF1E90FF), // Dodger Blue
                    ),
                    text: isMobile ? null : 'Lượt xem',
                    iconMargin: isMobile
                        ? EdgeInsets.zero
                        : const EdgeInsets.only(bottom: 4),
                  ),
                  Tab(
                    icon: Icon(
                      Icons.favorite,
                      color: const Color(0xFFFF69B4), // Hot Pink
                    ),
                    text: isMobile ? null : 'Yêu thích',
                    iconMargin: isMobile
                        ? EdgeInsets.zero
                        : const EdgeInsets.only(bottom: 4),
                  ),
                  Tab(
                    icon: Icon(
                      Icons.star,
                      color: const Color(0xFFFFD700), // Gold
                    ),
                    text: isMobile ? null : 'Phổ biến',
                    iconMargin: isMobile
                        ? EdgeInsets.zero
                        : const EdgeInsets.only(bottom: 4),
                  ),
                  Tab(
                    icon: Icon(
                      Icons.thumb_up,
                      color: const Color(0xFF32CD32), // Lime Green
                    ),
                    text: isMobile ? null : 'Đánh giá',
                    iconMargin: isMobile
                        ? EdgeInsets.zero
                        : const EdgeInsets.only(bottom: 4),
                  ),
                ],
              ),
            ),
            body: TabBarView(
              children: [
                _buildRankingList(viewRankings),
                _buildRankingList(heartRankings),
                _buildRankingList(starRankings),
                _buildRankingList(evaluationRankings),
              ],
            ),
          );
        },
      ),
    );
  }

  Color _getRankingIconColor(String type) {
    switch (type) {
      case 'view':
        return const Color(0xFF1E90FF); // Dodger Blue
      case 'heart':
        return const Color(0xFFFF69B4); // Hot Pink
      case 'star':
        return const Color(0xFFFFD700); // Gold
      case 'evaluation':
        return const Color(0xFF32CD32); // Lime Green
      default:
        return AppTheme.primaryColor;
    }
  }

  Widget _buildRankingList(List<Map<String, dynamic>> rankings) {
    final screenWidth = MediaQuery.of(context).size.width;
    final isMobile = screenWidth < 600;

    if (isLoading) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            CircularProgressIndicator(color: AppTheme.primaryColor),
            const SizedBox(height: 16),
            Text(
              'Đang tải dữ liệu...',
              style: TextStyle(color: AppTheme.textColor),
            ),
          ],
        ),
      );
    }

    if (rankings.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.warning, size: 48, color: AppTheme.primaryColor),
            const SizedBox(height: 16),
            Text(
              'Chưa có dữ liệu',
              style: TextStyle(color: AppTheme.textColor),
            ),
            const SizedBox(height: 8),
            ElevatedButton(
              onPressed: fetchAllRankings,
              style: ElevatedButton.styleFrom(
                backgroundColor: AppTheme.primaryColor,
                foregroundColor: AppTheme.textColor,
              ),
              child: Text('Thử lại'),
            ),
          ],
        ),
      );
    }

    // Tính toán số cột và chiều rộng của mỗi item
    int crossAxisCount = screenWidth > 1200
        ? 4
        : screenWidth > 800
            ? 3
            : screenWidth > 600
                ? 2
                : 1;

    double padding = isMobile ? 8.0 : 16.0;
    double spacing = isMobile ? 8.0 : 16.0;
    double availableWidth =
        screenWidth - (padding * 2) - (spacing * (crossAxisCount - 1));
    double itemWidth = availableWidth / crossAxisCount;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Wrap(
        spacing: spacing,
        runSpacing: spacing,
        children: List.generate(
          rankings.length,
          (index) => SizedBox(
            width: itemWidth,
            child: Stack(
              children: [
                Container(
                  margin: EdgeInsets.all(isMobile ? 4 : 8),
                  decoration: BoxDecoration(
                    color: AppTheme.cardColor,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: AppTheme.primaryColor.withOpacity(0.3),
                    ),
                  ),
                  child: WebsiteCard(
                    website: Website.fromJson(rankings[index]),
                    showDescription: true,
                  ),
                ),
                if (index < 3)
                  Positioned(
                    top: isMobile ? 12 : 16,
                    left: isMobile ? 12 : 16,
                    child: Container(
                      padding: EdgeInsets.symmetric(
                        horizontal: isMobile ? 6 : 8,
                        vertical: isMobile ? 3 : 4,
                      ),
                      decoration: BoxDecoration(
                        color: _getRankingColor(index),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(
                            Icons.emoji_events,
                            color: Colors.white,
                            size: isMobile ? 14 : 16,
                          ),
                          SizedBox(width: isMobile ? 2 : 4),
                          Text(
                            'TOP ${index + 1}',
                            style: TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.bold,
                              fontSize: isMobile ? 12 : 14,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Color _getRankingColor(int index) {
    switch (index) {
      case 0:
        return const Color(0xFFFFD700); // Vàng
      case 1:
        return const Color(0xFFC0C0C0); // Bạc
      case 2:
        return const Color(0xFFCD7F32); // Đồng
      default:
        return const Color(0xFF4169E1); // Royal Blue
    }
  }
}
