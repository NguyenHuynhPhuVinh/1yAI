class ModelInfo {
  final String name;
  final String icon;
  final String modal;
  final String? description;

  ModelInfo(
      {required this.name,
      required this.icon,
      required this.modal,
      this.description});
}

class ModelGroup {
  final String provider;
  final List<ModelInfo> models;

  ModelGroup({required this.provider, required this.models});
}

class ChatMessage {
  final String text;
  final bool isUser;
  final List<String>? images;

  ChatMessage({required this.text, required this.isUser, this.images});
}
