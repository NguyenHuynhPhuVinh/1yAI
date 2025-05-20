import { useTranslation } from 'react-i18next'

import { testVoiceVox } from '@/features/messages/speakCharacter'
import settingsStore from '@/features/stores/settings'
import { Link } from '../link'
import { TextButton } from '../textButton'
import speakers from '../speakers.json'

const Voice = () => {
  const voiceEnabled = settingsStore((s) => s.voiceEnabled)
  const voicevoxSpeaker = settingsStore((s) => s.voicevoxSpeaker)
  const voicevoxSpeed = settingsStore((s) => s.voicevoxSpeed)
  const voicevoxPitch = settingsStore((s) => s.voicevoxPitch)
  const voicevoxIntonation = settingsStore((s) => s.voicevoxIntonation)
  const voicevoxServerUrl = settingsStore((s) => s.voicevoxServerUrl)

  const { t } = useTranslation()

  return (
    <div>
      <div className="mb-16 typography-20 font-bold">
        {t('VoiceAdjustment')}
      </div>
      <div className="my-8">
        <TextButton
          onClick={() => {
            settingsStore.setState({
              voiceEnabled: !voiceEnabled,
            })
          }}
        >
          {voiceEnabled ? t('StatusOn') : t('StatusOff')}
        </TextButton>
      </div>

      {voiceEnabled && (
        <>
          <div className="mt-16">
            {t('VoiceVoxInfo')}
            <br />
            <Link
              url="https://voicevox.hiroshiba.jp/"
              label="https://voicevox.hiroshiba.jp/"
            />
          </div>
          <div className="mt-16 font-bold">{t('VoicevoxServerUrl')}</div>
          <div className="mt-8">
            <input
              className="text-ellipsis px-16 py-8 w-col-span-4 bg-surface1 hover:bg-surface1-hover rounded-8"
              type="text"
              placeholder="http://localhost:50021"
              value={voicevoxServerUrl}
              onChange={(e) =>
                settingsStore.setState({
                  voicevoxServerUrl: e.target.value,
                })
              }
            />
          </div>
          <div className="mt-16 font-bold">{t('SpeakerSelection')}</div>
          <div className="flex items-center">
            <select
              value={voicevoxSpeaker}
              onChange={(e) =>
                settingsStore.setState({
                  voicevoxSpeaker: e.target.value,
                })
              }
              className="px-16 py-8 bg-surface1 hover:bg-surface1-hover rounded-8"
            >
              <option value="">{t('Select')}</option>
              {speakers.map((speaker) => (
                <option key={speaker.id} value={speaker.id}>
                  {speaker.speaker}
                </option>
              ))}
            </select>
            <TextButton onClick={() => testVoiceVox()} className="ml-16">
              {t('TestVoice')}
            </TextButton>
          </div>
          <div className="mt-24 font-bold">
            <div className="select-none">
              {t('VoicevoxSpeed')}: {voicevoxSpeed}
            </div>
            <input
              type="range"
              min={0.5}
              max={2}
              step={0.01}
              value={voicevoxSpeed}
              className="mt-8 mb-16 input-range"
              onChange={(e) => {
                settingsStore.setState({
                  voicevoxSpeed: Number(e.target.value),
                })
              }}
            />
            <div className="select-none">
              {t('VoicevoxPitch')}: {voicevoxPitch}
            </div>
            <input
              type="range"
              min={-0.15}
              max={0.15}
              step={0.01}
              value={voicevoxPitch}
              className="mt-8 mb-16 input-range"
              onChange={(e) => {
                settingsStore.setState({
                  voicevoxPitch: Number(e.target.value),
                })
              }}
            />
            <div className="select-none">
              {t('VoicevoxIntonation')}: {voicevoxIntonation}
            </div>
            <input
              type="range"
              min={0.0}
              max={2.0}
              step={0.01}
              value={voicevoxIntonation}
              className="mt-8 mb-16 input-range"
              onChange={(e) => {
                settingsStore.setState({
                  voicevoxIntonation: Number(e.target.value),
                })
              }}
            />
          </div>
        </>
      )}
    </div>
  )
}
export default Voice
