import { useState, useCallback } from 'react'
import {
  BlockOutlined,
  BorderOutlined,
  CloseOutlined
} from '@ant-design/icons'
import { useMount } from '@/hooks'
import '@/styles/navbar.less'

interface NavBarProps {
  displayMoreIcon?: boolean;
}

export function NavBar({
  displayMoreIcon = false
}: NavBarProps) {
  const [isMaximized, setMaximized] = useState(false)
  const fetchMaximizedStatus = useCallback(async () => {
    const isMaximized = await window.os.isMaximized()
    setMaximized(isMaximized)
  }, [])

  useMount(() => {
    fetchMaximizedStatus()
  })

  const handleMax = () => {
    window.os.setWin('max')
    fetchMaximizedStatus()
  }

  return (
    <div
      className="navbar app-navbar bg-base-100 shadow-xl"
    >
      <div className="flex-none">
        <button className="btn btn-square btn-ghost">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </button>
      </div>
      <div className="flex-1">
        <a className="btn btn-ghost normal-case text-xl">Password Manager</a>
      </div>
      <div className="flex-none">
        {
          displayMoreIcon && (
            <button className="btn btn-square btn-ghost">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path></svg>
            </button>
          )
        }
      </div>
      <div className="flex system-btn text-sm">
        <div className='window-icon-wrapper'>
          <span 
            className='min-window-icon window-icon'
            title='最小化'
            onClick={() => {
              window.os.setWin('min')
            }}
          />
        </div>
        <div
          className='window-icon-wrapper'
          onClick={handleMax}
          title={isMaximized ? '向上还原' : '最大化'}
        >
          {
            isMaximized
              ? <BlockOutlined className='window-icon' />
              : <BorderOutlined className='window-icon' />
          }
        </div>
        <div
          className='window-icon-wrapper close-window-icon-wrapper'
          title='关闭'
          onClick={() => {
            window.os.setWin('close')
          }}
        >
          <CloseOutlined
            className='window-icon'
          />
        </div>
      </div>
    </div>
  )
}
