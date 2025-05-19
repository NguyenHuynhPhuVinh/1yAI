class Website {
  final String id;
  final String name;
  final List<String> description;
  final List<String> tags;
  final String link;
  final List<String> keyFeatures;
  int? view;
  final int? heart;
  double? evaluation;
  final String? image;

  Website({
    required this.id,
    required this.name,
    required this.description,
    required this.tags,
    required this.link,
    required this.keyFeatures,
    this.view,
    this.heart,
    this.evaluation,
    this.image,
  });

  factory Website.fromJson(Map<String, dynamic> json) {
    return Website(
      id: json['id'] ?? json['_id'],
      name: json['name'],
      description: List<String>.from(json['description']),
      tags: List<String>.from(json['tags']),
      link: json['link'],
      keyFeatures: List<String>.from(json['keyFeatures']),
      image: json['image'],
      view: json['view'],
      heart: json['heart'],
      evaluation: json['evaluation']?.toDouble(),
    );
  }
}
