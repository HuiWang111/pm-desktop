import { useState } from 'react'
import {
  MyAccount,
  NavBar,
  ArchivedAccounts
} from '@/components'
import { Tabs } from '@/ui'
import { TabKey } from './types'

function App() {
  const [active, setActive] = useState<TabKey>('accounts')

  const handleActiveTabChange = (activeTab: TabKey) => {
    setActive(activeTab)
  }

  return (
    <div className="App bg-base-100">
      <NavBar />
      <div className='pl-5 pr-5'>
        <Tabs<TabKey>
          className='mt-5'
          active={active}
          tabs={[
            { value: 'accounts', label: '我的账号' },
            { value: 'archived', label: '垃圾箱' }
          ]}
          onChange={handleActiveTabChange}
        />
        {
          active === 'accounts' && (
            <MyAccount />
          )
        }
        {
          active === 'archived' && (
            <ArchivedAccounts />
          )
        }
      </div>
    </div>
  )
}

export default App
