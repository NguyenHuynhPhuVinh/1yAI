import 'message.dart';

class ChatHistory {
  final String id;
  final String title;
  final DateTime createdAt;
  final DateTime lastUpdatedAt;
  final List<Message> messages;
  final String? systemInstruction;

  ChatHistory({
    required this.id,
    required this.title,
    required this.createdAt,
    required this.lastUpdatedAt,
    required this.messages,
    this.systemInstruction,
  });

  factory ChatHistory.create(String title, Message firstMessage, {String? systemInstruction}) {
    final now = DateTime.now();
    return ChatHistory(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      title: title,
      createdAt: now,
      lastUpdatedAt: now,
      messages: [firstMessage],
      systemInstruction: systemInstruction,
    );
  }

  ChatHistory copyWith({
    String? id,
    String? title,
    DateTime? createdAt,
    DateTime? lastUpdatedAt,
    List<Message>? messages,
    String? systemInstruction,
  }) {
    return ChatHistory(
      id: id ?? this.id,
      title: title ?? this.title,
      createdAt: createdAt ?? this.createdAt,
      lastUpdatedAt: lastUpdatedAt ?? this.lastUpdatedAt,
      messages: messages ?? this.messages,
      systemInstruction: systemInstruction ?? this.systemInstruction,
    );
  }

  ChatHistory addMessage(Message message) {
    final updatedMessages = List<Message>.from(messages)..add(message);
    return copyWith(
      lastUpdatedAt: DateTime.now(),
      messages: updatedMessages,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'createdAt': createdAt.toIso8601String(),
      'lastUpdatedAt': lastUpdatedAt.toIso8601String(),
      'messages': messages.map((m) => {
        'text': m.text,
        'isUser': m.isUser,
        'images': m.images,
        'timestamp': m.timestamp.toIso8601String(),
      }).toList(),
      'systemInstruction': systemInstruction,
    };
  }

  factory ChatHistory.fromJson(Map<String, dynamic> json) {
    return ChatHistory(
      id: json['id'],
      title: json['title'],
      createdAt: DateTime.parse(json['createdAt']),
      lastUpdatedAt: DateTime.parse(json['lastUpdatedAt']),
      messages: (json['messages'] as List).map((m) => Message(
        text: m['text'],
        isUser: m['isUser'],
        images: m['images'] != null ? List<String>.from(m['images']) : [],
        timestamp: DateTime.parse(m['timestamp']),
      )).toList(),
      systemInstruction: json['systemInstruction'],
    );
  }
} 