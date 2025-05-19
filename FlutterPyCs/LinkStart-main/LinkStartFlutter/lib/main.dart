import 'package:english_words/english_words.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'screens/slide_screen.dart';
import 'styles/app_styles.dart';
import 'package:firebase_core/firebase_core.dart';
import 'screens/demo_screen.dart';

void main() async {
  try {
    WidgetsFlutterBinding.ensureInitialized();
    await Firebase.initializeApp(
      options: const FirebaseOptions(
        apiKey: 'AIzaSyAldHjX34k4iEc-kVMSdDzqy3X6guUaULI',
        appId: '1:1009587902855:android:a76ba8337b7999a0855b22',
        messagingSenderId: '1009587902855',
        projectId: 'test-e61cd',
        databaseURL:
            'https://test-e61cd-default-rtdb.asia-southeast1.firebasedatabase.app',
        storageBucket: 'test-e61cd.firebasestorage.app',
      ),
    );
    runApp(const MyApp());
  } catch (e) {
    print('Lỗi khởi tạo Firebase: $e');
  }
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (context) => MyAppState(),
      child: MaterialApp(
        title: 'LinkStart',
        theme: ThemeData(
          useMaterial3: true,
          colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepOrange),
        ),
        home: MyHomePage(),
      ),
    );
  }
}

class MyAppState extends ChangeNotifier {
  var current = WordPair.random();
}

class MyHomePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppStyles.getTechAppBar('LinkStart'),
      body: SafeArea(
        child: Container(
          decoration: BoxDecoration(gradient: AppStyles.backgroundGradient),
          child: Stack(
            children: [
              Positioned.fill(
                child: CustomPaint(painter: GridPainter()),
              ),
              Padding(
                padding: EdgeInsets.symmetric(horizontal: 24.0),
                child: Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      Container(
                        padding: EdgeInsets.all(24),
                        decoration: AppStyles.getTechContainerDecoration(),
                        child: Column(
                          children: [
                            ShaderMask(
                              shaderCallback: (bounds) =>
                                  AppStyles.titleGradient.createShader(bounds),
                              child: Text('LinkStart',
                                  style: AppStyles.titleStyle),
                            ),
                            SizedBox(height: 4),
                            Container(
                              height: 2,
                              width: 100,
                              decoration: BoxDecoration(
                                gradient: AppStyles.titleGradient,
                              ),
                            ),
                          ],
                        ),
                      ),
                      SizedBox(height: 50),
                      AppStyles.buildTechButton(
                        'Chuyển Slide',
                        Icons.slideshow,
                        () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                                builder: (context) => SlideScreen()),
                          );
                        },
                      ),
                      SizedBox(height: 20),
                      AppStyles.buildTechButton(
                        'Chạy Demo',
                        Icons.play_arrow,
                        () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => DemoScreen(),
                            ),
                          );
                        },
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
