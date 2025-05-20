import { useTranslation } from 'react-i18next'
import settingsStore from '@/features/stores/settings'
import { SYSTEM_PROMPT } from '@/features/constants/systemPromptConstants'
import { Link } from '../link'
import { TextButton } from '../textButton'
import { googleSearchGroundingModels } from '@/features/stores/settings'

const ModelProvider = () => {
  const googleKey = settingsStore((s) => s.googleKey)
  const useSearchGrounding = settingsStore((s) => s.useSearchGrounding)
  const mediaInputMode = settingsStore((s) => s.mediaInputMode)
  const selectAIModel = settingsStore((s) => s.selectAIModel)
  const systemPrompt = settingsStore((s) => s.systemPrompt)

  const { t } = useTranslation()

  const gemini20Models = ['gemini-2.0-flash-exp']

  return (
    <div>
      <div className="typography-20 font-bold">{t('GoogleAPIKeyLabel')}</div>
      <div className="my-16">
        {t('APIKeyInstruction')}
        <br />
        <Link
          url="https://aistudio.google.com/app/apikey?hl=ja"
          label="Google AI Studio"
        />
      </div>
      <input
        className="text-ellipsis px-16 py-8 w-col-span-2 bg-surface1 hover:bg-surface1-hover rounded-8"
        type="text"
        placeholder="..."
        value={googleKey}
        onChange={(e) => settingsStore.setState({ googleKey: e.target.value })}
      />
      <div className="my-24">
        <div className="my-16 typography-20 font-bold">
          {t('SearchGrounding')}
        </div>
        <div className="my-8">
          <TextButton
            onClick={() => {
              settingsStore.setState({
                useSearchGrounding: !useSearchGrounding,
              })
            }}
            disabled={
              !googleSearchGroundingModels.includes(selectAIModel as any)
            }
          >
            {useSearchGrounding ? t('StatusOn') : t('StatusOff')}
          </TextButton>
        </div>
      </div>

      <div className="my-24">
        <div className="my-16 typography-20 font-bold">
          {t('MediaInputMode')}
        </div>
        <div className="my-8">
          <TextButton
            onClick={() => {
              settingsStore.setState({
                mediaInputMode: !mediaInputMode,
              })
            }}
            disabled={!gemini20Models.includes(selectAIModel)}
          >
            {mediaInputMode ? t('StatusOn') : t('StatusOff')}
          </TextButton>
        </div>
      </div>
      <div className="mt-40">
        <div className="my-8">
          <div className="my-16 typography-20 font-bold">
            {t('CharacterSettingsPrompt')}
          </div>
          <div className="my-16 whitespace-pre-line">
            {t('CharacterSettingsInfo')}
          </div>
          <TextButton
            onClick={() =>
              settingsStore.setState({ systemPrompt: SYSTEM_PROMPT })
            }
          >
            {t('CharacterSettingsReset')}
          </TextButton>
        </div>
        <textarea
          value={systemPrompt}
          onChange={(e) =>
            settingsStore.setState({ systemPrompt: e.target.value })
          }
          className="px-16 py-8 bg-surface1 hover:bg-surface1-hover h-168 rounded-8 w-full"
        ></textarea>
      </div>
    </div>
  )
}
export default ModelProvider
