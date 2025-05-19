import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../models/website.dart';
import '../widgets/website_card.dart';
import '../theme/app_theme.dart';

class SearchPage extends StatefulWidget {
  final String? initialSearchTerm;
  final bool isTagSearch;

  const SearchPage({
    Key? key,
    this.initialSearchTerm,
    this.isTagSearch = false,
  }) : super(key: key);

  @override
  State<SearchPage> createState() => _SearchPageState();
}

class _SearchPageState extends State<SearchPage> {
  final _searchController = TextEditingController();
  final _apiService = ApiService();
  List<Website> _websites = [];
  List<String> _allTags = [];
  bool _isLoading = false;
  String? _error;
  String _displayTerm = '';
  bool _isTagSearch = false;

  @override
  void initState() {
    super.initState();
    _loadInitialTags();
    if (widget.initialSearchTerm != null) {
      _performSearch(widget.initialSearchTerm!, isTag: widget.isTagSearch);
    }
  }

  Future<void> _loadInitialTags() async {
    try {
      final result = await _apiService.searchWebsites(query: '');
      setState(() {
        _allTags = List<String>.from(result['tags'] ?? []);
      });
    } catch (e) {
      // Xử lý lỗi nếu cần
      debugPrint('Không thể tải tags: $e');
    }
  }

  Future<void> _handleSearch(String term, {bool isTag = false}) async {
    if (term.trim().isEmpty) return;

    setState(() {
      _isLoading = true;
      _error = null;
      _displayTerm = term;
      _isTagSearch = isTag;
    });

    try {
      final result = await _apiService.searchWebsites(
        query: isTag ? null : term,
        tag: isTag ? term : null,
      );

      setState(() {
        _websites = result['websites'];
        _allTags = result['tags'];
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _error = e.toString();
        _isLoading = false;
      });
    }
  }

  void _performSearch(String searchTerm, {bool isTag = false}) {
    _handleSearch(searchTerm, isTag: isTag);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.backgroundColor,
      body: SafeArea(
        child: Column(
          children: [
            Container(
              color: AppTheme.cardColor,
              child: Row(
                children: [
                  IconButton(
                    icon: Icon(
                      Icons.arrow_back,
                      color: AppTheme.primaryColor,
                    ),
                    onPressed: () => Navigator.of(context).pop(),
                  ),
                  Expanded(
                    child: TextField(
                      controller: _searchController,
                      autofocus: true,
                      style: TextStyle(color: AppTheme.textColor),
                      decoration: InputDecoration(
                        hintText: 'Tìm kiếm công cụ AI...',
                        hintStyle:
                            TextStyle(color: AppTheme.secondaryTextColor),
                        border: InputBorder.none,
                        fillColor: AppTheme.cardColor,
                        filled: true,
                      ),
                      onSubmitted: (value) => _performSearch(value),
                    ),
                  ),
                ],
              ),
            ),
            Container(
              height: 48,
              decoration: BoxDecoration(
                color: AppTheme.cardColor,
                border: Border(
                  bottom: BorderSide(
                    color: AppTheme.primaryColor.withOpacity(0.3),
                  ),
                ),
              ),
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 16),
                itemCount: _allTags.length,
                itemBuilder: (context, index) => Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: Center(
                    child: ActionChip(
                      label: Text(
                        _allTags[index],
                        style: TextStyle(color: AppTheme.textColor),
                      ),
                      backgroundColor: AppTheme.cardColor,
                      side: BorderSide(
                        color: AppTheme.primaryColor.withOpacity(0.3),
                      ),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      onPressed: () =>
                          _handleSearch(_allTags[index], isTag: true),
                    ),
                  ),
                ),
              ),
            ),
            if (_displayTerm.isNotEmpty)
              Container(
                padding:
                    const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
                decoration: BoxDecoration(
                  color: AppTheme.cardColor,
                  border: Border(
                    bottom: BorderSide(
                      color: AppTheme.primaryColor.withOpacity(0.3),
                    ),
                  ),
                ),
                child: Text(
                  _isTagSearch
                      ? 'Kết quả của tag: $_displayTerm'
                      : 'Kết quả của: $_displayTerm',
                  style: TextStyle(
                    color: AppTheme.primaryColor,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            Expanded(
              child: _buildContent(),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildContent() {
    if (_isLoading) {
      return Center(
        child: CircularProgressIndicator(
          color: AppTheme.primaryColor,
        ),
      );
    }

    if (_error != null) {
      return Center(
        child: Text(
          _error!,
          style: const TextStyle(color: Colors.red),
          textAlign: TextAlign.center,
        ),
      );
    }

    if (_websites.isEmpty) {
      return Center(
        child: Text(
          'Không tìm thấy kết quả',
          style: TextStyle(color: AppTheme.secondaryTextColor),
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
          _websites.length,
          (index) => SizedBox(
            width: itemWidth,
            child: WebsiteCard(
              website: _websites[index],
              showDescription: false,
              onTagClick: (tag) => _handleSearch(tag, isTag: true),
            ),
          ),
        ),
      ),
    );
  }
}
