import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../models/message.dart';
import 'dart:io';
import 'package:flutter_markdown/flutter_markdown.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:markdown/markdown.dart' as md;

class ChatMessageWidget extends StatelessWidget {
  final Message message;

  const ChatMessageWidget({
    super.key,
    required this.message,
  });

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final bool isDarkMode = theme.brightness == Brightness.dark;
    
    // Màu sắc cho user bubble và AI text
    final Color userBubbleColor = isDarkMode 
        ? theme.colorScheme.primary.withOpacity(0.8)
        : theme.colorScheme.primary;
    
    final Color userTextColor = Colors.white;
    final Color aiTextColor = isDarkMode
        ? theme.colorScheme.onSurface
        : Colors.black87;
    
    // Màu sắc cho code blocks
    final Color codeBackgroundColor = isDarkMode 
        ? Colors.grey[850]! 
        : Colors.grey[200]!;
    
    final Color codeBorderColor = isDarkMode
        ? Colors.grey[700]!
        : Colors.grey[400]!;

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        mainAxisAlignment: message.isUser ? MainAxisAlignment.end : MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (!message.isUser)
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  if (message.images.isNotEmpty)
                    Container(
                      height: 200,
                      margin: const EdgeInsets.only(bottom: 8),
                      child: ListView.builder(
                        scrollDirection: Axis.horizontal,
                        itemCount: message.images.length,
                        itemBuilder: (context, index) {
                          final imagePath = message.images[index];
                          final imageFile = File(imagePath);
                          
                          // Kiểm tra xem tệp có tồn tại không
                          final imageExists = imageFile.existsSync();
                          
                          return GestureDetector(
                            onTap: () {
                              // TODO: Hiển thị ảnh full screen khi nhấn vào
                            },
                            child: Container(
                              width: 200,
                              margin: const EdgeInsets.only(right: 8),
                              decoration: BoxDecoration(
                                borderRadius: BorderRadius.circular(8),
                                image: imageExists ? DecorationImage(
                                  image: FileImage(imageFile),
                                  fit: BoxFit.cover,
                                ) : null,
                                color: imageExists ? null : Colors.grey[200],
                              ),
                              child: !imageExists
                                  ? const Center(child: Icon(Icons.broken_image, size: 40, color: Colors.grey))
                                  : null,
                            ),
                          );
                        },
                      ),
                    ),
                  if (message.text.isNotEmpty)
                    GestureDetector(
                      onLongPress: () {
                        Clipboard.setData(ClipboardData(text: message.text));
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Đã sao chép văn bản'),
                            duration: Duration(seconds: 1),
                          ),
                        );
                      },
                      child: MarkdownBody(
                        data: message.text,
                        selectable: true,
                        styleSheet: MarkdownStyleSheet(
                          // Paragraph
                          p: TextStyle(
                            fontSize: 16.0,
                            color: aiTextColor,
                            height: 1.4,
                          ),
                          // Links
                          a: TextStyle(
                            color: theme.colorScheme.primary,
                            decoration: TextDecoration.underline,
                          ),
                          // Inline code
                          code: TextStyle(
                            fontFamily: 'monospace',
                            backgroundColor: codeBackgroundColor,
                            fontSize: 14.0,
                            color: isDarkMode ? Colors.white : Colors.black87,
                          ),
                          // Code blocks
                          codeblockDecoration: BoxDecoration(
                            color: codeBackgroundColor,
                            borderRadius: BorderRadius.circular(8.0),
                            border: Border.all(
                              color: codeBorderColor,
                              width: 1.0,
                            ),
                          ),
                          codeblockPadding: const EdgeInsets.all(8.0),
                          // codeblockTextStyle không tồn tại trong MarkdownStyleSheet
                          // Xóa dòng gây lỗi
                          // Headings
                          h1: TextStyle(
                            fontSize: 24.0,
                            fontWeight: FontWeight.bold,
                            color: aiTextColor,
                          ),
                          h2: TextStyle(
                            fontSize: 22.0,
                            fontWeight: FontWeight.bold,
                            color: aiTextColor,
                          ),
                          h3: TextStyle(
                            fontSize: 20.0,
                            fontWeight: FontWeight.bold,
                            color: aiTextColor,
                          ),
                          h4: TextStyle(
                            fontSize: 18.0,
                            fontWeight: FontWeight.bold,
                            color: aiTextColor,
                          ),
                          h5: TextStyle(
                            fontSize: 16.0,
                            fontWeight: FontWeight.bold,
                            color: aiTextColor,
                          ),
                          h6: TextStyle(
                            fontSize: 14.0,
                            fontWeight: FontWeight.bold,
                            color: aiTextColor,
                          ),
                          // Blockquote
                          blockquote: TextStyle(
                            color: aiTextColor.withOpacity(0.8),
                            fontStyle: FontStyle.italic,
                          ),
                          blockquoteDecoration: BoxDecoration(
                            color: isDarkMode 
                                ? Colors.grey[800]!.withOpacity(0.3)
                                : Colors.grey[200]!.withOpacity(0.5),
                            borderRadius: BorderRadius.circular(2.0),
                            border: Border(
                              left: BorderSide(
                                color: isDarkMode
                                    ? Colors.grey[700]!
                                    : Colors.grey[400]!,
                                width: 4.0,
                              ),
                            ),
                          ),
                          blockquotePadding: const EdgeInsets.only(
                            left: 16.0,
                            top: 8.0,
                            bottom: 8.0,
                            right: 8.0,
                          ),
                          // Lists
                          listBullet: TextStyle(
                            color: aiTextColor,
                            fontSize: 16.0,
                          ),
                          listIndent: 24.0,
                          // Tables
                          tableHead: TextStyle(
                            fontWeight: FontWeight.bold,
                            color: aiTextColor,
                          ),
                          tableBorder: TableBorder.all(
                            color: isDarkMode ? Colors.grey[700]! : Colors.grey[300]!,
                            width: 1.0,
                          ),
                          tableBody: TextStyle(
                            color: aiTextColor,
                          ),
                          tableCellsPadding: const EdgeInsets.all(4.0),
                        ),
                        onTapLink: (text, href, title) async {
                          if (href != null) {
                            final Uri url = Uri.parse(href);
                            if (await canLaunchUrl(url)) {
                              await launchUrl(url, mode: LaunchMode.externalApplication);
                            }
                          }
                        },
                        builders: {
                          'code': CodeBlockBuilder(
                            textStyle: TextStyle(
                              fontFamily: 'monospace',
                              fontSize: 14.0,
                              color: isDarkMode ? Colors.white : Colors.black87,
                            ),
                            decoration: BoxDecoration(
                              color: codeBackgroundColor,
                              borderRadius: BorderRadius.circular(8.0),
                              border: Border.all(
                                color: codeBorderColor,
                                width: 1.0,
                              ),
                            ),
                          ),
                        },
                      ),
                    ),
                ],
              ),
            ),
          if (message.isUser)
            Flexible(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  if (message.images.isNotEmpty)
                    Container(
                      height: 200,
                      margin: const EdgeInsets.only(bottom: 8),
                      child: ListView.builder(
                        scrollDirection: Axis.horizontal,
                        itemCount: message.images.length,
                        itemBuilder: (context, index) {
                          final imagePath = message.images[index];
                          final imageFile = File(imagePath);
                          
                          // Kiểm tra xem tệp có tồn tại không
                          final imageExists = imageFile.existsSync();
                          
                          return GestureDetector(
                            onTap: () {
                              // TODO: Hiển thị ảnh full screen khi nhấn vào
                            },
                            child: Container(
                              width: 200,
                              margin: const EdgeInsets.only(right: 8),
                              decoration: BoxDecoration(
                                borderRadius: BorderRadius.circular(8),
                                image: imageExists ? DecorationImage(
                                  image: FileImage(imageFile),
                                  fit: BoxFit.cover,
                                ) : null,
                                color: imageExists ? null : Colors.grey[200],
                              ),
                              child: !imageExists
                                  ? const Center(child: Icon(Icons.broken_image, size: 40, color: Colors.grey))
                                  : null,
                            ),
                          );
                        },
                      ),
                    ),
                  if (message.text.isNotEmpty)
                    Container(
                      padding: const EdgeInsets.all(12.0),
                      decoration: BoxDecoration(
                        color: userBubbleColor,
                        borderRadius: const BorderRadius.only(
                          topLeft: Radius.circular(18),
                          bottomLeft: Radius.circular(18),
                          bottomRight: Radius.circular(18),
                        ),
                      ),
                      child: Text(
                        message.text,
                        style: TextStyle(
                          fontSize: 16.0,
                          color: userTextColor,
                        ),
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

class CodeBlockBuilder extends MarkdownElementBuilder {
  final TextStyle textStyle;
  final BoxDecoration decoration;

  CodeBlockBuilder({
    required this.textStyle,
    required this.decoration,
  });

  @override
  Widget? visitElementAfter(md.Element element, TextStyle? preferredStyle) {
    if (element.tag == 'code') {
      final String text = element.textContent;
      return Container(
        width: double.infinity,
        decoration: decoration,
        padding: const EdgeInsets.all(8.0),
        margin: const EdgeInsets.symmetric(vertical: 8.0),
        child: SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          child: SelectableText(
            text,
            style: textStyle,
          ),
        ),
      );
    }
    return null;
  }
} 