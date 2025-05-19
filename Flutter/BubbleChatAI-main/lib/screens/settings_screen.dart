import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter/gestures.dart';
import 'package:url_launcher/url_launcher.dart';
import '../utils/preferences.dart';
import '../utils/ai_service.dart';
import '../utils/theme_manager.dart';

class SettingsScreen extends StatefulWidget {
  final AiService aiService;
  
  const SettingsScreen({super.key, required this.aiService});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  final TextEditingController _apiKeyController = TextEditingController();
  final TextEditingController _systemInstructionController = TextEditingController();
  bool _isLoading = true;
  Map<String, String> _safetySettings = {};
  
  @override
  void initState() {
    super.initState();
    _loadSettings();
  }
  
  Future<void> _loadSettings() async {
    final apiKey = await Preferences.getApiKey();
    final systemInstruction = await Preferences.getSystemInstruction();
    final safetySettings = await Preferences.getSafetySettings();
    
    setState(() {
      _apiKeyController.text = apiKey ?? '';
      _systemInstructionController.text = systemInstruction ?? '';
      _safetySettings = safetySettings;
      _isLoading = false;
    });
  }
  
  Future<void> _saveApiKey() async {
    setState(() {
      _isLoading = true;
    });
    
    await widget.aiService.updateApiKey(_apiKeyController.text);
    
    setState(() {
      _isLoading = false;
    });
    
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('API key đã được lưu')),
      );
    }
  }
  
  Future<void> _saveSystemInstruction() async {
    setState(() {
      _isLoading = true;
    });
    
    await widget.aiService.updateSystemInstruction(_systemInstructionController.text);
    
    setState(() {
      _isLoading = false;
    });
    
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Ghi chú hệ thống đã được lưu')),
      );
    }
  }

  Future<void> _saveSafetySettings() async {
    setState(() {
      _isLoading = true;
    });
    
    await widget.aiService.updateSafetySettings(_safetySettings);
    
    setState(() {
      _isLoading = false;
    });
    
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Cài đặt an toàn đã được lưu')),
      );
    }
  }

  String _getThemeModeText(ThemeMode mode) {
    switch (mode) {
      case ThemeMode.light:
        return 'Sáng';
      case ThemeMode.dark:
        return 'Tối';
      case ThemeMode.system:
        return 'Hệ thống';
    }
  }

  String _getSafetyCategoryText(String category) {
    switch (category) {
      case 'HARASSMENT':
        return 'Quấy rối';
      case 'HATE_SPEECH':
        return 'Phát ngôn thù địch';
      case 'SEXUALLY_EXPLICIT':
        return 'Nội dung nhạy cảm';
      case 'DANGEROUS_CONTENT':
        return 'Nội dung nguy hiểm';
      case 'CIVIC_INTEGRITY':
        return 'Chính trị & Xã hội';
      default:
        return category;
    }
  }

  Future<void> _launchURL(String url) async {
    final Uri uri = Uri.parse(url);
    if (!await launchUrl(uri, mode: LaunchMode.externalApplication)) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Không thể mở URL: $url')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final themeManager = Provider.of<ThemeManager>(context);
    final isDarkMode = Theme.of(context).brightness == Brightness.dark;
    
    return Scaffold(
      appBar: AppBar(
        title: const Text('Cài đặt'),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Phần Giao diện
                    Card(
                      elevation: 2,
                      margin: const EdgeInsets.only(bottom: 16),
                      child: Padding(
                        padding: const EdgeInsets.all(16.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Giao diện',
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 16),
                            ListTile(
                              contentPadding: EdgeInsets.zero,
                              title: const Text('Chế độ giao diện'),
                              subtitle: Text(_getThemeModeText(themeManager.themeMode)),
                              trailing: DropdownButton<ThemeMode>(
                                value: themeManager.themeMode,
                                onChanged: (ThemeMode? newMode) {
                                  if (newMode != null) {
                                    themeManager.setThemeMode(newMode);
                                  }
                                },
                                items: const [
                                  DropdownMenuItem(
                                    value: ThemeMode.system,
                                    child: Text('Hệ thống'),
                                  ),
                                  DropdownMenuItem(
                                    value: ThemeMode.light,
                                    child: Text('Sáng'),
                                  ),
                                  DropdownMenuItem(
                                    value: ThemeMode.dark,
                                    child: Text('Tối'),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),

                    // Phần Model Selection (Chọn mô hình)
                    Card(
                      elevation: 2,
                      margin: const EdgeInsets.only(bottom: 16),
                      child: Padding(
                        padding: const EdgeInsets.all(16.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Mô hình AI',
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 8),
                            const Text(
                              'Chọn mô hình AI để sử dụng cho các cuộc trò chuyện',
                              style: TextStyle(fontSize: 14),
                            ),
                            const SizedBox(height: 16),
                            DropdownButtonFormField<String>(
                              value: widget.aiService.getCurrentModel(),
                              isExpanded: true,
                              decoration: InputDecoration(
                                labelText: 'Mô hình',
                                border: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                contentPadding: const EdgeInsets.symmetric(
                                  horizontal: 12,
                                  vertical: 8,
                                ),
                              ),
                              onChanged: (String? newModel) async {
                                if (newModel != null) {
                                  setState(() {
                                    _isLoading = true;
                                  });
                                  
                                  try {
                                    await widget.aiService.updateModel(newModel);
                                    if (mounted) {
                                      ScaffoldMessenger.of(context).showSnackBar(
                                        const SnackBar(content: Text('Đã thay đổi mô hình AI')),
                                      );
                                    }
                                  } catch (e) {
                                    if (mounted) {
                                      ScaffoldMessenger.of(context).showSnackBar(
                                        SnackBar(content: Text('Lỗi: $e')),
                                      );
                                    }
                                  }
                                  
                                  setState(() {
                                    _isLoading = false;
                                  });
                                }
                              },
                              items: widget.aiService.getAvailableModels().map((model) {
                                return DropdownMenuItem<String>(
                                  value: model,
                                  child: Text(
                                    model,
                                    style: const TextStyle(fontSize: 14),
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                );
                              }).toList(),
                            ),
                          ],
                        ),
                      ),
                    ),
                    
                    // Phần System Instruction (Ghi chú hệ thống)
                    Card(
                      elevation: 2,
                      margin: const EdgeInsets.only(bottom: 16),
                      child: Padding(
                        padding: const EdgeInsets.all(16.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Ghi chú hệ thống (System Instruction)',
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 8),
                            const Text(
                              'Các chỉ dẫn này sẽ được gửi tới AI mỗi khi bắt đầu cuộc trò chuyện mới',
                              style: TextStyle(fontSize: 14),
                            ),
                            const SizedBox(height: 12),
                            TextField(
                              controller: _systemInstructionController,
                              decoration: InputDecoration(
                                hintText: 'Ví dụ: Bạn là một con mèo tên là Neko.',
                                border: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(8),
                                ),
                              ),
                              maxLines: 5,
                            ),
                            const SizedBox(height: 16),
                            SizedBox(
                              width: double.infinity,
                              child: ElevatedButton(
                                onPressed: _saveSystemInstruction,
                                style: ElevatedButton.styleFrom(
                                  padding: const EdgeInsets.symmetric(vertical: 12),
                                ),
                                child: const Text('Lưu ghi chú hệ thống'),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),

                    // Phần Safety Settings (Cài đặt an toàn)
                    Card(
                      elevation: 2,
                      margin: const EdgeInsets.only(bottom: 16),
                      child: Padding(
                        padding: const EdgeInsets.all(16.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Cài đặt an toàn',
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 8),
                            const Text(
                              'Điều chỉnh mức độ lọc nội dung không phù hợp',
                              style: TextStyle(fontSize: 14),
                            ),
                            const SizedBox(height: 16),
                            ..._safetySettings.entries.map((entry) => Column(
                              children: [
                                ListTile(
                                  contentPadding: EdgeInsets.zero,
                                  title: Text(_getSafetyCategoryText(entry.key)),
                                  trailing: DropdownButton<String>(
                                    value: entry.value,
                                    onChanged: (String? newValue) {
                                      if (newValue != null) {
                                        setState(() {
                                          _safetySettings[entry.key] = newValue;
                                        });
                                      }
                                    },
                                    items: const [
                                      DropdownMenuItem(
                                        value: 'BLOCK_NONE',
                                        child: Text('Tắt'),
                                      ),
                                      DropdownMenuItem(
                                        value: 'BLOCK_LOW',
                                        child: Text('Thấp'),
                                      ),
                                      DropdownMenuItem(
                                        value: 'BLOCK_MEDIUM',
                                        child: Text('Trung bình'),
                                      ),
                                      DropdownMenuItem(
                                        value: 'BLOCK_HIGH',
                                        child: Text('Cao'),
                                      ),
                                    ],
                                  ),
                                ),
                                const Divider(),
                              ],
                            )).toList(),
                            const SizedBox(height: 16),
                            SizedBox(
                              width: double.infinity,
                              child: ElevatedButton(
                                onPressed: _saveSafetySettings,
                                style: ElevatedButton.styleFrom(
                                  padding: const EdgeInsets.symmetric(vertical: 12),
                                ),
                                child: const Text('Lưu cài đặt an toàn'),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    
                    // Phần API Key
                    Card(
                      elevation: 2,
                      margin: const EdgeInsets.only(bottom: 16),
                      child: Padding(
                        padding: const EdgeInsets.all(16.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Gemini API Key',
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 8),
                            TextField(
                              controller: _apiKeyController,
                              decoration: InputDecoration(
                                hintText: 'Nhập API key của bạn',
                                border: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(8),
                                ),
                              ),
                              obscureText: true,
                            ),
                            const SizedBox(height: 16),
                            SizedBox(
                              width: double.infinity,
                              child: ElevatedButton(
                                onPressed: _saveApiKey,
                                style: ElevatedButton.styleFrom(
                                  padding: const EdgeInsets.symmetric(vertical: 12),
                                ),
                                child: const Text('Lưu API Key'),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    
                    // Phần hướng dẫn
                    Card(
                      elevation: 2,
                      child: Padding(
                        padding: const EdgeInsets.all(16.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Hướng dẫn:',
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 8),
                            Text.rich(
                              TextSpan(
                                children: [
                                  const TextSpan(text: '1. Truy cập '),
                                  TextSpan(
                                    text: 'https://aistudio.google.com/app/apikey',
                                    style: TextStyle(
                                      color: Theme.of(context).colorScheme.primary,
                                      decoration: TextDecoration.underline,
                                    ),
                                    recognizer: TapGestureRecognizer()
                                      ..onTap = () => _launchURL('https://aistudio.google.com/app/apikey'),
                                  ),
                                  const TextSpan(
                                    text: '\n2. Đăng ký tài khoản và tạo API key\n'
                                         '3. Sao chép và dán API key vào ô trên\n'
                                         '4. Nhấn "Lưu API Key"',
                                  ),
                                ],
                              ),
                              style: const TextStyle(fontSize: 14),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
    );
  }
} 