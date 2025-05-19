import 'package:google_generative_ai/google_generative_ai.dart';
import 'dart:async';
import 'dart:io';
import 'package:path_provider/path_provider.dart';
import 'package:path/path.dart' as path;
import '../models/message.dart';
import '../models/chat_history.dart';
import 'preferences.dart';

class AiService {
  GenerativeModel? _model;
  ChatSession? _chatSession;
  bool _isInitialized = false;
  ChatHistory? _currentChatHistory;
  String? _systemInstructionText;
  Map<String, String> _safetySettings = {};
  String _currentModelName = 'gemini-2.0-flash';
  
  // Thêm cache cho ảnh
  final Map<String, String> _imageCache = {};
  
  AiService() {
    _initializeModel();
    _prepareImageDirectory();
  }
  
  // Thêm danh sách các mô hình có sẵn
  static const List<String> availableModels = [
    'gemini-2.0-flash',
    'gemini-2.0-flash-lite',
    'gemini-2.0-pro-exp-02-05',
    'gemini-2.0-flash-thinking-exp-01-21',
    'gemini-2.0-flash-exp',
    'gemini-1.5-pro',
    'gemini-1.5-flash',
    'gemini-1.5-flash-8b',
  ];
  
  SafetySetting _convertSafetySetting(String category, String level) {
    HarmCategory harmCategory;
    HarmBlockThreshold blockThreshold;

    // Chuyển đổi category string thành HarmCategory
    switch (category) {
      case 'HARASSMENT':
        harmCategory = HarmCategory.harassment;
        break;
      case 'HATE_SPEECH':
        harmCategory = HarmCategory.hateSpeech;
        break;
      case 'SEXUALLY_EXPLICIT':
        harmCategory = HarmCategory.sexuallyExplicit;
        break;
      case 'DANGEROUS_CONTENT':
        harmCategory = HarmCategory.dangerousContent;
        break;
      case 'CIVIC_INTEGRITY':
        harmCategory = HarmCategory.harassment; // Sử dụng harassment thay thế vì không có civicIntegrity
        break;
      default:
        harmCategory = HarmCategory.harassment;
    }

    // Chuyển đổi level string thành HarmBlockThreshold
    switch (level) {
      case 'BLOCK_NONE':
        blockThreshold = HarmBlockThreshold.none;
        break;
      case 'BLOCK_LOW':
        blockThreshold = HarmBlockThreshold.low;
        break;
      case 'BLOCK_MEDIUM':
        blockThreshold = HarmBlockThreshold.medium;
        break;
      case 'BLOCK_HIGH':
        blockThreshold = HarmBlockThreshold.high;
        break;
      default:
        blockThreshold = HarmBlockThreshold.none;
    }

    return SafetySetting(harmCategory, blockThreshold);
  }
  
  Future<void> _initializeModel() async {
    try {
      final apiKey = await Preferences.getApiKey();
      if (apiKey == null || apiKey.isEmpty) {
        print("API key không được cung cấp");
        return;
      }
      
      // Lấy ghi chú hệ thống từ Preferences
      _systemInstructionText = await Preferences.getSystemInstruction();
      
      // Lấy cài đặt an toàn từ Preferences
      _safetySettings = await Preferences.getSafetySettings();
      
      // Lấy tên mô hình từ Preferences
      _currentModelName = await Preferences.getModelName();
      
      // Chuyển đổi cài đặt an toàn thành danh sách SafetySetting
      final safetySettingsList = _safetySettings.entries.map((entry) => 
        _convertSafetySetting(entry.key, entry.value)
      ).toList();
      
      // Tạo GenerativeModel với hoặc không có systemInstruction tùy theo giá trị
      if (_systemInstructionText != null && _systemInstructionText!.isNotEmpty) {
        // Chuyển đổi text thành Content object
        final systemInstruction = Content.text(_systemInstructionText!);
        
        _model = GenerativeModel(
          model: _currentModelName,  // Sử dụng mô hình được chọn
          apiKey: apiKey,
          systemInstruction: systemInstruction,
          safetySettings: safetySettingsList,
          generationConfig: GenerationConfig(
            temperature: 1,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
            responseMimeType: 'text/plain',
          ),
        );
      } else {
        _model = GenerativeModel(
          model: _currentModelName,  // Sử dụng mô hình được chọn
          apiKey: apiKey,
          safetySettings: safetySettingsList,
          generationConfig: GenerationConfig(
            temperature: 1,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
            responseMimeType: 'text/plain',
          ),
        );
      }
      
      _isInitialized = true;
    } catch (e) {
      print("Lỗi khởi tạo model: $e");
    }
  }
  
  Future<void> updateApiKey(String apiKey) async {
    await Preferences.saveApiKey(apiKey);
    _isInitialized = false;
    await _initializeModel();
  }
  
  // Thêm phương thức cập nhật ghi chú hệ thống chung
  Future<void> updateSystemInstruction(String instruction) async {
    await Preferences.saveSystemInstruction(instruction);
    _systemInstructionText = instruction;
    _isInitialized = false;
    await _initializeModel();
  }
  
  // Thêm phương thức cập nhật cài đặt an toàn
  Future<void> updateSafetySettings(Map<String, String> settings) async {
    await Preferences.saveSafetySettings(settings);
    _safetySettings = settings;
    _isInitialized = false;
    await _initializeModel();
  }
  
  // Thêm phương thức lấy cài đặt an toàn hiện tại
  Map<String, String> getSafetySettings() {
    return Map<String, String>.from(_safetySettings);
  }
  
  // Lấy ra ghi chú hệ thống hiện tại
  String? getSystemInstruction() {
    return _systemInstructionText;
  }
  
  Future<void> startNewChat() async {
    if (!_isInitialized) return;
    
    _currentChatHistory = null;
    _chatSession = _model!.startChat(history: []);
  }
  
  Future<void> loadChatHistory(ChatHistory chatHistory) async {
    if (!_isInitialized) return;
    
    _currentChatHistory = chatHistory;
    
    // Nếu chat history có system instruction riêng, tạo model mới với system instruction đó
    if (chatHistory.systemInstruction != null && chatHistory.systemInstruction!.isNotEmpty) {
      final apiKey = await Preferences.getApiKey();
      if (apiKey != null && apiKey.isNotEmpty) {
        // Chuyển đổi text thành Content object
        final systemInstruction = Content.text(chatHistory.systemInstruction!);
        
        final tempModel = GenerativeModel(
          model: _currentModelName,
          apiKey: apiKey,
          systemInstruction: systemInstruction,
          safetySettings: _safetySettings.entries.map((entry) => 
            _convertSafetySetting(entry.key, entry.value)
          ).toList(),
          generationConfig: GenerationConfig(
            temperature: 1,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
            responseMimeType: 'text/plain',
          ),
        );
        
        // Chuyển đổi tin nhắn thành định dạng mà Gemini yêu cầu
        final history = <Content>[];
        
        for (int i = 0; i < chatHistory.messages.length; i++) {
          final message = chatHistory.messages[i];
          if (message.isUser) {
            history.add(Content.text(message.text));
          } else {
            history.add(Content.model([TextPart(message.text)]));
          }
        }
        
        _chatSession = tempModel.startChat(history: history);
        return;
      }
    }
    
    // Chuyển đổi tin nhắn thành định dạng mà Gemini yêu cầu
    final history = <Content>[];
    
    for (int i = 0; i < chatHistory.messages.length; i++) {
      final message = chatHistory.messages[i];
      if (message.isUser) {
        history.add(Content.text(message.text));
      } else {
        history.add(Content.model([TextPart(message.text)]));
      }
    }
    
    _chatSession = _model!.startChat(history: history);
  }
  
  // Phương thức để cập nhật systemInstruction cho chat history hiện tại
  Future<void> updateCurrentChatSystemInstruction(String instruction) async {
    if (_currentChatHistory == null) return;
    
    final updatedHistory = _currentChatHistory!.copyWith(systemInstruction: instruction);
    _currentChatHistory = updatedHistory;
    
    await Preferences.saveChatHistoryItem(updatedHistory);
    
    // Tải lại chat history để áp dụng system instruction mới
    await loadChatHistory(updatedHistory);
  }
  
  Future<String> generateResponse(String query) async {
    if (!_isInitialized) {
      return "Chưa khởi tạo được kết nối với AI. Vui lòng kiểm tra API key trong cài đặt.";
    }
    
    try {
      if (_chatSession == null) {
        _chatSession = _model!.startChat(history: []);
      }
      
      final content = Content.text(query);
      final response = await _chatSession!.sendMessage(content);
      
      // Lưu tin nhắn vào lịch sử nếu có
      if (_currentChatHistory != null) {
        final userMessage = Message(text: query, isUser: true);
        final aiMessage = Message(text: response.text ?? '', isUser: false);
        
        _currentChatHistory = _currentChatHistory!.addMessage(userMessage).addMessage(aiMessage);
        await Preferences.saveChatHistoryItem(_currentChatHistory!);
      } else if (response.text != null) {
        // Tạo lịch sử chat mới nếu chưa có
        final userMessage = Message(text: query, isUser: true);
        final aiMessage = Message(text: response.text!, isUser: false);
        
        _currentChatHistory = ChatHistory.create(
          _generateTitle(query),
          userMessage,
        ).addMessage(aiMessage);
        
        await Preferences.saveChatHistoryItem(_currentChatHistory!);
      }
      
      return response.text ?? 'Không nhận được phản hồi';
    } catch (e) {
      if (e.toString().contains('Failed host lookup') || 
          e.toString().contains('SocketException')) {
        return "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng và thử lại.";
      } else {
        return "Đã xảy ra lỗi: $e";
      }
    }
  }
  
  Stream<String> generateResponseStream(String query, {List<String>? imageUrls}) async* {
    if (!_isInitialized) {
      yield "Chưa khởi tạo được kết nối với AI. Vui lòng kiểm tra API key trong cài đặt.";
      return;
    }
    
    try {
      if (_chatSession == null) {
        _chatSession = _model!.startChat(history: []);
      }

      // Tạo content với text và ảnh
      List<Part> parts = [];
      if (query.isNotEmpty) {
        parts.add(TextPart(query));
      }

      // Thêm ảnh vào parts nếu có
      if (imageUrls != null && imageUrls.isNotEmpty) {
        for (var imagePath in imageUrls) {
          try {
            // Kiểm tra xem ảnh đã được cache chưa
            final cachedPath = _imageCache[imagePath] ?? imagePath;
            final imagePart = await fileToPart('image/jpeg', cachedPath);
            parts.add(imagePart);
          } catch (e) {
            print('Lỗi khi xử lý ảnh $imagePath: $e');
          }
        }
      }

      final content = Content.multi(parts);
      String fullResponse = "";
      
      final responseStream = _chatSession!.sendMessageStream(content);
      
      final userMessage = Message(
        text: query,
        isUser: true,
        images: imageUrls ?? [],
      );
      
      // Cập nhật lịch sử chat
      if (_currentChatHistory == null) {
        _currentChatHistory = ChatHistory.create(
          _generateTitle(query),
          userMessage,
        );
        await Preferences.saveChatHistoryItem(_currentChatHistory!);
      } else {
        _currentChatHistory = _currentChatHistory!.addMessage(userMessage);
        await Preferences.saveChatHistoryItem(_currentChatHistory!);
      }
      
      await for (final response in responseStream) {
        if (response.text != null) {
          fullResponse += response.text!;
          yield fullResponse;
        }
      }
      
      // Lưu tin nhắn AI vào lịch sử
      final aiMessage = Message(text: fullResponse, isUser: false);
      _currentChatHistory = _currentChatHistory!.addMessage(aiMessage);
      await Preferences.saveChatHistoryItem(_currentChatHistory!);
      
    } catch (e) {
      yield 'Đã xảy ra lỗi: $e';
    }
  }
  
  String _generateTitle(String query) {
    // Tạo tiêu đề từ câu hỏi đầu tiên
    if (query.length > 30) {
      return query.substring(0, 30) + '...';
    }
    return query;
  }
  
  ChatHistory? get currentChatHistory => _currentChatHistory;

  // Thêm hàm helper để chuyển đổi File thành DataPart
  Future<DataPart> fileToPart(String mimeType, String path) async {
    return DataPart(mimeType, await File(path).readAsBytes());
  }

  // Cập nhật hàm upload ảnh để lưu vào bộ đệm
  Future<List<String>> uploadImages(List<File> images) async {
    List<String> cachedPaths = [];
    
    try {
      final appDir = await getApplicationDocumentsDirectory();
      final imageDir = Directory('${appDir.path}/chat_images');
      
      if (!await imageDir.exists()) {
        await imageDir.create(recursive: true);
      }
      
      for (var image in images) {
        final fileName = path.basename(image.path);
        final timestamp = DateTime.now().millisecondsSinceEpoch;
        final newFileName = '${timestamp}_$fileName';
        final targetPath = '${imageDir.path}/$newFileName';
        
        // Sao chép ảnh vào thư mục ứng dụng
        final newFile = await image.copy(targetPath);
        
        // Lưu vào cache
        _imageCache[image.path] = newFile.path;
        cachedPaths.add(newFile.path);
      }
      
      return cachedPaths;
    } catch (e) {
      print('Lỗi khi lưu ảnh: $e');
      // Nếu có lỗi, trả về đường dẫn gốc
      return images.map((file) => file.path).toList();
    }
  }
  
  // Thêm hàm để xóa ảnh cũ
  Future<void> cleanupOldImages({int maxAgeDays = 30}) async {
    try {
      final appDir = await getApplicationDocumentsDirectory();
      final imageDir = Directory('${appDir.path}/chat_images');
      
      if (!await imageDir.exists()) return;
      
      // Lấy tất cả lịch sử trò chuyện để kiểm tra ảnh đang sử dụng
      final allChatHistories = await Preferences.getChatHistories();
      
      // Thu thập tất cả các đường dẫn ảnh đang được sử dụng
      final Set<String> usedImagePaths = {};
      for (final history in allChatHistories) {
        for (final message in history.messages) {
          usedImagePaths.addAll(message.images);
        }
      }
      
      final now = DateTime.now();
      final files = await imageDir.list().toList();
      
      for (final entity in files) {
        if (entity is File) {
          final filePath = entity.path;
          
          // Bỏ qua file nếu nó đang được sử dụng trong bất kỳ cuộc trò chuyện nào
          if (usedImagePaths.contains(filePath)) {
            continue;
          }
          
          // Xóa file cũ nếu vượt quá thời gian maxAgeDays
          final fileName = path.basename(filePath);
          // Kiểm tra xem tên file có timestamp không
          if (fileName.contains('_')) {
            final timestampStr = fileName.split('_').first;
            if (int.tryParse(timestampStr) != null) {
              final timestamp = int.parse(timestampStr);
              final fileDate = DateTime.fromMillisecondsSinceEpoch(timestamp);
              final difference = now.difference(fileDate).inDays;
              
              if (difference > maxAgeDays) {
                await entity.delete();
              }
            }
          }
        }
      }
    } catch (e) {
      print('Lỗi khi xóa ảnh cũ: $e');
    }
  }
  
  // Cập nhật hàm lưu lịch sử chat
  Future<void> saveChatHistory() async {
    if (_currentChatHistory != null) {
      await Preferences.saveChatHistoryItem(_currentChatHistory!);
    }
  }
  
  // Thêm hàm để lấy ảnh từ cache
  String? getCachedImagePath(String originalPath) {
    return _imageCache[originalPath];
  }

  // Chuẩn bị thư mục ảnh và dọn dẹp ảnh cũ khi khởi động
  Future<void> _prepareImageDirectory() async {
    try {
      final appDir = await getApplicationDocumentsDirectory();
      final imageDir = Directory('${appDir.path}/chat_images');
      
      if (!await imageDir.exists()) {
        await imageDir.create(recursive: true);
      }
      
      // Dọn dẹp ảnh cũ khi khởi động
      await cleanupOldImages();
    } catch (e) {
      print('Lỗi khi chuẩn bị thư mục ảnh: $e');
    }
  }

  // Phương thức để lấy chat history hiện tại
  Future<ChatHistory?> getCurrentChatHistory() async {
    return _currentChatHistory;
  }
  
  // Phương thức để kiểm tra xem có chat history hiện tại hay không
  Future<bool> hasCurrentChatHistory() async {
    return _currentChatHistory != null;
  }

  // Thêm phương thức cập nhật mô hình
  Future<void> updateModel(String modelName) async {
    if (!availableModels.contains(modelName)) {
      throw Exception('Mô hình không hợp lệ');
    }
    await Preferences.saveModelName(modelName);
    _currentModelName = modelName;
    _isInitialized = false;
    await _initializeModel();
  }
  
  // Thêm phương thức lấy tên mô hình hiện tại
  String getCurrentModel() {
    return _currentModelName;
  }
  
  // Thêm phương thức lấy danh sách mô hình có sẵn
  List<String> getAvailableModels() {
    return List<String>.from(availableModels);
  }
} 