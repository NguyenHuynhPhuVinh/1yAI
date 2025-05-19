import 'package:flutter/material.dart';
import '../models/website.dart';
import '../screens/website_detail_screen.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../theme/app_theme.dart';
import 'package:cached_network_image/cached_network_image.dart';

class WebsiteCard extends StatefulWidget {
  final Website website;
  final Function(String)? onTagClick;
  final bool showDescription;

  const WebsiteCard({
    super.key,
    required this.website,
    this.onTagClick,
    this.showDescription = false,
  });

  @override
  State<WebsiteCard> createState() => _WebsiteCardState();
}

class _WebsiteCardState extends State<WebsiteCard> {
  @override
  Widget build(BuildContext context) {
    return IntrinsicHeight(
      child: Card(
        clipBehavior: Clip.antiAlias,
        color: AppTheme.cardColor,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
          side: BorderSide(
            color: AppTheme.primaryColor.withOpacity(0.3),
          ),
        ),
        elevation: 4,
        child: InkWell(
          onTap: () async {
            setState(() {
              widget.website.view = (widget.website.view ?? 0) + 1;
            });

            try {
              await http.post(
                Uri.parse('https://showai.io.vn/api/incrementView'),
                headers: {'Content-Type': 'application/json'},
                body: json.encode({'id': widget.website.id}),
              );
            } catch (e) {
              print('Lỗi khi tăng lượt xem: $e');
            }

            if (!context.mounted) return;
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) =>
                    WebsiteDetailScreen(website: widget.website),
              ),
            );
          },
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              if (widget.website.image != null)
                AspectRatio(
                  aspectRatio: 16 / 9,
                  child: CachedNetworkImage(
                    imageUrl: widget.website.image!,
                    fit: BoxFit.cover,
                    placeholder: (context, url) => Container(
                      color: AppTheme.cardColor.withOpacity(0.5),
                      child: Center(
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          color: AppTheme.primaryColor,
                        ),
                      ),
                    ),
                    errorWidget: (context, url, error) => Container(
                      color: AppTheme.cardColor.withOpacity(0.5),
                      child: Icon(
                        Icons.image_not_supported,
                        color: AppTheme.secondaryTextColor,
                      ),
                    ),
                  ),
                ),
              Expanded(
                child: Padding(
                  padding: const EdgeInsets.all(12),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        widget.website.name,
                        style: TextStyle(
                          color: AppTheme.primaryColor,
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 8),
                      if (widget.showDescription)
                        Expanded(
                          child: Container(
                            constraints: const BoxConstraints(minHeight: 80),
                            child: Text(
                              widget.website.description.isNotEmpty
                                  ? widget.website.description.first
                                  : '',
                              style: TextStyle(
                                color: AppTheme.textColor,
                                fontSize: 13,
                                height: 1.3,
                              ),
                              maxLines: 3,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                        ),
                      const SizedBox(height: 8),
                      SizedBox(
                        height: 36,
                        child: ListView(
                          scrollDirection: Axis.horizontal,
                          children: widget.website.tags.map((tag) {
                            return Padding(
                              padding: const EdgeInsets.only(right: 4),
                              child: Chip(
                                label: Text(
                                  tag,
                                  style: TextStyle(
                                    fontSize: 12,
                                    color: AppTheme.textColor,
                                  ),
                                ),
                                backgroundColor:
                                    AppTheme.primaryColor.withOpacity(0.1),
                                side: BorderSide(
                                  color: AppTheme.primaryColor.withOpacity(0.3),
                                ),
                                materialTapTargetSize:
                                    MaterialTapTargetSize.shrinkWrap,
                                visualDensity: VisualDensity.compact,
                                deleteIcon: widget.onTagClick != null
                                    ? Icon(
                                        Icons.close,
                                        size: 14,
                                        color: AppTheme.primaryColor,
                                      )
                                    : null,
                                onDeleted: widget.onTagClick != null
                                    ? () => widget.onTagClick!(tag)
                                    : null,
                              ),
                            );
                          }).toList(),
                        ),
                      ),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          if (widget.website.view != null)
                            _buildStatItem(
                              Icons.remove_red_eye,
                              '${widget.website.view}',
                              AppTheme.secondaryTextColor,
                            ),
                          const SizedBox(width: 8),
                          if (widget.website.heart != null)
                            _buildStatItem(
                              Icons.favorite,
                              '${widget.website.heart}',
                              Colors.red,
                            ),
                          const SizedBox(width: 8),
                          if (widget.website.evaluation != null)
                            _buildStatItem(
                              Icons.star,
                              widget.website.evaluation!.toStringAsFixed(1),
                              Colors.amber,
                            ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStatItem(IconData icon, String value, Color color) {
    return Row(
      children: [
        Icon(icon, size: 14, color: color),
        const SizedBox(width: 2),
        Text(
          value,
          style: TextStyle(
            color: AppTheme.secondaryTextColor,
            fontSize: 12,
          ),
        ),
      ],
    );
  }
}
