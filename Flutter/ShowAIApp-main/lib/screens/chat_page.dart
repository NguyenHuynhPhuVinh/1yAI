import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../models/chat_models.dart';
import 'model_selection_screen.dart';
import '../data/model_data.dart';
import 'package:flutter_markdown/flutter_markdown.dart';
import 'image_generation_screen.dart';
import '../theme/app_theme.dart';

class ChatPage extends StatefulWidget {
  const ChatPage({Key? key}) : super(key: key);

  @override
  _ChatPageState createState() => _ChatPageState();
}

class _ChatPageState extends State<ChatPage> {
  final TextEditingController _messageController = TextEditingController();
  final List<ChatMessage> _messages = [];
  final ScrollController _scrollController = ScrollController();
  bool _isLoading = false;
  String _selectedProvider = 'Google';
  late ModelInfo _selectedModel;

  final List<ModelGroup> _modelGroups = modelGroups;

  final TextEditingController _editController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _selectedModel = _modelGroups
        .firstWhere((group) => group.provider == 'Google')
        .models[0];
  }

  Future<void> _sendMessage({int? replyToIndex, String? userMessage}) async {
    if (userMessage == null &&
        replyToIndex == null &&
        _messageController.text.trim().isEmpty) return;

    final message = userMessage ??
        (replyToIndex == null
            ? _messageController.text
            : _messages[replyToIndex].text);

    if (userMessage == null && replyToIndex == null) {
      setState(() {
        _messages.add(ChatMessage(text: message, isUser: true));
        _messageController.clear();
      });
    }

    setState(() => _isLoading = true);

    try {
      final keyResponse = await http.get(
        Uri.parse('https://showai.io.vn/api/openrouter-key'),
        headers: {'Accept': 'application/json'},
      );
      final key = json.decode(utf8.decode(keyResponse.bodyBytes))['key'];

      final List<Map<String, String>> messageHistory = _messages.map((msg) {
        return {'role': msg.isUser ? 'user' : 'assistant', 'content': msg.text};
      }).toList();

      final response = await http.post(
        Uri.parse('https://openrouter.ai/api/v1/chat/completions'),
        headers: {
          'Authorization': 'Bearer $key',
          'HTTP-Referer': 'https://showai.io.vn',
          'X-Title': 'ShowAI',
          'Content-Type': 'application/json; charset=utf-8',
          'Accept': 'application/json',
        },
        body: utf8.encode(json.encode({
          'model': _selectedModel.modal,
          'messages': messageHistory,
        })),
      );

      if (response.statusCode == 200) {
        final data = json.decode(utf8.decode(response.bodyBytes));
        final aiResponse = data['choices'][0]['message']['content'].trim();
        setState(() {
          _messages.add(ChatMessage(text: aiResponse, isUser: false));
        });
        _scrollToBottom();
      }
    } catch (e) {
      setState(() {
        _messages.add(ChatMessage(
          text: 'Xin lỗi, đã xảy ra lỗi: ${e.toString()}',
          isUser: false,
        ));
      });
    } finally {
      setState(() => _isLoading = false);
    }
  }

  void _scrollToBottom() {
    Future.delayed(const Duration(milliseconds: 100), () {
      _scrollController.animateTo(
        _scrollController.position.maxScrollExtent,
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeOut,
      );
    });
  }

  Widget _buildMessageWidget(ChatMessage message, int index) {
    return GestureDetector(
      onLongPress: () {
        showModalBottomSheet(
          context: context,
          backgroundColor: AppTheme.cardColor,
          shape: const RoundedRectangleBorder(
            borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
          ),
          builder: (context) => Container(
            padding: const EdgeInsets.symmetric(vertical: 16),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  width: 40,
                  height: 4,
                  margin: const EdgeInsets.only(bottom: 20),
                  decoration: BoxDecoration(
                    color: AppTheme.secondaryTextColor.withOpacity(0.3),
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
                ListTile(
                  leading: Icon(Icons.edit, color: AppTheme.primaryColor),
                  title: Text(
                    'Sửa tin nhắn',
                    style: TextStyle(color: AppTheme.textColor),
                  ),
                  onTap: () {
                    Navigator.pop(context);
                    _editMessage(index);
                  },
                ),
                ListTile(
                  leading: Icon(Icons.delete, color: AppTheme.primaryColor),
                  title: Text(
                    'Xóa tin nhắn',
                    style: TextStyle(color: AppTheme.textColor),
                  ),
                  onTap: () {
                    Navigator.pop(context);
                    _deleteMessage(index);
                  },
                ),
                if (!message.isUser)
                  ListTile(
                    leading: Icon(Icons.refresh, color: AppTheme.primaryColor),
                    title: Text(
                      'Tạo phản hồi mới',
                      style: TextStyle(color: AppTheme.textColor),
                    ),
                    onTap: () {
                      Navigator.pop(context);
                      _regenerateResponse(index);
                    },
                  ),
              ],
            ),
          ),
        );
      },
      child: Container(
        margin: EdgeInsets.only(
          bottom: 8,
          left: message.isUser ? 32 : 0,
          right: message.isUser ? 0 : 32,
        ),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: message.isUser
              ? AppTheme.primaryColor.withOpacity(0.1)
              : AppTheme.cardColor,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: message.isUser
                ? AppTheme.primaryColor.withOpacity(0.3)
                : AppTheme.primaryColor.withOpacity(0.1),
          ),
        ),
        child: message.isUser
            ? Text(
                message.text,
                style: TextStyle(
                  color: AppTheme.textColor,
                  fontSize: 15,
                  height: 1.5,
                ),
              )
            : MarkdownBody(
                data: message.text,
                styleSheet: MarkdownStyleSheet(
                  p: TextStyle(
                    color: AppTheme.textColor,
                    fontSize: 15,
                    height: 1.5,
                  ),
                  code: TextStyle(
                    color: AppTheme.textColor,
                    backgroundColor: AppTheme.backgroundColor.withOpacity(0.3),
                    fontSize: 14,
                  ),
                  codeblockDecoration: BoxDecoration(
                    color: AppTheme.backgroundColor.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
              ),
      ),
    );
  }

  void _clearChat() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: AppTheme.cardColor,
        title: Text(
          'Xác nhận',
          style: TextStyle(color: AppTheme.textColor),
        ),
        content: Text(
          'Bạn có chắc muốn xóa toàn bộ cuộc trò chuyện?',
          style: TextStyle(color: AppTheme.textColor),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text(
              'Hủy',
              style: TextStyle(color: AppTheme.secondaryTextColor),
            ),
          ),
          TextButton(
            onPressed: () {
              setState(() => _messages.clear());
              Navigator.pop(context);
            },
            child: Text(
              'Xóa',
              style: TextStyle(color: AppTheme.primaryColor),
            ),
          ),
        ],
      ),
    );
  }

  void _deleteMessage(int index) {
    setState(() => _messages.removeAt(index));
  }

  void _editMessage(int index) {
    _editController.text = _messages[index].text;
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: AppTheme.cardColor,
        title: Text(
          'Sửa tin nhắn',
          style: TextStyle(color: AppTheme.textColor),
        ),
        content: TextField(
          controller: _editController,
          maxLines: null,
          style: TextStyle(color: AppTheme.textColor),
          decoration: InputDecoration(
            hintText: 'Nhập nội dung mới...',
            hintStyle: TextStyle(color: AppTheme.secondaryTextColor),
            enabledBorder: OutlineInputBorder(
              borderSide:
                  BorderSide(color: AppTheme.primaryColor.withOpacity(0.3)),
              borderRadius: BorderRadius.circular(8),
            ),
            focusedBorder: OutlineInputBorder(
              borderSide: BorderSide(color: AppTheme.primaryColor),
              borderRadius: BorderRadius.circular(8),
            ),
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text(
              'Hủy',
              style: TextStyle(color: AppTheme.secondaryTextColor),
            ),
          ),
          TextButton(
            onPressed: () {
              setState(() {
                _messages[index] = ChatMessage(
                  text: _editController.text,
                  isUser: _messages[index].isUser,
                );
              });
              Navigator.pop(context);
              if (_messages[index].isUser && index < _messages.length - 1) {
                _regenerateResponse(index + 1);
              }
            },
            child: Text(
              'Lưu',
              style: TextStyle(color: AppTheme.primaryColor),
            ),
          ),
        ],
      ),
    );
  }

  void _regenerateResponse(int index) {
    // Tìm tin nhắn người dùng gần nhất phía trước
    String userMessage = '';
    for (int i = index - 1; i >= 0; i--) {
      if (_messages[i].isUser) {
        userMessage = _messages[i].text;
        break;
      }
    }

    if (userMessage.isNotEmpty) {
      // Xóa phản hồi cũ
      setState(() {
        _messages.removeAt(index);
      });

      // Gửi lại tin nhắn để nhận phản hồi mới
      _sendMessage(userMessage: userMessage);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.backgroundColor,
      body: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppTheme.cardColor,
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.1),
                  blurRadius: 8,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 12,
                    vertical: 6,
                  ),
                  decoration: BoxDecoration(
                    color: AppTheme.primaryColor.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: AppTheme.primaryColor.withOpacity(0.3),
                    ),
                  ),
                  child: Row(
                    children: [
                      Text(_selectedModel.icon,
                          style: const TextStyle(fontSize: 18)),
                      const SizedBox(width: 8),
                      Text(
                        _selectedModel.name,
                        style: TextStyle(
                          color: AppTheme.textColor,
                          fontSize: 14,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                ),
                const Spacer(),
                IconButton(
                  icon: Icon(
                    Icons.image,
                    color: AppTheme.primaryColor,
                  ),
                  onPressed: () => Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => const ImageGenerationScreen(),
                    ),
                  ),
                ),
                IconButton(
                  icon: Icon(
                    Icons.settings,
                    color: AppTheme.primaryColor,
                    size: 22,
                  ),
                  padding: EdgeInsets.zero,
                  constraints: const BoxConstraints(),
                  onPressed: () => Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => ModelSelectionScreen(
                        modelGroups: _modelGroups,
                        selectedModel: _selectedModel,
                        onModelSelected: (model) {
                          setState(() {
                            _selectedModel = model;
                            _selectedProvider = _modelGroups
                                .firstWhere(
                                    (group) => group.models.contains(model))
                                .provider;
                          });
                        },
                      ),
                    ),
                  ),
                ),
                IconButton(
                  icon: Icon(
                    Icons.delete_outline,
                    color: AppTheme.primaryColor,
                  ),
                  onPressed: _clearChat,
                ),
              ],
            ),
          ),
          Expanded(
            child: _messages.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Container(
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color: AppTheme.primaryColor.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: Icon(
                            Icons.chat_bubble_outline,
                            size: 64,
                            color: AppTheme.primaryColor,
                          ),
                        ),
                        const SizedBox(height: 24),
                        Text(
                          'Bắt đầu cuộc trò chuyện với ShowAI',
                          style: TextStyle(
                            color: AppTheme.secondaryTextColor,
                            fontSize: 16,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ],
                    ),
                  )
                : ListView.builder(
                    controller: _scrollController,
                    padding: const EdgeInsets.all(16),
                    itemCount: _messages.length,
                    itemBuilder: (context, index) =>
                        _buildMessageWidget(_messages[index], index),
                  ),
          ),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppTheme.cardColor,
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.1),
                  blurRadius: 8,
                  offset: const Offset(0, -2),
                ),
              ],
            ),
            child: Row(
              children: [
                Expanded(
                  child: Container(
                    decoration: BoxDecoration(
                      color: AppTheme.backgroundColor,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                        color: AppTheme.primaryColor.withOpacity(0.3),
                      ),
                    ),
                    child: TextField(
                      controller: _messageController,
                      maxLines: null,
                      keyboardType: TextInputType.multiline,
                      style: TextStyle(color: AppTheme.textColor),
                      decoration: InputDecoration(
                        hintText: 'Hỏi bất cứ điều gì...',
                        hintStyle:
                            TextStyle(color: AppTheme.secondaryTextColor),
                        contentPadding: const EdgeInsets.symmetric(
                          horizontal: 12,
                          vertical: 8,
                        ),
                        border: InputBorder.none,
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                Container(
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        AppTheme.primaryColor,
                        AppTheme.primaryColor.withOpacity(0.8),
                      ],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(12),
                    boxShadow: [
                      BoxShadow(
                        color: AppTheme.primaryColor.withOpacity(0.3),
                        blurRadius: 8,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                  child: IconButton(
                    icon: _isLoading
                        ? SizedBox(
                            width: 20,
                            height: 20,
                            child: CircularProgressIndicator(
                              color: AppTheme.cardColor,
                              strokeWidth: 2,
                            ),
                          )
                        : Icon(
                            Icons.send,
                            color: AppTheme.cardColor,
                            size: 20,
                          ),
                    onPressed: _isLoading ? null : _sendMessage,
                    padding: const EdgeInsets.all(8),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
