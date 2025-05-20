/* eslint-disable prettier/prettier */
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { IconButton } from '../iconButton'
import Based from './based'
import AI from './ai'
import Voice from './voice'
import AzurLane from './azur_lane'
import Live2DViewerEX from './live2d_viewer_ex'
import Other from './other'

type Props = {
  onClickClose: () => void
}
const Settings = (props: Props) => {
  return (
    <div className="absolute z-40 w-full h-full bg-white/80 backdrop-blur ">
      <Header {...props} />
      <Main />
    </div>
  )
}
export default Settings

const Header = ({ onClickClose }: Pick<Props, 'onClickClose'>) => {
  return (
    <>
      <div className="absolute m-24">
        <IconButton
          iconName="24/Close"
          isProcessing={false}
          onClick={onClickClose}
        ></IconButton>
      </div>
    </>
  )
}

// タブの定義
type TabKey = 'general' | 'ai' | 'voice' | 'azur_lane' | 'live2d_viewer_ex' | 'other'

const Main = () => {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<TabKey>('general')

  const tabs: { key: TabKey; label: string }[] = [
    {
      key: 'general',
      label: t('Settings'),
    },
    {
      key: 'ai',
      label: t('AISettings'),
    },
    {
      key: 'voice',
      label: t('VoiceSettings'),
    },
    {
      key: 'azur_lane',
      label: t('AzurLaneSettings'),
    },
    {
      key: 'live2d_viewer_ex',
      label: t('Live2DViewerEXSettings'),
    },
    {
      key: 'other',
      label: t('OtherSettings'),
    },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return <Based />
      case 'ai':
        return <AI />
      case 'voice':
        return <Voice />
      case 'azur_lane':
        return <AzurLane />
      case 'live2d_viewer_ex':
        return <Live2DViewerEX />
      case 'other':
        return <Other />
    }
  }

  return (
    <main className="max-h-full overflow-auto scroll-hidden">
      <div className="text-text1 max-w-5xl mx-auto px-24 py-64">
        <div className="md:flex mt-16">
          {/* タブナビゲーション */}
          <ul className="flex flex-col space-y-4 text-sm font-medium md:w-[25%] md:me-8 mb-16 md:mb-0">
            {tabs.map((tab) => (
              <li key={tab.key}>
                <button
                  className={`flex py-8 px-16 rounded-8 w-full typography-16 text-left
                    ${activeTab === tab.key
                      ? 'text-white bg-primary'
                      : 'bg-gray-50 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>

          {/* タブコンテンツ */}
          <div className="p-24 bg-surface7-hover text-medium rounded-8 w-full">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </main>
  )
}
