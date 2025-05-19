import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/website.dart';

class ApiService {
  static const String baseUrl = 'https://showai.io.vn';

  Future<Map<String, dynamic>> searchWebsites(
      {String? query, String? tag}) async {
    try {
      final queryParams = {
        if (query != null) 'q': query,
        if (tag != null) 'tag': tag,
      };

      final uri = Uri.parse('$baseUrl/api/showai')
          .replace(queryParameters: queryParams);
      final response = await http.get(uri);

      if (response.statusCode == 200) {
        final data = json.decode(utf8.decode(response.bodyBytes));
        return {
          'websites': (data['data'] as List)
              .map((item) => Website.fromJson(item))
              .toList(),
          'tags': List<String>.from(data['tags'] ?? []),
        };
      } else {
        throw Exception('Failed to load data');
      }
    } catch (e) {
      throw Exception('Error: $e');
    }
  }
}
