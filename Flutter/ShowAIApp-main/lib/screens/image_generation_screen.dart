import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:path_provider/path_provider.dart';
import 'package:permission_handler/permission_handler.dart';
import 'dart:io';
import '../theme/app_theme.dart';

class ImageGenerationScreen extends StatefulWidget {
  const ImageGenerationScreen({Key? key}) : super(key: key);

  @override
  _ImageGenerationScreenState createState() => _ImageGenerationScreenState();
}

class _ImageGenerationScreenState extends State<ImageGenerationScreen> {
  final TextEditingController _promptController = TextEditingController();
  bool _isLoading = false;
  List<String> _generatedImages = [];

  // Cài đặt mặc định
  Map<String, dynamic> _settings = {
    'width': 1024,
    'height': 768,
    'steps': 1,
  };
  bool _showSettings = false;

  Future<void> _generateImage() async {
    if (_promptController.text.trim().isEmpty) return;

    setState(() {
      _isLoading = true;
    });

    try {
      // Lấy API key - Cập nhật để phù hợp với response format mới
      final keyResponse = await http.get(
        Uri.parse('https://showai.io.vn/api/together-api-key'),
        headers: {'Accept': 'application/json'},
      );
      final apiKey = json.decode(utf8.decode(keyResponse.bodyBytes))['apiKey'];

      // Gọi API tạo ảnh
      final response = await http.post(
        Uri.parse('https://api.together.xyz/v1/images/generations'),
        headers: {
          'Authorization': 'Bearer $apiKey',
          'Content-Type': 'application/json',
        },
        body: json.encode({
          'model': 'black-forest-labs/FLUX.1-schnell-Free',
          'prompt': _promptController.text,
          'width': _settings['width'],
          'height': _settings['height'],
          'steps': _settings['steps'],
          'n': 1,
          'response_format': 'b64_json'
        }),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        setState(() {
          _generatedImages.insert(0, data['data'][0]['b64_json']);
        });
      } else {
        throw Exception('Lỗi khi tạo ảnh: ${response.statusCode}');
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Lỗi: ${e.toString()}')),
      );
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  Future<void> _downloadImage(String base64Image, int index) async {
    try {
      // Kiểm tra và yêu cầu quyền truy cập storage
      var status = await Permission.storage.status;
      if (!status.isGranted) {
        status = await Permission.storage.request();
        if (!status.isGranted) {
          throw Exception('Cần cấp quyền truy cập bộ nhớ để tải ảnh');
        }
      }

      // Tạo đường dẫn đến thư mục Pictures/ShowAI
      Directory? directory;
      if (Platform.isAndroid) {
        directory = Directory('/storage/emulated/0/Pictures/ShowAI');
      } else {
        final appDir = await getApplicationDocumentsDirectory();
        directory = Directory('${appDir.path}/Pictures/ShowAI');
      }

      // Tạo thư mục nếu chưa tồn tại
      if (!await directory.exists()) {
        await directory.create(recursive: true);
      }

      // Tạo tên file với timestamp
      final timestamp = DateTime.now().millisecondsSinceEpoch;
      final imagePath = '${directory.path}/showai_image_$timestamp.png';

      // Chuyển base64 thành bytes và lưu file
      final imageBytes = base64Decode(base64Image);
      final imageFile = File(imagePath);
      await imageFile.writeAsBytes(imageBytes);

      // Hiển thị thông báo thành công
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Đã tải ảnh vào thư mục Pictures/ShowAI'),
          backgroundColor: Colors.green,
        ),
      );
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Lỗi khi tải ảnh: ${e.toString()}'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.backgroundColor,
      appBar: AppBar(
        title: const Text(
          'Tạo hình ảnh AI',
          style: TextStyle(
            fontWeight: FontWeight.bold,
            color: AppTheme.textColor,
          ),
        ),
        backgroundColor: AppTheme.cardColor,
        elevation: 0,
        leading: IconButton(
          icon: Icon(
            Icons.arrow_back,
            color: AppTheme.primaryColor,
          ),
          onPressed: () => Navigator.pop(context),
        ),
        actions: [
          IconButton(
            icon: Icon(
              _showSettings ? Icons.settings_outlined : Icons.settings,
              color: AppTheme.primaryColor,
            ),
            onPressed: () {
              setState(() {
                _showSettings = !_showSettings;
              });
            },
          ),
        ],
      ),
      body: GestureDetector(
        onTap: () => FocusScope.of(context).unfocus(),
        child: SingleChildScrollView(
          padding: EdgeInsets.only(
            left: 16,
            right: 16,
            top: 16,
            bottom: MediaQuery.of(context).viewInsets.bottom + 16,
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Container(
                decoration: BoxDecoration(
                  color: AppTheme.cardColor,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: AppTheme.primaryColor.withOpacity(0.3),
                  ),
                ),
                child: TextField(
                  controller: _promptController,
                  maxLines: 4,
                  style: const TextStyle(color: AppTheme.textColor),
                  decoration: InputDecoration(
                    hintText: 'Mô tả hình ảnh bạn muốn tạo...',
                    hintStyle: TextStyle(
                      color: AppTheme.secondaryTextColor,
                    ),
                    border: InputBorder.none,
                    contentPadding: const EdgeInsets.all(16),
                  ),
                  textInputAction: TextInputAction.done,
                  onSubmitted: (_) => FocusScope.of(context).unfocus(),
                ),
              ),
              if (_showSettings) ...[
                const SizedBox(height: 16),
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: AppTheme.cardColor,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: AppTheme.primaryColor.withOpacity(0.3),
                    ),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _buildSliderSetting(
                        'Chiều rộng',
                        'width',
                        256,
                        1440,
                        32,
                        'px',
                      ),
                      const SizedBox(height: 16),
                      _buildSliderSetting(
                        'Chiều cao',
                        'height',
                        256,
                        1440,
                        32,
                        'px',
                      ),
                      const SizedBox(height: 16),
                      _buildSliderSetting(
                        'Số bước',
                        'steps',
                        1,
                        4,
                        1,
                        '',
                      ),
                    ],
                  ),
                ),
              ],
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: _isLoading ? null : _generateImage,
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.primaryColor,
                  foregroundColor: AppTheme.textColor,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                child: _isLoading
                    ? const SizedBox(
                        width: 24,
                        height: 24,
                        child: CircularProgressIndicator(
                          color: AppTheme.textColor,
                          strokeWidth: 2,
                        ),
                      )
                    : const Text(
                        'Tạo hình ảnh',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
              ),
              if (_generatedImages.isNotEmpty) ...[
                const SizedBox(height: 24),
                GridView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    crossAxisSpacing: 16,
                    mainAxisSpacing: 16,
                    childAspectRatio: 1,
                  ),
                  itemCount: _generatedImages.length,
                  itemBuilder: (context, index) {
                    return Container(
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: AppTheme.primaryColor.withOpacity(0.3),
                        ),
                      ),
                      clipBehavior: Clip.antiAlias,
                      child: Stack(
                        children: [
                          Image.memory(
                            base64Decode(_generatedImages[index]),
                            fit: BoxFit.cover,
                            width: double.infinity,
                            height: double.infinity,
                          ),
                          Positioned(
                            right: 8,
                            bottom: 8,
                            child: IconButton(
                              icon: const Icon(Icons.download),
                              color: AppTheme.textColor,
                              onPressed: () => _downloadImage(
                                _generatedImages[index],
                                index,
                              ),
                            ),
                          ),
                        ],
                      ),
                    );
                  },
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSliderSetting(
    String label,
    String setting,
    double min,
    double max,
    double step,
    String unit,
  ) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              label,
              style: const TextStyle(
                color: AppTheme.textColor,
                fontSize: 14,
              ),
            ),
            Text(
              '${_settings[setting]}$unit',
              style: TextStyle(
                color: AppTheme.textColor.withOpacity(0.7),
                fontSize: 14,
              ),
            ),
          ],
        ),
        const SizedBox(height: 8),
        SliderTheme(
          data: SliderTheme.of(context).copyWith(
            activeTrackColor: AppTheme.primaryColor,
            inactiveTrackColor: AppTheme.primaryColor.withOpacity(0.3),
            thumbColor: AppTheme.primaryColor,
            overlayColor: AppTheme.primaryColor.withOpacity(0.1),
          ),
          child: Slider(
            value: _settings[setting].toDouble(),
            min: min,
            max: max,
            divisions: ((max - min) / step).round(),
            onChanged: (value) {
              setState(() {
                _settings[setting] = value.round();
              });
            },
          ),
        ),
      ],
    );
  }
}
