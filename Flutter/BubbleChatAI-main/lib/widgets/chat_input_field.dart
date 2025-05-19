import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'dart:io';

class ChatInputField extends StatefulWidget {
  final TextEditingController controller;
  final Function(String text, List<File> images)? onSubmitted;

  const ChatInputField({
    super.key,
    required this.controller,
    this.onSubmitted,
  });

  @override
  State<ChatInputField> createState() => _ChatInputFieldState();
}

class _ChatInputFieldState extends State<ChatInputField> with SingleTickerProviderStateMixin {
  bool _isComposing = false;
  late FocusNode _focusNode;
  late AnimationController _sendButtonController;
  late Animation<double> _sendButtonAnimation;
  VoidCallback? onAttachmentPressed;
  List<File> _selectedImages = [];
  final double _minHeight = 48.0;
  final double _maxHeight = 120.0;
  final double _imagePreviewSize = 80.0;

  @override
  void initState() {
    super.initState();
    _focusNode = FocusNode();
    _sendButtonController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 300),
    );
    _sendButtonAnimation = CurvedAnimation(
      parent: _sendButtonController,
      curve: Curves.easeOut,
    );

    widget.controller.addListener(_updateComposingState);
  }

  void _updateComposingState() {
    final newComposing = widget.controller.text.isNotEmpty;
    if (newComposing != _isComposing) {
      setState(() {
        _isComposing = newComposing;
      });
      
      if (newComposing) {
        _sendButtonController.forward();
      } else {
        _sendButtonController.reverse();
      }
    }
  }

  @override
  void dispose() {
    widget.controller.removeListener(_updateComposingState);
    _focusNode.dispose();
    _sendButtonController.dispose();
    super.dispose();
  }

  void _handleSubmitted(String text) {
    if ((text.trim().isEmpty && _selectedImages.isEmpty) || widget.onSubmitted == null) {
      return;
    }
    widget.controller.clear();
    widget.onSubmitted!(text, _selectedImages);
    setState(() {
      _selectedImages = [];
    });
  }

  void _showImageSourceDialog() {
    showModalBottomSheet(
      context: context,
      builder: (BuildContext context) {
        return SafeArea(
          child: Wrap(
            children: [
              ListTile(
                leading: const Icon(Icons.photo_library),
                title: const Text('Chọn ảnh từ thư viện'),
                onTap: () {
                  _getImage(ImageSource.gallery);
                  Navigator.pop(context);
                },
              ),
              ListTile(
                leading: const Icon(Icons.camera_alt),
                title: const Text('Chụp ảnh'),
                onTap: () {
                  _getImage(ImageSource.camera);
                  Navigator.pop(context);
                },
              ),
            ],
          ),
        );
      },
    );
  }

  Future<void> _getImage(ImageSource source) async {
    final ImagePicker picker = ImagePicker();
    if (source == ImageSource.gallery) {
      final List<XFile> images = await picker.pickMultiImage();
      if (images.isNotEmpty) {
        setState(() {
          _selectedImages.addAll(images.map((xFile) => File(xFile.path)));
        });
      }
    } else {
      final XFile? image = await picker.pickImage(source: source);
      if (image != null) {
        setState(() {
          _selectedImages.add(File(image.path));
        });
      }
    }
  }

  void _removeImage(int index) {
    setState(() {
      _selectedImages.removeAt(index);
    });
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDarkMode = theme.brightness == Brightness.dark;
    
    final backgroundColor = isDarkMode 
        ? theme.colorScheme.surface
        : Colors.white;
    
    final borderColor = isDarkMode
        ? Colors.grey.shade800
        : Colors.grey.shade300;
        
    final hintColor = isDarkMode
        ? Colors.grey.shade500
        : Colors.grey.shade500;
    
    final inputBackgroundColor = isDarkMode
        ? theme.colorScheme.surface
        : Colors.grey.shade100;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8.0, vertical: 8.0),
      decoration: BoxDecoration(
        color: backgroundColor,
        border: Border(
          top: BorderSide(color: borderColor),
        ),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (_selectedImages.isNotEmpty)
            Container(
              height: _imagePreviewSize + 16,
              margin: const EdgeInsets.only(bottom: 8),
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                itemCount: _selectedImages.length,
                itemBuilder: (context, index) {
                  return Stack(
                    children: [
                      Container(
                        width: _imagePreviewSize,
                        height: _imagePreviewSize,
                        margin: const EdgeInsets.only(right: 8),
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(8),
                          image: DecorationImage(
                            image: FileImage(_selectedImages[index]),
                            fit: BoxFit.cover,
                          ),
                        ),
                      ),
                      Positioned(
                        right: 12,
                        top: 4,
                        child: InkWell(
                          onTap: () => _removeImage(index),
                          child: Container(
                            padding: const EdgeInsets.all(4),
                            decoration: BoxDecoration(
                              color: Colors.black.withOpacity(0.5),
                              shape: BoxShape.circle,
                            ),
                            child: const Icon(
                              Icons.close,
                              size: 16,
                              color: Colors.white,
                            ),
                          ),
                        ),
                      ),
                    ],
                  );
                },
              ),
            ),
          Row(
            children: [
              Container(
                width: 40,
                height: 40,
                margin: const EdgeInsets.only(right: 8),
                decoration: BoxDecoration(
                  color: theme.colorScheme.secondary.withOpacity(0.8),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: IconButton(
                  icon: const Icon(Icons.add, color: Colors.white),
                  onPressed: _showImageSourceDialog,
                  iconSize: 20,
                ),
              ),
              Expanded(
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16.0),
                  decoration: BoxDecoration(
                    color: inputBackgroundColor,
                    borderRadius: BorderRadius.circular(24.0),
                    border: Border.all(
                      color: borderColor,
                      width: 0.5,
                    ),
                  ),
                  child: TextField(
                    controller: widget.controller,
                    focusNode: _focusNode,
                    decoration: InputDecoration(
                      hintText: 'Nhắn tin cho BubbleChatAI',
                      border: InputBorder.none,
                      hintStyle: TextStyle(color: hintColor),
                      contentPadding: const EdgeInsets.symmetric(vertical: 12),
                    ),
                    onSubmitted: _handleSubmitted,
                    maxLines: null,
                    minLines: 1,
                    textInputAction: TextInputAction.newline,
                    keyboardType: TextInputType.multiline,
                    style: TextStyle(
                      color: isDarkMode ? Colors.white : Colors.black,
                    ),
                  ),
                ),
              ),
              if (_isComposing) const SizedBox(width: 8),
              if (_isComposing)
                ScaleTransition(
                  scale: _sendButtonAnimation,
                  child: Container(
                    width: 40,
                    height: 40,
                    decoration: BoxDecoration(
                      color: theme.colorScheme.primary,
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: IconButton(
                      icon: const Icon(Icons.send, color: Colors.white),
                      onPressed: () => _handleSubmitted(widget.controller.text),
                      iconSize: 20,
                    ),
                  ),
                ),
            ],
          ),
        ],
      ),
    );
  }
} 