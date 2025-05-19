class Comment {
  final String id;
  final String uid;
  final String user;
  final String text;
  final String date;
  List<Comment>? replies;
  final String? parentId;
  final String? replyToId;

  Comment({
    required this.id,
    required this.uid,
    required this.user,
    required this.text,
    required this.date,
    this.replies,
    this.parentId,
    this.replyToId,
  });

  factory Comment.fromJson(Map<String, dynamic> json) {
    return Comment(
      id: json['id']?.toString() ?? '',
      uid: json['uid']?.toString() ?? '',
      user: json['user']?.toString() ?? '',
      text: json['text']?.toString() ?? '',
      date: json['date']?.toString() ?? DateTime.now().toIso8601String(),
      replies: json['replies'] != null
          ? (json['replies'] as List)
              .map((e) => Comment.fromJson(Map<String, dynamic>.from(e)))
              .toList()
          : null,
      parentId: json['parentId']?.toString(),
      replyToId: json['replyToId']?.toString(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'uid': uid,
      'user': user,
      'text': text,
      'date': date,
      'replies': replies?.map((r) => r.toJson()).toList(),
      'parentId': parentId,
      'replyToId': replyToId,
    };
  }
}
