import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../models/comment.dart';
import '../theme/app_theme.dart';

class CommentsWidget extends StatefulWidget {
  final String websiteId;
  final List<Comment> initialComments;
  final User? user;

  const CommentsWidget({
    super.key,
    required this.websiteId,
    required this.initialComments,
    this.user,
  });

  @override
  State<CommentsWidget> createState() => _CommentsWidgetState();
}

class _CommentsWidgetState extends State<CommentsWidget> {
  final TextEditingController _commentController = TextEditingController();
  final TextEditingController _replyController = TextEditingController();
  final TextEditingController _editController = TextEditingController();

  List<Comment> comments = [];
  bool isLoading = false;
  String? editingCommentId;
  String? replyingTo;
  String? errorMessage;
  String? userDisplayName;

  @override
  void initState() {
    super.initState();
    comments = widget.initialComments;
    _fetchUserDisplayName();
  }

  Future<void> _fetchUserDisplayName() async {
    if (widget.user != null) {
      final userDoc = await FirebaseFirestore.instance
          .collection('users')
          .doc(widget.user!.uid)
          .get();

      if (userDoc.exists) {
        setState(() {
          userDisplayName = userDoc.get('displayName');
        });
      }
    }
  }

  Future<bool> _validateContent(String content) async {
    // Thêm logic kiểm tra nội dung ở đây
    return true; // Tạm thời return true
  }

  Future<void> _handleCommentSubmit() async {
    if (widget.user == null) {
      // Xử lý chuyển hướng đến trang đăng nhập
      return;
    }

    setState(() {
      isLoading = true;
      errorMessage = null;
    });

    final isValid = await _validateContent(_commentController.text);

    if (!isValid) {
      setState(() {
        errorMessage = "Bình luận không phù hợp";
        isLoading = false;
      });
      return;
    }

    try {
      final newComment = Comment(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        uid: widget.user!.uid,
        user: userDisplayName ?? 'Anonymous',
        text: _commentController.text,
        date: DateTime.now().toIso8601String(),
      );

      setState(() {
        comments.insert(0, newComment);
        _commentController.clear();
      });

      // Gọi API để lưu comment
      final response = await http.post(
        Uri.parse('https://showai.io.vn/api/comments'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'websiteId': widget.websiteId,
          'comment': {
            'id': newComment.id,
            'uid': newComment.uid,
            'user': newComment.user,
            'text': newComment.text,
            'date': newComment.date,
          }
        }),
      );

      if (response.statusCode != 200) {
        throw Exception('Lỗi khi thêm bình luận');
      }
    } catch (e) {
      setState(() {
        errorMessage = e.toString();
        comments.removeAt(0); // Hoàn tác thay đổi nếu có lỗi
      });
    } finally {
      setState(() {
        isLoading = false;
      });
    }
  }

  Widget _buildCommentCard(Comment comment,
      {bool isReply = false, String? parentId}) {
    return Card(
      margin: EdgeInsets.only(
        left: isReply ? 16 : 0,
        bottom: 8,
        right: 0,
      ),
      color: AppTheme.cardColor,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(
          color: AppTheme.primaryColor.withOpacity(0.3),
        ),
      ),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        comment.user,
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 13,
                          color: AppTheme.primaryColor,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        _formatDate(comment.date),
                        style: TextStyle(
                          fontSize: 11,
                          color: AppTheme.secondaryTextColor,
                        ),
                      ),
                    ],
                  ),
                ),
                if (widget.user?.uid == comment.uid)
                  Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      IconButton(
                        icon: const Icon(Icons.edit, size: 16),
                        onPressed: () => _startEditing(comment),
                        padding: const EdgeInsets.all(4),
                        constraints: const BoxConstraints(),
                        color: AppTheme.primaryColor,
                      ),
                      const SizedBox(width: 8),
                      IconButton(
                        icon: const Icon(Icons.delete, size: 16),
                        onPressed: () =>
                            _deleteComment(comment, parentId: parentId),
                        padding: const EdgeInsets.all(4),
                        constraints: const BoxConstraints(),
                        color: Colors.red,
                      ),
                    ],
                  ),
              ],
            ),
            const SizedBox(height: 8),
            if (editingCommentId == comment.id)
              _buildEditForm(comment, parentId: parentId)
            else
              Text(
                comment.text,
                style: TextStyle(
                  fontSize: 14,
                  color: AppTheme.textColor,
                ),
              ),
            if (widget.user != null &&
                !isReply &&
                editingCommentId != comment.id)
              Align(
                alignment: Alignment.centerLeft,
                child: TextButton(
                  onPressed: () => _startReplying(comment),
                  style: TextButton.styleFrom(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 0, vertical: 4),
                    minimumSize: const Size(0, 30),
                  ),
                  child: const Text(
                    'Trả lời',
                    style: TextStyle(fontSize: 12),
                  ),
                ),
              ),
            if (replyingTo == comment.id)
              Padding(
                padding: const EdgeInsets.only(top: 8),
                child: _buildReplyForm(comment),
              ),
            if (comment.replies != null && comment.replies!.isNotEmpty)
              Padding(
                padding: const EdgeInsets.only(top: 8),
                child: Column(
                  children: comment.replies!
                      .map((reply) => _buildCommentCard(
                            reply,
                            isReply: true,
                            parentId: comment.id,
                          ))
                      .toList(),
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildEditForm(Comment comment, {String? parentId}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        TextField(
          controller: _editController,
          maxLines: 3,
          style: TextStyle(fontSize: 14, color: AppTheme.textColor),
          decoration: InputDecoration(
            contentPadding: const EdgeInsets.all(8),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide:
                  BorderSide(color: AppTheme.primaryColor.withOpacity(0.3)),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: BorderSide(color: AppTheme.primaryColor),
            ),
            fillColor: AppTheme.cardColor,
            filled: true,
            hintText: 'Chỉnh sửa bình luận...',
            hintStyle: TextStyle(
              fontSize: 13,
              color: AppTheme.secondaryTextColor,
            ),
          ),
        ),
        const SizedBox(height: 8),
        Row(
          children: [
            TextButton(
              onPressed: () => _handleEditSubmit(comment, parentId: parentId),
              style: TextButton.styleFrom(
                padding:
                    const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                minimumSize: const Size(0, 30),
              ),
              child: Text(
                isLoading ? 'Đang lưu...' : 'Lưu',
                style: const TextStyle(fontSize: 12),
              ),
            ),
            const SizedBox(width: 8),
            TextButton(
              onPressed: _cancelEditing,
              style: TextButton.styleFrom(
                padding:
                    const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                minimumSize: const Size(0, 30),
              ),
              child: const Text('Hủy', style: TextStyle(fontSize: 12)),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildReplyForm(Comment parentComment) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        TextField(
          controller: _replyController,
          maxLines: 3,
          style: const TextStyle(fontSize: 14),
          decoration: InputDecoration(
            contentPadding: const EdgeInsets.all(8),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
            ),
            hintText: 'Viết câu trả lời...',
            hintStyle: TextStyle(fontSize: 13, color: Colors.grey[400]),
          ),
        ),
        const SizedBox(height: 8),
        Row(
          children: [
            TextButton(
              onPressed: () => _handleReplySubmit(parentComment),
              style: TextButton.styleFrom(
                padding:
                    const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                minimumSize: const Size(0, 30),
              ),
              child: Text(
                isLoading ? 'Đang gửi...' : 'Gửi',
                style: const TextStyle(fontSize: 12),
              ),
            ),
            const SizedBox(width: 8),
            TextButton(
              onPressed: _cancelReplying,
              style: TextButton.styleFrom(
                padding:
                    const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                minimumSize: const Size(0, 30),
              ),
              child: const Text('Hủy', style: TextStyle(fontSize: 12)),
            ),
          ],
        ),
      ],
    );
  }

  void _startEditing(Comment comment) {
    setState(() {
      editingCommentId = comment.id;
      _editController.text = comment.text;
    });
  }

  void _cancelEditing() {
    setState(() {
      editingCommentId = null;
      _editController.clear();
    });
  }

  void _startReplying(Comment comment) {
    setState(() {
      replyingTo = comment.id;
      _replyController.clear();
    });
  }

  void _cancelReplying() {
    setState(() {
      replyingTo = null;
      _replyController.clear();
    });
  }

  Future<void> _handleEditSubmit(Comment comment, {String? parentId}) async {
    if (!await _validateContent(_editController.text)) {
      setState(() {
        errorMessage = "Nội dung không phù hợp";
      });
      return;
    }

    setState(() => isLoading = true);

    try {
      final response = await http.put(
        Uri.parse('https://showai.io.vn/api/comments'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'websiteId': widget.websiteId,
          'commentId': parentId == null ? comment.id : null,
          'parentId': parentId,
          'replyId': parentId != null ? comment.id : null,
          'text': _editController.text,
        }),
      );

      if (response.statusCode == 200) {
        setState(() {
          comments = comments.map((c) {
            if (parentId != null) {
              // Nếu đang sửa reply
              if (c.id == parentId) {
                final updatedReplies = c.replies?.map((r) {
                  if (r.id == comment.id) {
                    return Comment(
                      id: r.id,
                      uid: r.uid,
                      user: r.user,
                      text: _editController.text,
                      date: r.date,
                      parentId: r.parentId,
                    );
                  }
                  return r;
                }).toList();
                return Comment(
                  id: c.id,
                  uid: c.uid,
                  user: c.user,
                  text: c.text,
                  date: c.date,
                  replies: updatedReplies,
                );
              }
            } else {
              // Nếu đang sửa comment gốc
              if (c.id == comment.id) {
                return Comment(
                  id: c.id,
                  uid: c.uid,
                  user: c.user,
                  text: _editController.text,
                  date: c.date,
                  replies: c.replies,
                );
              }
            }
            return c;
          }).toList();
          editingCommentId = null;
          _editController.clear();
        });
      } else {
        throw Exception('Lỗi khi cập nhật bình luận');
      }
    } catch (e) {
      setState(() => errorMessage = e.toString());
    } finally {
      setState(() => isLoading = false);
    }
  }

  Future<void> _handleReplySubmit(Comment parentComment) async {
    if (!await _validateContent(_replyController.text)) {
      setState(() {
        errorMessage = "Nội dung không phù hợp";
      });
      return;
    }

    setState(() => isLoading = true);

    try {
      final newReply = Comment(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        uid: widget.user!.uid,
        user: userDisplayName ?? 'Anonymous',
        text: _replyController.text,
        date: DateTime.now().toIso8601String(),
        parentId: parentComment.id,
      );

      setState(() {
        comments = comments.map((c) {
          if (c.id == parentComment.id) {
            final replies = c.replies ?? [];
            replies.add(newReply);
            return Comment(
              id: c.id,
              uid: c.uid,
              user: c.user,
              text: c.text,
              date: c.date,
              replies: replies,
            );
          }
          return c;
        }).toList();
        replyingTo = null;
        _replyController.clear();
      });

      final response = await http.post(
        Uri.parse('https://showai.io.vn/api/comments'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'websiteId': widget.websiteId,
          'parentId': parentComment.id,
          'comment': {
            'id': newReply.id,
            'uid': newReply.uid,
            'user': newReply.user,
            'text': newReply.text,
            'date': newReply.date,
            'parentId': parentComment.id,
          },
        }),
      );

      if (response.statusCode != 200) {
        throw Exception('Lỗi khi thêm trả lời');
      }
    } catch (e) {
      setState(() => errorMessage = e.toString());
    } finally {
      setState(() => isLoading = false);
    }
  }

  Future<void> _deleteComment(Comment comment, {String? parentId}) async {
    try {
      final response = await http.delete(
        Uri.parse('https://showai.io.vn/api/comments'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'websiteId': widget.websiteId,
          'commentId': parentId == null ? comment.id : null,
          'parentId': parentId,
          'replyId': parentId != null ? comment.id : null,
        }),
      );

      if (response.statusCode == 200) {
        setState(() {
          if (parentId != null) {
            // Xóa reply
            comments = comments.map((c) {
              if (c.id == parentId) {
                final updatedReplies =
                    c.replies?.where((r) => r.id != comment.id).toList();
                return Comment(
                  id: c.id,
                  uid: c.uid,
                  user: c.user,
                  text: c.text,
                  date: c.date,
                  replies: updatedReplies,
                );
              }
              return c;
            }).toList();
          } else {
            // Xóa comment gốc
            comments = comments.where((c) => c.id != comment.id).toList();
          }
        });
      } else {
        throw Exception('Lỗi khi xóa bình luận');
      }
    } catch (e) {
      setState(() => errorMessage = e.toString());
    }
  }

  String _formatDate(String date) {
    final DateTime dateTime = DateTime.parse(date);
    final DateTime now = DateTime.now();
    final Duration difference = now.difference(dateTime);

    if (difference.inDays > 0) {
      return '${difference.inDays} ngày trước';
    } else if (difference.inHours > 0) {
      return '${difference.inHours} giờ trước';
    } else if (difference.inMinutes > 0) {
      return '${difference.inMinutes} phút trước';
    } else {
      return 'Vừa xong';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(vertical: 16),
          child: Text(
            'Bình luận',
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: AppTheme.primaryColor,
            ),
          ),
        ),
        if (errorMessage != null)
          Padding(
            padding: const EdgeInsets.only(bottom: 8),
            child: Text(
              errorMessage!,
              style: const TextStyle(color: Colors.red),
            ),
          ),
        if (widget.user != null)
          Padding(
            padding: const EdgeInsets.only(bottom: 16),
            child: Column(
              children: [
                TextField(
                  controller: _commentController,
                  maxLines: 3,
                  style: TextStyle(color: AppTheme.textColor),
                  decoration: InputDecoration(
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide(
                          color: AppTheme.primaryColor.withOpacity(0.3)),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide(color: AppTheme.primaryColor),
                    ),
                    fillColor: AppTheme.cardColor,
                    filled: true,
                    hintText: 'Viết bình luận của bạn...',
                    hintStyle: TextStyle(color: AppTheme.secondaryTextColor),
                  ),
                ),
                const SizedBox(height: 8),
                Align(
                  alignment: Alignment.centerRight,
                  child: ElevatedButton(
                    onPressed: isLoading ? null : _handleCommentSubmit,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppTheme.primaryColor,
                      foregroundColor: AppTheme.textColor,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                    child: Text(isLoading ? 'Đang gửi...' : 'Gửi'),
                  ),
                ),
              ],
            ),
          )
        else
          Padding(
            padding: const EdgeInsets.only(bottom: 16),
            child: Text(
              'Vui lòng đăng nhập để bình luận',
              style: TextStyle(color: AppTheme.secondaryTextColor),
            ),
          ),
        if (isLoading && comments.isEmpty)
          const Center(child: CircularProgressIndicator())
        else if (comments.isEmpty)
          const Center(
            child: Text(
              'Chưa có bình luận nào.',
              style: TextStyle(color: Colors.grey),
            ),
          )
        else
          ListView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: comments.length,
            itemBuilder: (context, index) => _buildCommentCard(comments[index]),
          ),
      ],
    );
  }

  @override
  void dispose() {
    _commentController.dispose();
    _replyController.dispose();
    _editController.dispose();
    super.dispose();
  }
}
