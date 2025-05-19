import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert' show utf8, json;
import 'models/website.dart';
import 'screens/search_page.dart';
import 'screens/login_page.dart';
import 'widgets/website_card.dart';
import 'package:firebase_core/firebase_core.dart';
import 'firebase_options.dart';
import 'screens/account_page.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'widgets/persistent_search_bar.dart';
import 'services/api_service.dart';
import 'screens/chat_page.dart';
import 'theme/app_theme.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'services/banner_state.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'screens/ranking_page.dart';

// Thêm hàm xử lý background message
@pragma('vm:entry-point')
Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);
  print("Handling a background message: ${message.messageId}");
}

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Khởi tạo Firebase
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );

  // Đăng ký handler cho background messages
  FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);

  // Yêu cầu quyền thông báo
  await FirebaseMessaging.instance.requestPermission(
    alert: true,
    badge: true,
    sound: true,
    provisional: false,
  );

  // Đăng ký cả 2 topics
  await FirebaseMessaging.instance.subscribeToTopic('new');
  await FirebaseMessaging.instance.subscribeToTopic('update');

  // Hủy đăng ký topic all
  await FirebaseMessaging.instance.unsubscribeFromTopic('all');

  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'ShowAI',
      theme: AppTheme.darkTheme,
      home: StreamBuilder<User?>(
        stream: FirebaseAuth.instance.authStateChanges(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(
              child: CircularProgressIndicator(
                color: AppTheme.primaryColor,
              ),
            );
          }
          return const MainScreen();
        },
      ),
      routes: {
        '/login': (context) => const LoginPage(),
        '/account': (context) => const AccountPage(),
      },
    );
  }
}

class MainScreen extends StatefulWidget {
  const MainScreen({super.key});

  @override
  State<MainScreen> createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  int _selectedIndex = 0;
  bool _isLoggedIn = false;
  final _apiService = ApiService();
  bool _showBanner = true;
  bool _hasUpdate = false;
  String? _updateMessage;

  final List<Widget> _screens = [
    const HomePage(),
    const ChatPage(),
    const RankingPage(),
    const LoginPage(),
  ];

  @override
  void initState() {
    super.initState();
    _loadBannerPreference();
    BannerState.showBanner.addListener(_onBannerStateChanged);
    FirebaseAuth.instance.authStateChanges().listen((User? user) {
      setState(() {
        _isLoggedIn = user != null;
      });
    });
    _setupFCM();
    // Kiểm tra và hiển thị dialog cập nhật khi vào app
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_hasUpdate) {
        _showUpdateDialog();
      }
    });
  }

  @override
  void dispose() {
    BannerState.showBanner.removeListener(_onBannerStateChanged);
    super.dispose();
  }

  void _onBannerStateChanged() {
    setState(() {
      _showBanner = BannerState.showBanner.value;
    });
  }

  Future<void> _loadBannerPreference() async {
    final prefs = await SharedPreferences.getInstance();
    final showBanner = prefs.getBool('show_banner') ?? true;
    setState(() {
      _showBanner = showBanner;
    });
    BannerState.showBanner.value = showBanner;
  }

  void _navigateToSearch() {
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (context) => const SearchPage(),
      ),
    );
  }

  void _setupFCM() {
    // Xử lý khi nhận message trong foreground
    FirebaseMessaging.onMessage.listen((RemoteMessage message) {
      if (message.notification != null) {
        if (message.data['type'] == 'update') {
          // Xử lý thông báo cập nhật
          setState(() {
            _hasUpdate = true;
            _updateMessage = message.notification!.body;
          });
          _showUpdateDialog();
        } else {
          // Xử lý thông báo thông thường
          final notificationBody =
              '${message.data['name']} - ${message.data['displayName']}';

          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    message.notification!.title ?? 'Thông báo mới',
                    style: const TextStyle(fontWeight: FontWeight.bold),
                  ),
                  Text(notificationBody),
                ],
              ),
              action: SnackBarAction(
                label: 'Xem',
                onPressed: () {
                  // Không làm gì cả vì đã ở trong app
                },
              ),
              duration: const Duration(seconds: 5),
            ),
          );
        }
      }
    });

    // Xử lý khi click vào notification khi app đang chạy background
    FirebaseMessaging.onMessageOpenedApp.listen((RemoteMessage message) {
      if (message.data['type'] == 'update') {
        setState(() {
          _hasUpdate = true;
          _updateMessage = message.notification!.body;
        });
        _showUpdateDialog();
      } else {
        print('Notification clicked - Opening app');
      }
    });

    // Lấy FCM token để debug
    FirebaseMessaging.instance.getToken().then((token) {
      print('FCM Token: $token');
    });
  }

  void _showUpdateDialog() {
    if (_hasUpdate && context.mounted) {
      showDialog(
        context: context,
        barrierDismissible: false,
        builder: (context) => AlertDialog(
          backgroundColor: AppTheme.cardColor,
          title: Text(
            'Cập nhật mới',
            style: TextStyle(
              color: AppTheme.textColor,
              fontWeight: FontWeight.bold,
            ),
          ),
          content: Text(
            _updateMessage ?? 'Có phiên bản mới của ứng dụng.',
            style: TextStyle(color: AppTheme.textColor),
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: Text(
                'Để sau',
                style: TextStyle(color: AppTheme.primaryColor),
              ),
            ),
            TextButton(
              onPressed: () async {
                final uri = Uri.parse('https://showai.io.vn');
                try {
                  await launchUrl(
                    uri,
                    mode: LaunchMode.externalApplication,
                  );
                } catch (e) {
                  if (context.mounted) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text(
                          'Không thể mở trình duyệt',
                          style: TextStyle(color: AppTheme.textColor),
                        ),
                        backgroundColor: AppTheme.cardColor,
                      ),
                    );
                  }
                }
              },
              child: Text(
                'Cập nhật ngay',
                style: TextStyle(color: AppTheme.primaryColor),
              ),
            ),
          ],
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    _screens[3] = _isLoggedIn ? const AccountPage() : const LoginPage();

    return Scaffold(
      backgroundColor: AppTheme.backgroundColor,
      body: SafeArea(
        child: Column(
          children: [
            if (_selectedIndex == 0 && _showBanner)
              InkWell(
                onTap: () async {
                  final uri = Uri.parse('https://showai.io.vn');
                  try {
                    if (!await launchUrl(
                      uri,
                      mode: LaunchMode.externalApplication,
                      webOnlyWindowName: '_blank',
                    )) {
                      if (context.mounted) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Không thể m link này'),
                          ),
                        );
                      }
                    }
                  } catch (e) {
                    if (context.mounted) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('Có lỗi xảy ra khi mở link'),
                        ),
                      );
                    }
                  }
                },
                child: Container(
                  margin: const EdgeInsets.fromLTRB(16, 8, 16, 0),
                  padding:
                      const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        AppTheme.primaryColor.withOpacity(0.8),
                        AppTheme.primaryColor.withOpacity(0.6),
                      ],
                    ),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Row(
                    children: [
                      Icon(
                        Icons.language,
                        color: AppTheme.textColor,
                        size: 24,
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Truy cập ShowAI trên Web',
                              style: TextStyle(
                                color: AppTheme.textColor,
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              'showai.io.vn',
                              style: TextStyle(
                                color: AppTheme.textColor.withOpacity(0.8),
                                fontSize: 14,
                              ),
                            ),
                          ],
                        ),
                      ),
                      Icon(
                        Icons.arrow_forward_ios,
                        color: AppTheme.textColor,
                        size: 20,
                      ),
                    ],
                  ),
                ),
              ),
            PersistentSearchBar(
              onTap: _navigateToSearch,
            ),
            Expanded(
              child: _screens[_selectedIndex],
            ),
          ],
        ),
      ),
      bottomNavigationBar: NavigationBar(
        height: 60,
        backgroundColor: AppTheme.cardColor,
        selectedIndex: _selectedIndex,
        onDestinationSelected: (index) {
          setState(() {
            _selectedIndex = index;
          });
        },
        destinations: [
          NavigationDestination(
            icon: Icon(Icons.home, color: AppTheme.primaryColor),
            label: 'Trang chủ',
          ),
          NavigationDestination(
            icon: Icon(Icons.chat, color: AppTheme.primaryColor),
            label: 'Trò chuyện',
          ),
          NavigationDestination(
            icon: Icon(Icons.leaderboard, color: AppTheme.primaryColor),
            label: 'BXH',
          ),
          NavigationDestination(
            icon: Icon(Icons.person, color: AppTheme.primaryColor),
            label: _isLoggedIn ? 'Tài khoản' : 'Đăng nhập',
          ),
        ],
      ),
    );
  }
}

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  List<Website> allWebsites = [];
  List<List<Website>> pages = [];
  int currentPage = 0;
  bool isLoading = true;
  static const int itemsPerPage = 8;
  final PageController _pageController = PageController();

  @override
  void initState() {
    super.initState();
    fetchWebsites();
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  Future<void> fetchWebsites() async {
    try {
      final response =
          await http.get(Uri.parse('https://showai.io.vn/api/showai'));
      if (response.statusCode == 200) {
        final data = json.decode(utf8.decode(response.bodyBytes));
        setState(() {
          allWebsites = (data['data'] as List)
              .map((item) => Website.fromJson(item))
              .toList();

          // Phân trang
          pages = [];
          for (var i = 0; i < allWebsites.length; i += itemsPerPage) {
            pages.add(
              allWebsites.sublist(
                i,
                i + itemsPerPage > allWebsites.length
                    ? allWebsites.length
                    : i + itemsPerPage,
              ),
            );
          }

          isLoading = false;
        });
      }
    } catch (e) {
      print('Lỗi khi tải dữ liệu: $e');
      setState(() => isLoading = false);
    }
  }

  void _onPageChanged(int page) {
    setState(() {
      currentPage = page;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.backgroundColor,
      body: isLoading
          ? Center(
              child: CircularProgressIndicator(
                color: AppTheme.primaryColor,
              ),
            )
          : Column(
              children: [
                Expanded(
                  child: PageView.builder(
                    controller: _pageController,
                    onPageChanged: _onPageChanged,
                    itemCount: pages.length,
                    itemBuilder: (context, pageIndex) {
                      return SingleChildScrollView(
                        child: Padding(
                          padding: const EdgeInsets.all(16),
                          child: LayoutBuilder(
                            builder: (context, constraints) {
                              final itemWidth = (constraints.maxWidth - 16) / 2;
                              return Wrap(
                                spacing: 16,
                                runSpacing: 16,
                                children: List.generate(
                                  pages[pageIndex].length,
                                  (index) => SizedBox(
                                    width: itemWidth,
                                    child: WebsiteCard(
                                      website: pages[pageIndex][index],
                                      showDescription: false,
                                    ),
                                  ),
                                ),
                              );
                            },
                          ),
                        ),
                      );
                    },
                  ),
                ),
                if (pages.length > 1)
                  Container(
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: List.generate(
                        pages.length,
                        (index) => Container(
                          width: 8,
                          height: 8,
                          margin: const EdgeInsets.symmetric(horizontal: 4),
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            color: currentPage == index
                                ? AppTheme.primaryColor
                                : AppTheme.primaryColor.withOpacity(0.2),
                          ),
                        ),
                      ),
                    ),
                  ),
              ],
            ),
    );
  }
}
