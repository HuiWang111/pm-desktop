import { useState, useRef } from 'react'
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons'
import { Modal } from '@/ui'
import { useMount } from '@/hooks'

interface MainPasswordModalProps {
  visible: boolean;
  onConfirm: (password: string) => void;
  onCancel: () => void;
}

export function MainPasswordModal({
  visible,
  onCancel,
  onConfirm
}: MainPasswordModalProps) {
  const [pwd, setPwd] = useState('')
  const [msg, setMsg] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  useMount(() => {
    inputRef.current?.focus()
  })

  const reset = () => {
    setMsg('')
    setPwd('')
    setShowPwd(false)
  }

  return (
    <Modal
      visible={visible}
      onCancel={() => {
        onCancel()
        reset()
      }}
      onConfirm={() => {
        const password = pwd.trim()
        if (password) {
          onConfirm(password)
          reset()
        } else {
          setMsg('您没有填写主密码')
        }
      }}
    >
      <h3 className='flex justify-center'>您没有设置系统主密码，请先设置主密码</h3>
      <div className='mt-5 flex justify-center items-center'>
        <input
          type={showPwd ? 'text' : 'password'}
          placeholder="请输入主密码"
          className="input input-bordered input-sm w-full max-w-xs mr-4"
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
          style={{ color: '#fff' }}
          ref={inputRef}
        />
        {
          showPwd
            ? <EyeInvisibleFilled onClick={() => setShowPwd(false)} />
            : <EyeFilled onClick={() => setShowPwd(true)} />
        }
      </div>
      { msg && <div className='mt-3 mb-2 flex justify-center text-xs text-red-400'>{msg}</div> }
    </Modal>
  )
}
