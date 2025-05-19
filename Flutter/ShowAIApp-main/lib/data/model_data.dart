import '../models/chat_models.dart';

final List<ModelGroup> modelGroups = [
  ModelGroup(
    provider: 'Meta',
    models: [
      ModelInfo(
          name: 'Llama 3.1 405B',
          icon: '🦙',
          modal: 'meta-llama/llama-3.1-405b-instruct:free'),
      ModelInfo(
          name: 'Llama 3.1 70B',
          icon: '🦙',
          modal: 'meta-llama/llama-3.1-70b-instruct:free'),
      ModelInfo(
          name: 'Llama 3.2 3B',
          icon: '🦙',
          modal: 'meta-llama/llama-3.2-3b-instruct:free'),
      ModelInfo(
          name: 'Llama 3.2 1B',
          icon: '🦙',
          modal: 'meta-llama/llama-3.2-1b-instruct:free'),
      ModelInfo(
          name: 'Llama 3.1 8B',
          icon: '🦙',
          modal: 'meta-llama/llama-3.1-8b-instruct:free'),
      ModelInfo(
          name: 'Llama 3 8B',
          icon: '🦙',
          modal: 'meta-llama/llama-3-8b-instruct:free'),
      ModelInfo(
          name: 'Llama 3.2 11B Vision',
          icon: '👁️',
          modal: 'meta-llama/llama-3.2-11b-vision-instruct:free'),
    ],
  ),
  ModelGroup(
    provider: 'Nous',
    models: [
      ModelInfo(
          name: 'Hermes 3 405B',
          icon: '🧠',
          modal: 'nousresearch/hermes-3-llama-3.1-405b:free'),
    ],
  ),
  ModelGroup(
    provider: 'Mistral AI',
    models: [
      ModelInfo(
          name: 'Mistral 7B',
          icon: '🌪️',
          modal: 'mistralai/mistral-7b-instruct:free'),
      ModelInfo(
          name: 'Codestral Mamba',
          icon: '🐍',
          modal: 'mistralai/codestral-mamba'),
    ],
  ),
  ModelGroup(
    provider: 'Microsoft',
    models: [
      ModelInfo(
          name: 'Phi-3 Medium',
          icon: '🔬',
          modal: 'microsoft/phi-3-medium-128k-instruct:free'),
      ModelInfo(
          name: 'Phi-3 Mini',
          icon: '🔬',
          modal: 'microsoft/phi-3-mini-128k-instruct:free'),
    ],
  ),
  ModelGroup(
    provider: 'Hugging Face',
    models: [
      ModelInfo(
          name: 'Zephyr 7B',
          icon: '🌬️',
          modal: 'huggingfaceh4/zephyr-7b-beta:free'),
    ],
  ),
  ModelGroup(
    provider: 'Liquid',
    models: [
      ModelInfo(name: 'LFM 40B', icon: '💧', modal: 'liquid/lfm-40b:free'),
    ],
  ),
  ModelGroup(
    provider: 'Qwen',
    models: [
      ModelInfo(
          name: 'Qwen 2 7B', icon: '🐼', modal: 'qwen/qwen-2-7b-instruct:free'),
    ],
  ),
  ModelGroup(
    provider: 'Google',
    models: [
      ModelInfo(
          name: 'Gemma 2 9B', icon: '💎', modal: 'google/gemma-2-9b-it:free'),
    ],
  ),
  ModelGroup(
    provider: 'OpenChat',
    models: [
      ModelInfo(
          name: 'OpenChat 7B', icon: '💬', modal: 'openchat/openchat-7b:free'),
    ],
  ),
  ModelGroup(
    provider: 'Gryphe',
    models: [
      ModelInfo(
          name: 'Mythomist 7B', icon: '🧙', modal: 'gryphe/mythomist-7b:free'),
      ModelInfo(
          name: 'Mythomax L2 13B',
          icon: '🧙',
          modal: 'gryphe/mythomax-l2-13b:free'),
    ],
  ),
  ModelGroup(
    provider: 'Undi95',
    models: [
      ModelInfo(
          name: 'Toppy M 7B', icon: '🔝', modal: 'undi95/toppy-m-7b:free'),
    ],
  ),
];
