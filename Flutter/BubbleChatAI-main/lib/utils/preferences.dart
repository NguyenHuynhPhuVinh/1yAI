import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/chat_history.dart';

class Preferences {
  static const String apiKeyKey = 'gemini_api_key';
  static const String chatHistoryKey = 'chat_history';
  static const String systemInstructionKey = 'system_instruction';
  static const String safetySettingsKey = 'safety_settings';
  static const String modelNameKey = 'model_name';
  
  static Future<void> saveApiKey(String apiKey) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(apiKeyKey, apiKey);
  }
  
  static Future<String?> getApiKey() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(apiKeyKey);
  }
  
  static Future<void> saveSystemInstruction(String instruction) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(systemInstructionKey, instruction);
  }
  
  static Future<String?> getSystemInstruction() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(systemInstructionKey);
  }
  
  static Future<void> saveModelName(String modelName) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(modelNameKey, modelName);
  }
  
  static Future<String> getModelName() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(modelNameKey) ?? 'gemini-2.0-flash';
  }
  
  static Future<void> saveSafetySettings(Map<String, String> settings) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(safetySettingsKey, jsonEncode(settings));
  }
  
  static Future<Map<String, String>> getSafetySettings() async {
    final prefs = await SharedPreferences.getInstance();
    final settingsJson = prefs.getString(safetySettingsKey);
    if (settingsJson != null) {
      return Map<String, String>.from(jsonDecode(settingsJson));
    }
    return {
      'HARASSMENT': 'BLOCK_NONE',
      'HATE_SPEECH': 'BLOCK_NONE',
      'SEXUALLY_EXPLICIT': 'BLOCK_NONE',
      'DANGEROUS_CONTENT': 'BLOCK_NONE',
      'CIVIC_INTEGRITY': 'BLOCK_NONE',
    };
  }
  
  static Future<void> saveChatHistory(List<ChatHistory> chatHistories) async {
    final prefs = await SharedPreferences.getInstance();
    final jsonList = chatHistories.map((history) => jsonEncode(history.toJson())).toList();
    await prefs.setStringList(chatHistoryKey, jsonList);
  }
  
  static Future<List<ChatHistory>> getChatHistories() async {
    final prefs = await SharedPreferences.getInstance();
    final jsonList = prefs.getStringList(chatHistoryKey) ?? [];
    return jsonList
        .map((json) => ChatHistory.fromJson(jsonDecode(json)))
        .toList()
        ..sort((a, b) => b.lastUpdatedAt.compareTo(a.lastUpdatedAt));
  }
  
  static Future<void> saveChatHistoryItem(ChatHistory chatHistory) async {
    final histories = await getChatHistories();
    final index = histories.indexWhere((h) => h.id == chatHistory.id);
    
    if (index >= 0) {
      histories[index] = chatHistory;
    } else {
      histories.add(chatHistory);
    }
    
    await saveChatHistory(histories);
  }
  
  static Future<void> deleteChatHistory(String id) async {
    final histories = await getChatHistories();
    histories.removeWhere((h) => h.id == id);
    await saveChatHistory(histories);
  }
} 