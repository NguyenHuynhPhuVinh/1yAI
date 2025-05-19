import 'package:firebase_database/firebase_database.dart';

class FirebaseService {
  final DatabaseReference _database = FirebaseDatabase.instance.ref();

  Future<void> updateSlideValue(int value) async {
    try {
      await _database.child('slide').set(value);
    } catch (e) {
      print('Error updating slide value: $e');
      throw e;
    }
  }

  Future<void> updateScreenValue(String screen) async {
    try {
      await _database.child('screen').set(screen);
    } catch (e) {
      print('Error updating screen value: $e');
      throw e;
    }
  }

  Future<void> updateAction(String action) async {
    try {
      await _database.child('action').set(action);
    } catch (e) {
      print('Error updating action value: $e');
      throw e;
    }
  }
}
