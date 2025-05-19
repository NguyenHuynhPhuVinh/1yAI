import 'package:flutter/material.dart';
import '../models/chat_models.dart';
import '../theme/app_theme.dart';

class ModelSelectionScreen extends StatelessWidget {
  final List<ModelGroup> modelGroups;
  final ModelInfo selectedModel;
  final Function(ModelInfo) onModelSelected;

  const ModelSelectionScreen({
    Key? key,
    required this.modelGroups,
    required this.selectedModel,
    required this.onModelSelected,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.backgroundColor,
      appBar: AppBar(
        title: Text(
          'Chọn Mô Hình AI',
          style: TextStyle(
            fontWeight: FontWeight.bold,
            color: AppTheme.textColor,
          ),
        ),
        backgroundColor: AppTheme.cardColor,
        elevation: 0,
        leading: IconButton(
          icon: Icon(
            Icons.arrow_back,
            color: AppTheme.primaryColor,
          ),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: ListView.builder(
        itemCount: modelGroups.length,
        padding: const EdgeInsets.all(16),
        itemBuilder: (context, index) {
          final group = modelGroups[index];
          return Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 16),
                child: Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 12,
                    vertical: 6,
                  ),
                  decoration: BoxDecoration(
                    color: AppTheme.primaryColor.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: AppTheme.primaryColor.withOpacity(0.3),
                    ),
                  ),
                  child: Text(
                    group.provider,
                    style: TextStyle(
                      color: AppTheme.primaryColor,
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ),
              ...group.models.map((model) => Container(
                    margin: const EdgeInsets.only(bottom: 8),
                    decoration: BoxDecoration(
                      color: model.modal == selectedModel.modal
                          ? AppTheme.primaryColor.withOpacity(0.1)
                          : AppTheme.cardColor,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                        color: model.modal == selectedModel.modal
                            ? AppTheme.primaryColor.withOpacity(0.3)
                            : Colors.transparent,
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.1),
                          blurRadius: 8,
                          offset: const Offset(0, 2),
                        ),
                      ],
                    ),
                    child: ListTile(
                      leading: Text(
                        model.icon,
                        style: const TextStyle(fontSize: 24),
                      ),
                      title: Text(
                        model.name,
                        style: TextStyle(
                          color: AppTheme.textColor,
                          fontWeight: model.modal == selectedModel.modal
                              ? FontWeight.bold
                              : FontWeight.normal,
                        ),
                      ),
                      subtitle: model.description != null
                          ? Text(
                              model.description!,
                              style: TextStyle(
                                color: AppTheme.secondaryTextColor,
                                fontSize: 12,
                              ),
                            )
                          : null,
                      onTap: () {
                        onModelSelected(model);
                        Navigator.pop(context);
                      },
                    ),
                  )),
              const SizedBox(height: 8),
            ],
          );
        },
      ),
    );
  }
}
