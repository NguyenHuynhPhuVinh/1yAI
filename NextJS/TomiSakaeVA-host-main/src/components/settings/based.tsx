/* eslint-disable prettier/prettier */
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import homeStore from '@/features/stores/home'
import menuStore from '@/features/stores/menu'
import settingsStore from '@/features/stores/settings'
import { TextButton } from '../textButton'

const emotionFields = [
  {
    key: 'neutralEmotions',
    label: 'Neutral Emotions',
    defaultValue: ['Neutral'],
  },
  {
    key: 'happyEmotions',
    label: 'Happy Emotions',
    defaultValue: ['Happy,Happy2'],
  },
  {
    key: 'sadEmotions',
    label: 'Sad Emotions',
    defaultValue: ['Sad,Sad2,Troubled'],
  },
  {
    key: 'angryEmotions',
    label: 'Angry Emotions',
    defaultValue: ['Angry,Focus'],
  },
  {
    key: 'relaxedEmotions',
    label: 'Relaxed Emotions',
    defaultValue: ['Relaxed'],
  },
] as const

const motionFields = [
  { key: 'idleMotionGroup', label: 'Idle Motion Group', defaultValue: 'Idle' },
  {
    key: 'neutralMotionGroup',
    label: 'Neutral Motion Group',
    defaultValue: 'Neutral',
  },
  {
    key: 'happyMotionGroup',
    label: 'Happy Motion Group',
    defaultValue: 'Happy',
  },
  { key: 'sadMotionGroup', label: 'Sad Motion Group', defaultValue: 'Sad' },
  {
    key: 'angryMotionGroup',
    label: 'Angry Motion Group',
    defaultValue: 'Angry',
  },
  {
    key: 'relaxedMotionGroup',
    label: 'Relaxed Motion Group',
    defaultValue: 'Relaxed',
  },
] as const

const Live2DSettingsForm = () => {
  const store = settingsStore()
  const { t } = useTranslation()

  // コンポーネントマウント時にデフォルト値を設定
  useEffect(() => {
    const updates: Record<string, any> = {}

    emotionFields.forEach((field) => {
      if (!store[field.key] || store[field.key].length === 0) {
        updates[field.key] = field.defaultValue
      }
    })

    motionFields.forEach((field) => {
      if (!store[field.key] || store[field.key] === '') {
        updates[field.key] = field.defaultValue
      }
    })

    if (Object.keys(updates).length > 0) {
      settingsStore.setState(updates)
    }
  }, [])

  const handleChange = (key: string, value: string) => {
    // 最後のカンマを許容しつつ、空の要素を除外
    const cleanedArray = value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)

    settingsStore.setState({
      [key]: cleanedArray,
    })
  }

  return (
    <>
      <div className="space-y-8 mb-16">
        <div className="typography-16 whitespace-pre-line">
          {t('Live2D.Info')}
        </div>
      </div>
      <div className="space-y-8 mb-16">
        <div className="typography-20 font-bold mb-8">
          {t('Live2D.Emotions')}
        </div>
        <div className="typography-16 whitespace-pre-line">
          {t('Live2D.EmotionInfo')}
        </div>
        {emotionFields.map((field) => (
          <div key={field.key} className="space-y-4">
            <label className="block typography-16 font-bold">
              {t(`Live2D.${field.key}`)}
            </label>
            <input
              className="w-full px-16 py-8 bg-surface1 hover:bg-surface1-hover rounded-8"
              type="text"
              value={store[field.key].join(',')}
              onChange={(e) => handleChange(field.key, e.target.value)}
              placeholder={`${field.label} (comma separated)`}
            />
          </div>
        ))}
      </div>
      <div className="space-y-8">
        <div className="typography-20 font-bold mb-8">
          {t('Live2D.MotionGroups')}
        </div>
        <div className="typography-16 whitespace-pre-line">
          {t('Live2D.MotionGroupsInfo')}
        </div>
        {motionFields.map((field) => (
          <div key={field.key} className="space-y-4">
            <label className="block typography-16 font-bold">
              {t(`Live2D.${field.key}`)}
            </label>
            <input
              className="w-full px-16 py-8 bg-surface1 hover:bg-surface1-hover rounded-8"
              type="text"
              value={store[field.key]}
              onChange={(e) => handleChange(field.key, e.target.value)}
              placeholder={`${field.label}`}
            />
          </div>
        ))}
      </div>
    </>
  )
}

const Based = () => {
  const { t } = useTranslation()
  const { characterName, selectedVrmPath, selectedLive2DPath, modelType } =
    settingsStore()
  const [vrmFiles, setVrmFiles] = useState<string[]>([])
  const [live2dModels, setLive2dModels] = useState<
    Array<{ path: string; name: string }>
  >([])
  const selectLanguage = settingsStore((s) => s.selectLanguage)

  useEffect(() => {
    fetch('/api/get-vrm-list')
      .then((res) => res.json())
      .then((files) => setVrmFiles(files))
      .catch((error) => {
        console.error('Error fetching VRM list:', error)
      })

    fetch('/api/get-live2d-list')
      .then((res) => res.json())
      .then((models) => setLive2dModels(models))
      .catch((error) => {
        console.error('Error fetching Live2D list:', error)
      })
  }, [])

  const handleVrmUpload = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('/api/upload-vrm-list', {
      method: 'POST',
      body: formData,
    })

    if (response.ok) {
      const { path } = await response.json()
      settingsStore.setState({ selectedVrmPath: path })
      const { viewer } = homeStore.getState()
      viewer.loadVrm(path)

      // リストを更新
      fetch('/api/get-vrm-list')
        .then((res) => res.json())
        .then((files) => setVrmFiles(files))
        .catch((error) => {
          console.error('Error fetching VRM list:', error)
        })
    }
  }

  return (
    <>
      <div className="mb-16 typography-20 font-bold">
        {t('CharacterName')}
      </div>
      <input
        className="text-ellipsis px-16 py-8 w-col-span-2 bg-surface1 hover:bg-surface1-hover rounded-8"
        type="text"
        placeholder={t('CharacterName')}
        value={characterName}
        onChange={(e) =>
          settingsStore.setState({ characterName: e.target.value })
        }
      />

      <div className="mt-24 mb-16 typography-20 font-bold">
        {t('CharacterModelLabel')}
      </div>
      <div className="mb-16 typography-16">{t('CharacterModelInfo')}</div>
      <div className="my-16 whitespace-pre-line">
        {t('Live2D.FileInfo')}
      </div>
      <select
        className="text-ellipsis px-16 py-8 w-col-span-2 bg-surface1 hover:bg-surface1-hover rounded-8 mb-8"
        value={selectedLive2DPath}
        onChange={(e) => {
          const path = e.target.value
          settingsStore.setState({ selectedLive2DPath: path })
        }}
      >
        {live2dModels.map((model) => (
          <option key={model.path} value={model.path}>
            {model.name}
          </option>
        ))}
      </select>
      <div className="my-16">
        <Live2DSettingsForm />
      </div>
      <div className="mt-24">
        <div className="my-16 typography-20 font-bold">
          {t('BackgroundImage')}
        </div>
        <div className="my-8">
          <TextButton
            onClick={() => {
              const { bgFileInput } = menuStore.getState()
              bgFileInput?.click()
            }}
          >
            {t('ChangeBackgroundImage')}
          </TextButton>
        </div>
      </div>
    </>
  )
}
export default Based
