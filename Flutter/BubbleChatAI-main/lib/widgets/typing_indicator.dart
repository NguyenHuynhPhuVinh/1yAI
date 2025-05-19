import 'package:flutter/material.dart';

class TypingIndicator extends StatefulWidget {
  const TypingIndicator({super.key});

  @override
  State<TypingIndicator> createState() => _TypingIndicatorState();
}

class _TypingIndicatorState extends State<TypingIndicator> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late List<Animation<double>> _animations;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1200),
    )..repeat();

    _animations = List.generate(3, (index) {
      final start = index * 0.2;
      return Tween<double>(begin: 0.0, end: 1.0).animate(
        CurvedAnimation(
          parent: _controller,
          curve: Interval(start, start + 0.6, curve: Curves.easeInOut),
        ),
      );
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDarkMode = theme.brightness == Brightness.dark;
    
    final dotColor = isDarkMode
        ? theme.colorScheme.primary.withOpacity(0.8)
        : theme.colorScheme.primary.withOpacity(0.6);
    
    final textColor = isDarkMode
        ? theme.colorScheme.onSurface.withOpacity(0.7)
        : Colors.grey.shade600;
        
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          ...List.generate(3, (index) {
            return Padding(
              padding: const EdgeInsets.symmetric(horizontal: 2),
              child: AnimatedBuilder(
                animation: _animations[index],
                builder: (context, child) {
                  return Transform.translate(
                    offset: Offset(0, -4 * _animations[index].value),
                    child: Container(
                      width: 6,
                      height: 6,
                      decoration: BoxDecoration(
                        color: dotColor,
                        shape: BoxShape.circle,
                      ),
                    ),
                  );
                },
              ),
            );
          }),
          const SizedBox(width: 8),
          Text(
            'Đang suy nghĩ...',
            style: TextStyle(
              fontStyle: FontStyle.italic,
              color: textColor,
              fontSize: 14.0,
            ),
          ),
        ],
      ),
    );
  }
} 