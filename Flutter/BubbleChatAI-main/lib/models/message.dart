class Message {
  final String text;
  final bool isUser;
  final List<String> images;
  final DateTime timestamp;

  Message({
    required this.text,
    required this.isUser,
    this.images = const [],
    DateTime? timestamp,
  }) : timestamp = timestamp ?? DateTime.now();

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is Message &&
          runtimeType == other.runtimeType &&
          text == other.text &&
          isUser == other.isUser &&
          images == other.images;

  @override
  int get hashCode => text.hashCode ^ isUser.hashCode ^ images.hashCode;
} 