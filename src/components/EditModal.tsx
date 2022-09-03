import { useState, useRef, useEffect, useCallback } from 'react'
import type { ChangeEvent } from 'react'
import { useRemeshDomain, useRemeshSend, useRemeshQuery } from 'remesh-react'
import type { PM } from '@kennys_wang/pm-core'
import classNames from 'classnames';
import { AccountDomain, SearchDomain } from '@/domains'
import { Modal } from '@/ui'
import { useMount, useEnter } from '@/hooks'

interface EditModalProps {
  data: PM;
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function EditModal({
  data,
  visible,
  onCancel,
  onConfirm,
}: EditModalProps) {
  const send = useRemeshSend()
  const searchDomain = useRemeshDomain(SearchDomain())
  const accountDomain = useRemeshDomain(AccountDomain())
  const [errorField, setErrorField] = useState<'account' | 'password' | 'confirmPwd' | ''>('')
  const [message, setMessage] = useState('')
  const [record, setRecord] = useState<PM & { confirmPwd: string }>({
    ...data,
    password: '',
    confirmPwd: ''
  })
  const originRecord = useRef<PM>({ ...data })
  const pwdInputRef = useRef<HTMLInputElement | null>(null)
  const confirmPwdInputRef = useRef<HTMLInputElement | null>(null)
  const boardInputRef = useRef<HTMLInputElement | null>(null)
  const remarkInputRef = useRef<HTMLInputElement | null>(null)
  const keyword = useRemeshQuery(searchDomain.query.KeywordQuery())

  const handleChange = (e: ChangeEvent<HTMLInputElement>, name: keyof (PM & { confirmPwd?: string })) => {
    setRecord({
      ...record,
      [name]: e.target.value
    })
  }
  const handleCancel = () => {
    reset()
    onCancel()
  }
  const reset = () => {
    setMessage('')
    setErrorField('')
  }
  const handleSearch = useCallback(() => {
    if (keyword) {
      send(accountDomain.command.SetListCommand(window.pm.findAccounts(keyword)))
    } else {
      send(accountDomain.command.SetListCommand(window.pm.getList()))
    }
  }, [keyword])
  const handleConfirm = () => {
    try {
      const password = record.password.trim()
      const confirmPwd = record.confirmPwd.trim()

      if (password !== confirmPwd) {
        setMessage('两次密码不一致')
        setErrorField('confirmPwd')
        return
      }
      
      setMessage('')
      setErrorField('')

      const board = record.board.trim()
      const remark = record.remark.trim()
      
      if (password && password !== originRecord.current.password) {
        console.log('修改密码')
        window.pm.editAccount(record.id, password)
      }
      if (board !== originRecord.current.board) {
        console.log('修改面板')
        window.pm.moveAccount(record.id, board)
      }
      if (remark !== originRecord.current.remark) {
        console.log('修改备注')
        window.pm.remarkAccount(record.id, remark)
      }

      handleSearch()

      onConfirm()
    } catch (e) {
      console.error(e)
    }
  }

  useMount(() => {
    pwdInputRef.current?.focus()
  })
  useEffect(() => {
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
    const remarkSubscription = useEnter(remarkInputRef.current, handleConfirm)

    return () => {
      pwdSubscription.remove()
      confirmPwdSubscription.remove()
      boardSubscription.remove()
      remarkSubscription.remove()
    }
  }, [record.password, record.confirmPwd, record.board, record.remark])

  return (
    <Modal
      visible={visible}
      title='编辑账号'
      onCancel={handleCancel}
      onConfirm={handleConfirm}
    >
      <div className='flex justify-center mt-5'>
          <input
            type="text"
            placeholder="请输入账号"
            className="input input-bordered input-sm w-full max-w-xs"
            value={record.account}
            disabled
            style={{ color: '#fff' }}
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
            onChange={(e) => handleChange(e, 'password')}
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
            onChange={(e) => handleChange(e, 'confirmPwd')}
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
            onChange={(e) => handleChange(e, 'board')}
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
            onChange={(e) => handleChange(e, 'remark')}
            style={{ color: '#fff' }}
            ref={remarkInputRef}
          />
        </div>
        {
          errorField && (
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
