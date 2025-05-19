import 'package:flutter/material.dart';
import '../models/chat_history.dart';
import '../utils/preferences.dart';
import '../utils/ai_service.dart';

class ChatSidebar extends StatefulWidget {
  final AiService aiService;
  final Function(ChatHistory) onChatSelected;
  final Function() onNewChatPressed;
  final VoidCallback onClose;

  const ChatSidebar({
    super.key,
    required this.aiService,
    required this.onChatSelected,
    required this.onNewChatPressed,
    required this.onClose,
  });

  @override
  State<ChatSidebar> createState() => _ChatSidebarState();
}

class _ChatSidebarState extends State<ChatSidebar> {
  List<ChatHistory> _chatHistories = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadChatHistories();
  }

  Future<void> _loadChatHistories() async {
    setState(() {
      _isLoading = true;
    });

    final histories = await Preferences.getChatHistories();
    
    setState(() {
      _chatHistories = histories;
      _isLoading = false;
    });
  }

  Future<void> _deleteChat(String id) async {
    await Preferences.deleteChatHistory(id);
    await _loadChatHistories();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDarkMode = theme.brightness == Brightness.dark;

    return Drawer(
      backgroundColor: theme.scaffoldBackgroundColor,
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            color: isDarkMode ? theme.colorScheme.surface : Colors.grey.shade200,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Lịch sử trò chuyện',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: theme.colorScheme.onSurface,
                  ),
                ),
                IconButton(
                  icon: Icon(Icons.close, color: theme.colorScheme.onSurface),
                  onPressed: widget.onClose,
                ),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                icon: const Icon(Icons.add, color: Colors.white),
                label: const Text('Tạo trò chuyện mới', style: TextStyle(color: Colors.white)),
                onPressed: () {
                  widget.onNewChatPressed();
                  widget.onClose();
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: theme.colorScheme.primary,
                  padding: const EdgeInsets.symmetric(vertical: 12),
                ),
              ),
            ),
          ),
          Divider(color: isDarkMode ? Colors.grey.shade800 : Colors.grey.shade300),
          Expanded(
            child: _isLoading
                ? Center(child: CircularProgressIndicator(color: theme.colorScheme.primary))
                : _chatHistories.isEmpty
                    ? Center(
                        child: Text(
                          'Chưa có lịch sử trò chuyện',
                          style: TextStyle(color: theme.colorScheme.onSurface),
                        ),
                      )
                    : ListView.builder(
                        itemCount: _chatHistories.length,
                        itemBuilder: (context, index) {
                          final chat = _chatHistories[index];
                          final isSelected = widget.aiService.currentChatHistory?.id == chat.id;
                          
                          return ListTile(
                            title: Text(
                              chat.title,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: TextStyle(
                                color: theme.colorScheme.onSurface,
                              ),
                            ),
                            subtitle: Text(
                              _formatDate(chat.lastUpdatedAt),
                              style: TextStyle(
                                fontSize: 12,
                                color: isDarkMode ? Colors.grey.shade400 : Colors.grey.shade600,
                              ),
                            ),
                            selected: isSelected,
                            selectedTileColor: isDarkMode 
                                ? theme.colorScheme.primary.withOpacity(0.1)
                                : Colors.grey.shade200,
                            leading: Icon(
                              Icons.chat_bubble_outline,
                              color: theme.colorScheme.onSurface.withOpacity(0.7),
                            ),
                            trailing: IconButton(
                              icon: const Icon(Icons.delete_outline, color: Colors.red),
                              onPressed: () => _deleteChat(chat.id),
                            ),
                            onTap: () {
                              widget.onChatSelected(chat);
                              widget.onClose();
                            },
                          );
                        },
                      ),
          ),
        ],
      ),
    );
  }

  String _formatDate(DateTime date) {
    final now = DateTime.now();
    final difference = now.difference(date);
    
    if (difference.inDays == 0) {
      return 'Hôm nay, ${date.hour}:${date.minute.toString().padLeft(2, '0')}';
    } else if (difference.inDays == 1) {
      return 'Hôm qua, ${date.hour}:${date.minute.toString().padLeft(2, '0')}';
    } else if (difference.inDays < 7) {
      return '${difference.inDays} ngày trước';
    } else {
      return '${date.day}/${date.month}/${date.year}';
    }
  }
} 