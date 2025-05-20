import { useTranslation } from 'react-i18next'

import settingsStore from '@/features/stores/settings'
import { TextButton } from '../textButton'

const AdvancedSettings = () => {
  const showControlPanel = settingsStore((s) => s.showControlPanel)
  const showAssistantText = settingsStore((s) => s.showAssistantText)
  const showCharacterName = settingsStore((s) => s.showCharacterName)

  const { t } = useTranslation()

  return (
    <div className="mb-40">
      <div className="mb-24 grid-cols-2">
        <div className="mb-16 typography-20 font-bold">
          {t('LocalStorageReset')}
        </div>
        <div className="my-16 typography-16">{t('LocalStorageResetInfo')}</div>
        <TextButton
          onClick={() => {
            settingsStore.persist.clearStorage()
            window.location.reload()
          }}
        >
          {t('LocalStorageResetButton')}
        </TextButton>
      </div>
      <div className="my-24">
        <div className="my-16 typography-20 font-bold">
          {t('ShowAssistantText')}
        </div>
        <div className="my-8">
          <TextButton
            onClick={() =>
              settingsStore.setState((s) => ({
                showAssistantText: !s.showAssistantText,
              }))
            }
          >
            {showAssistantText ? t('StatusOn') : t('StatusOff')}
          </TextButton>
        </div>
      </div>
      <div className="my-24">
        <div className="my-16 typography-20 font-bold">
          {t('ShowCharacterName')}
        </div>
        <div className="my-8">
          <TextButton
            onClick={() =>
              settingsStore.setState((s) => ({
                showCharacterName: !s.showCharacterName,
              }))
            }
          >
            {showCharacterName ? t('StatusOn') : t('StatusOff')}
          </TextButton>
        </div>
      </div>
      <div className="my-24">
        <div className="my-16 typography-20 font-bold">
          {t('ShowControlPanel')}
        </div>
        <div className="my-16 typography-16">{t('ShowControlPanelInfo')}</div>
        <div className="my-8">
          <TextButton
            onClick={() =>
              settingsStore.setState({
                showControlPanel: !showControlPanel,
              })
            }
          >
            {showControlPanel ? t('StatusOn') : t('StatusOff')}
          </TextButton>
        </div>
      </div>
    </div>
  )
}
export default AdvancedSettings
