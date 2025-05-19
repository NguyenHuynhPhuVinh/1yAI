import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:http/http.dart' as http;
import 'dart:convert' show json, utf8;

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();

  // Yêu cầu quyền thông báo
  NotificationSettings settings =
      await FirebaseMessaging.instance.requestPermission(
    alert: true,
    badge: true,
    sound: true,
  );

  // Đăng ký topic "all"
  try {
    await FirebaseMessaging.instance.subscribeToTopic('all');
    print('Đăng ký topic "all" thành công');
  } catch (e) {
    print('Đăng ký topic "all" thất bại: $e');
  }

  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'ShowAI Manager',
      theme: ThemeData.dark().copyWith(
        primaryColor: Colors.blue,
        scaffoldBackgroundColor: Color(0xFF1A1A1A),
        cardTheme: CardTheme(
          color: Color(0xFF2D2D2D),
          elevation: 8,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
        ),
        appBarTheme: AppBarTheme(
          backgroundColor: Color(0xFF2D2D2D),
          elevation: 0,
        ),
      ),
      home: MyHomePage(),
    );
  }
}

class MyHomePage extends StatefulWidget {
  @override
  _MyHomePageState createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  List<dynamic> submissions = [];
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    fetchSubmissions();
  }

  Future<void> fetchSubmissions() async {
    setState(() => isLoading = true);
    try {
      final response =
          await http.get(Uri.parse('https://showai.io.vn/api/submissions'));
      if (response.statusCode == 200) {
        setState(() {
          // Thêm utf8.decode để xử lý đúng các ký tự tiếng Việt
          submissions =
              json.decode(utf8.decode(response.bodyBytes))['submissions'];
          isLoading = false;
        });
      }
    } catch (e) {
      print('Lỗi khi tải dữ liệu: $e');
      setState(() => isLoading = false);
    }
  }

  Future<void> handleSubmission(String id, {bool approve = false}) async {
    try {
      final url = 'https://showai.io.vn/api/submissions'; // URL đơn giản hơn

      final response = await http.patch(Uri.parse(url),
          headers: {'Content-Type': 'application/json'},
          body: json.encode(
              {'submissionId': id, 'action': approve ? 'add' : 'delete'}));

      if (response.statusCode == 200) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(approve ? 'Đã duyệt bài đăng' : 'Đã xóa bài đăng'),
            backgroundColor: approve ? Colors.green : Colors.red,
          ),
        );
        await fetchSubmissions(); // Refresh danh sách
      } else {
        throw Exception('Lỗi server: ${response.statusCode}');
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Có lỗi xảy ra: $e'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('ShowAI Manager'),
        actions: [
          IconButton(
            icon: Icon(Icons.refresh),
            onPressed: fetchSubmissions,
          ),
        ],
      ),
      body: isLoading
          ? Center(child: CircularProgressIndicator())
          : submissions.isEmpty
              ? Center(child: Text('Không có bài đăng nào'))
              : ListView.builder(
                  itemCount: submissions.length,
                  itemBuilder: (context, index) {
                    final submission = submissions[index];
                    return Card(
                      margin: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Header với thông tin người đăng
                          Container(
                            padding: EdgeInsets.all(16),
                            decoration: BoxDecoration(
                              color: Color(0xFF353535),
                              borderRadius: BorderRadius.only(
                                topLeft: Radius.circular(16),
                                topRight: Radius.circular(16),
                              ),
                            ),
                            child: Row(
                              children: [
                                CircleAvatar(
                                  radius: 25,
                                  backgroundImage: NetworkImage(
                                    'https://ui-avatars.com/api/?name=${submission['displayName'] ?? 'Anonymous'}&background=random',
                                  ),
                                ),
                                SizedBox(width: 12),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        submission['displayName'] ?? 'Ẩn danh',
                                        style: TextStyle(
                                          fontSize: 18,
                                          fontWeight: FontWeight.bold,
                                          color: Colors.white,
                                        ),
                                      ),
                                      Text(
                                        DateTime.parse(
                                                submission['submittedAt'])
                                            .toLocal()
                                            .toString()
                                            .substring(0, 16),
                                        style: TextStyle(
                                          color: Colors.grey[400],
                                          fontSize: 14,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                                Container(
                                  padding: EdgeInsets.symmetric(
                                      horizontal: 8, vertical: 4),
                                  decoration: BoxDecoration(
                                    color: submission['status'] == 'pending'
                                        ? Colors.orange.withOpacity(0.2)
                                        : Colors.green.withOpacity(0.2),
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                  child: Text(
                                    submission['status'] ?? 'pending',
                                    style: TextStyle(
                                      color: submission['status'] == 'pending'
                                          ? Colors.orange[300]
                                          : Colors.green[300],
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),

                          // Ảnh bài đăng
                          if (submission['image'] != null)
                            Container(
                              height: 250,
                              width: double.infinity,
                              child: ClipRRect(
                                child: Image.network(
                                  submission['image'],
                                  fit: BoxFit.cover,
                                ),
                              ),
                            ),

                          Padding(
                            padding: EdgeInsets.all(16),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                // ID
                                Container(
                                  padding: EdgeInsets.symmetric(
                                      horizontal: 8, vertical: 4),
                                  decoration: BoxDecoration(
                                    color: Colors.blue.withOpacity(0.2),
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: Text(
                                    'ID: ${submission['_id']}',
                                    style: TextStyle(
                                      color: Colors.blue[300],
                                      fontSize: 12,
                                    ),
                                  ),
                                ),
                                SizedBox(height: 12),

                                // Tên bài đăng
                                Text(
                                  submission['name'] ?? '',
                                  style: TextStyle(
                                    fontSize: 24,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.white,
                                  ),
                                ),
                                SizedBox(height: 16),

                                // Link
                                if (submission['link'] != null) ...[
                                  _buildSectionTitle('Link'),
                                  Container(
                                    padding: EdgeInsets.all(12),
                                    decoration: BoxDecoration(
                                      color: Color(0xFF353535),
                                      borderRadius: BorderRadius.circular(8),
                                    ),
                                    child: Text(
                                      submission['link'],
                                      style: TextStyle(color: Colors.blue[300]),
                                    ),
                                  ),
                                  SizedBox(height: 16),
                                ],

                                // Mô tả
                                if (submission['description'] != null) ...[
                                  _buildSectionTitle('Mô tả'),
                                  Container(
                                    padding: EdgeInsets.all(12),
                                    decoration: BoxDecoration(
                                      color: Color(0xFF353535),
                                      borderRadius: BorderRadius.circular(8),
                                    ),
                                    child: Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: (submission['description']
                                              as List)
                                          .map((desc) => Padding(
                                                padding: EdgeInsets.symmetric(
                                                    vertical: 4),
                                                child: Row(
                                                  crossAxisAlignment:
                                                      CrossAxisAlignment.start,
                                                  children: [
                                                    Icon(Icons.arrow_right,
                                                        color:
                                                            Colors.blue[300]),
                                                    SizedBox(width: 8),
                                                    Expanded(
                                                      child: Text(
                                                        desc.toString(),
                                                        style: TextStyle(
                                                            color: Colors
                                                                .grey[300]),
                                                      ),
                                                    ),
                                                  ],
                                                ),
                                              ))
                                          .toList(),
                                    ),
                                  ),
                                  SizedBox(height: 16),
                                ],

                                // Tags
                                if (submission['tags'] != null) ...[
                                  _buildSectionTitle('Tags'),
                                  Wrap(
                                    spacing: 8,
                                    runSpacing: 8,
                                    children: (submission['tags'] as List)
                                        .map((tag) => Container(
                                              padding: EdgeInsets.symmetric(
                                                  horizontal: 12, vertical: 6),
                                              decoration: BoxDecoration(
                                                color: Colors.blue
                                                    .withOpacity(0.2),
                                                borderRadius:
                                                    BorderRadius.circular(20),
                                              ),
                                              child: Text(
                                                '#${tag.toString()}',
                                                style: TextStyle(
                                                  color: Colors.blue[300],
                                                  fontSize: 14,
                                                ),
                                              ),
                                            ))
                                        .toList(),
                                  ),
                                  SizedBox(height: 16),
                                ],

                                // Tính năng chính
                                if (submission['keyFeatures'] != null) ...[
                                  _buildSectionTitle('Tính năng chính'),
                                  Container(
                                    padding: EdgeInsets.all(12),
                                    decoration: BoxDecoration(
                                      color: Color(0xFF353535),
                                      borderRadius: BorderRadius.circular(8),
                                    ),
                                    child: Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: (submission['keyFeatures']
                                              as List)
                                          .map((feature) => Padding(
                                                padding: EdgeInsets.symmetric(
                                                    vertical: 4),
                                                child: Row(
                                                  crossAxisAlignment:
                                                      CrossAxisAlignment.start,
                                                  children: [
                                                    Icon(Icons.check_circle,
                                                        color:
                                                            Colors.green[300],
                                                        size: 20),
                                                    SizedBox(width: 8),
                                                    Expanded(
                                                      child: Text(
                                                        feature.toString(),
                                                        style: TextStyle(
                                                            color: Colors
                                                                .grey[300]),
                                                      ),
                                                    ),
                                                  ],
                                                ),
                                              ))
                                          .toList(),
                                    ),
                                  ),
                                  SizedBox(height: 24),
                                ],

                                // Nút điều khiển
                                Row(
                                  children: [
                                    Expanded(
                                      child: ElevatedButton.icon(
                                        onPressed: () => handleSubmission(
                                          submission['_id'],
                                          approve: true,
                                        ),
                                        icon: Icon(Icons.check_circle),
                                        label: Text('Duyệt'),
                                        style: ElevatedButton.styleFrom(
                                          backgroundColor: Colors.green[700],
                                          foregroundColor: Colors.white,
                                          padding: EdgeInsets.symmetric(
                                              vertical: 16),
                                          shape: RoundedRectangleBorder(
                                            borderRadius:
                                                BorderRadius.circular(12),
                                          ),
                                        ),
                                      ),
                                    ),
                                    SizedBox(width: 12),
                                    Expanded(
                                      child: ElevatedButton.icon(
                                        onPressed: () => handleSubmission(
                                          submission['_id'],
                                          approve: false,
                                        ),
                                        icon: Icon(Icons.delete_forever),
                                        label: Text('Xóa'),
                                        style: ElevatedButton.styleFrom(
                                          backgroundColor: Colors.red[700],
                                          foregroundColor: Colors.white,
                                          padding: EdgeInsets.symmetric(
                                              vertical: 16),
                                          shape: RoundedRectangleBorder(
                                            borderRadius:
                                                BorderRadius.circular(12),
                                          ),
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    );
                  },
                ),
    );
  }
}

// Thêm widget helper để tạo tiêu đề section
Widget _buildSectionTitle(String title) {
  return Padding(
    padding: EdgeInsets.only(bottom: 8),
    child: Text(
      title,
      style: TextStyle(
        fontSize: 16,
        fontWeight: FontWeight.bold,
        color: Colors.grey[400],
      ),
    ),
  );
}
