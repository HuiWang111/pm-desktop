import { useState, useRef, useEffect } from 'react'
import type { ChangeEvent } from 'react'
import type { PM } from '@kennys_wang/pm-core'
import classNames from 'classnames';
import { Modal } from '@/ui'
import { useMount, useEnter } from '@/hooks'

interface CreateModalProps {
  visible: boolean;
  record: Omit<PM, 'id'> & { confirmPwd: string };
  onChange: (e: ChangeEvent<HTMLInputElement>, name: keyof (PM & { confirmPwd?: string })) => void;
  onCancel: (reset: () => void) => void;
  onConfirm: (
    setMessage: (msg: string) => void,
    setErrorField: (field: 'account' | 'password' | 'confirmPwd' | '') => void
  ) => void;
}

export function CreateModal({
  visible,
  record,
  onChange,
  onCancel,
  onConfirm
}: CreateModalProps) {
  const [errorField, setErrorField] = useState<'account' | 'password' | 'confirmPwd' | ''>('')
  const [message, setMessage] = useState('')
  const accountInputRef = useRef<HTMLInputElement | null>(null)
  const pwdInputRef = useRef<HTMLInputElement | null>(null)
  const confirmPwdInputRef = useRef<HTMLInputElement | null>(null)
  const boardInputRef = useRef<HTMLInputElement | null>(null)
  const remarkInputRef = useRef<HTMLInputElement | null>(null)

  const reset = () => {
    setMessage('')
    setErrorField('')
  }

  useMount(() => {
    accountInputRef.current?.focus()
  })

  useEffect(() => {
    const accountSubscription = useEnter(accountInputRef.current, () => {
      accountInputRef.current?.blur()
      pwdInputRef.current?.focus()
    })
    const pwdSubscription = useEnter(pwdInputRef.current, () => {
      pwdInputRef.current?.blur()
      confirmPwdInputRef.current?.focus()
    })
    const confirmPwdSubscription = useEnter(confirmPwdInputRef.current, () => {
      confirmPwdInputRef.current?.blur()
      boardInputRef.current?.focus()
    })
    const boardSubscription = useEnter(boardInputRef.current, () => {
      boardInputRef.current?.blur()
      remarkInputRef.current?.focus()
    })
    const remarkSubscription = useEnter(remarkInputRef.current, () => {
      onConfirm(setMessage, setErrorField)
    })

    return () => {
      accountSubscription.remove()
      pwdSubscription.remove()
      confirmPwdSubscription.remove()
      boardSubscription.remove()
      remarkSubscription.remove()
    }
  }, [record.account, record.board, record.confirmPwd, record.password, record.remark])


  return (
    <Modal
        visible={visible}
        title='创建账号'
        onCancel={() => onCancel(reset)}
        onConfirm={() => onConfirm(setMessage, setErrorField)}
      >
        <div className='flex justify-center mt-5'>
          <input
            type="text"
            placeholder="请输入账号"
            className={classNames("input input-bordered input-sm w-full max-w-xs", {
              'input-error': errorField === 'account'
            })}
            value={record.account}
            onChange={(e) => onChange(e, 'account')}
            style={{ color: '#fff' }}
            ref={accountInputRef}
          />
        </div>
        <div className='flex justify-center mt-5'>
          <input
            type="password"
            placeholder="请输入密码"
            className={classNames("input input-bordered input-sm w-full max-w-xs", {
              'input-error': errorField === 'password'
            })}
            value={record.password}
            onChange={(e) => onChange(e, 'password')}
            style={{ color: '#fff' }}
            ref={pwdInputRef}
          />
        </div>
        <div className='flex justify-center mt-5'>
          <input
            type="password"
            placeholder="请确认密码"
            className={classNames("input input-bordered input-sm w-full max-w-xs", {
              'input-error': errorField === 'confirmPwd'
            })}
            value={record.confirmPwd}
            onChange={(e) => onChange(e, 'confirmPwd')}
            style={{ color: '#fff' }}
            ref={confirmPwdInputRef}
          />
        </div>
        <div className='flex justify-center mt-5'>
          <input
            type="text"
            placeholder="请输入面板"
            className="input input-bordered input-sm w-full max-w-xs"
            value={record.board}
            onChange={(e) => onChange(e, 'board')}
            style={{ color: '#fff' }}
            ref={boardInputRef}
          />
        </div>
        <div className='flex justify-center mt-5'>
          <input
            type="text"
            placeholder="请输入备注"
            className="input input-bordered input-sm w-full max-w-xs"
            value={record.remark}
            onChange={(e) => onChange(e, 'remark')}
            style={{ color: '#fff' }}
            ref={remarkInputRef}
          />
        </div>
        {
          message && (
            <div
              className='mt-3 mb-2 flex justify-center text-xs text-red-400'
            >
              { message }
            </div>
          )
        }
      </Modal>
  )
}