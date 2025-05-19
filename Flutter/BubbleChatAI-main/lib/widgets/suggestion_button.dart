import 'package:flutter/material.dart';

class SuggestionButton extends StatefulWidget {
  final String text;
  final IconData? icon;
  final Color iconColor;
  final VoidCallback onTap;

  const SuggestionButton({
    super.key,
    required this.text,
    required this.icon,
    required this.iconColor,
    required this.onTap,
  });

  @override
  State<SuggestionButton> createState() => _SuggestionButtonState();
}

class _SuggestionButtonState extends State<SuggestionButton> {
  bool _isPressed = false;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDarkMode = theme.brightness == Brightness.dark;
    
    final backgroundColor = isDarkMode
        ? theme.cardColor.withOpacity(0.8)
        : Colors.white;
    
    final borderColor = isDarkMode
        ? Colors.grey.shade800
        : Colors.grey.shade300;
    
    final textColor = isDarkMode
        ? theme.colorScheme.onSurface.withOpacity(0.9)
        : Colors.black54;
    
    return GestureDetector(
      onTap: () {
        widget.onTap();
        _playPressAnimation();
      },
      onTapDown: (_) => setState(() => _isPressed = true),
      onTapUp: (_) => setState(() => _isPressed = false),
      onTapCancel: () => setState(() => _isPressed = false),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 100),
        width: double.infinity,
        padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 14.0),
        decoration: BoxDecoration(
          border: Border.all(color: borderColor),
          borderRadius: BorderRadius.circular(24.0),
          color: _isPressed 
              ? (isDarkMode ? theme.colorScheme.surface : Colors.grey.shade100)
              : backgroundColor,
          boxShadow: _isPressed 
              ? null
              : [
                  BoxShadow(
                    color: isDarkMode 
                        ? Colors.black.withOpacity(0.2)
                        : Colors.grey.withOpacity(0.1),
                    blurRadius: 4,
                    offset: const Offset(0, 2),
                  ),
                ],
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          mainAxisSize: MainAxisSize.min,
          children: [
            if (widget.icon != null) ...[
              Icon(widget.icon, color: widget.iconColor, size: 20),
              const SizedBox(width: 8.0),
            ],
            Flexible(
              child: Text(
                widget.text,
                style: TextStyle(
                  fontSize: 16.0,
                  color: textColor,
                  fontWeight: FontWeight.w500,
                ),
                textAlign: TextAlign.center,
                overflow: TextOverflow.ellipsis,
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _playPressAnimation() {
    setState(() => _isPressed = true);
    Future.delayed(const Duration(milliseconds: 100), () {
      if (mounted) setState(() => _isPressed = false);
    });
  }
} 