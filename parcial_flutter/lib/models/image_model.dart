class ImageModel {
  final int id;
  final String url;
  final int productoId;

  ImageModel({
    required this.id,
    required this.url,
    required this.productoId,
  });

  factory ImageModel.fromJson(Map<String, dynamic> json) {
    return ImageModel(
      id: json['id'],
      url: json['url'],
      productoId: json['producto_id'],
    );
  }
}

