import { useState } from 'react'
import { useRemeshDomain, useRemeshQuery, useRemeshSend } from 'remesh-react'
import type { ChangeEvent } from 'react'
import classNames from 'classnames'
import type { PM } from '@kennys_wang/pm-core'
import { SearchDomain, AccountDomain } from '../domains'
import { Modal } from './Modal'

export function Search() {
  const send = useRemeshSend()
  const [visible, setVisible] = useState(false)
  const [errorField, setErrorField] = useState<'account' | 'password' | 'confirmPwd' | ''>('')
  const [message, setMessage] = useState('')
  const searchDomain = useRemeshDomain(SearchDomain())
  const accountDomain = useRemeshDomain(AccountDomain())
  const keyword = useRemeshQuery(searchDomain.query.KeywordQuery())
  const record = useRemeshQuery(accountDomain.query.RecordQuery())
  
  const handleKeywordChange = (e: ChangeEvent<HTMLInputElement>) => {
    send(searchDomain.command.SetKeywordCommand(e.target.value))
  }
  const handleChange = (e: ChangeEvent<HTMLInputElement>, name: keyof (PM & { confirmPwd?: string })) => {
    send(accountDomain.command.MergeRecordCommand({ [name]: e.target.value }))
  }
  const handleCancel = () => {
    reset()
    setVisible(false)
  }
  const reset = () => {
    send(accountDomain.command.ClearRecordCommand())
    setMessage('')
    setErrorField('')
  }
  const handleConfirm = () => {
    try {
      const account = record.account.trim()
      const password = record.password.trim()
      const confirmPwd = record.confirmPwd.trim()

      if (!account) {
        setMessage('账号为必填项')
        setErrorField('account')
        return
      } else if (!password) {
        setMessage('密码为必填项')
        setErrorField('password')
        return
      } else if (!confirmPwd) {
        setMessage('确认密码为必填项')
        setErrorField('confirmPwd')
        return
      } else if (password !== confirmPwd) {
        setMessage('两次密码不一致')
        setErrorField('confirmPwd')
        return
      }
      
      setMessage('')
      setErrorField('')

      const board = record.board.trim()
      const remark = record.remark.trim()
      
      window.pm.createAccount({
        account,
        password,
        board,
        remark
      })

      send(accountDomain.command.SetListCommand(window.pm.getList().reverse()))

      setVisible(false)
      send(accountDomain.command.ClearRecordCommand())
    } catch (e) {
      console.error(e)
    }
  }
  const handleSearch = () => {
    if (keyword) {
      send(accountDomain.command.SetListCommand(window.pm.findAccounts(keyword)))
    } else {
      send(accountDomain.command.SetListCommand(window.pm.getList().reverse()))
    }
  }

  return (
    <div className="flex">
      <input
        type="text"
        placeholder="请输入账号或备注关键字搜索"
        className="input input-bordered input-sm w-full max-w-xs"
        value={keyword}
        onChange={handleKeywordChange}
        style={{ color: '#fff' }}
      />
      <button
        className="btn btn-outline btn-sm ml-2"
        onClick={handleSearch}
      >
        搜索
      </button>
      <label
        className="btn btn-primary btn-sm ml-2 modal-button"
        onClick={() => setVisible(true)}
      >
        创建账号
      </label>
      <Modal
        visible={visible}
        title='创建账号'
        onCancel={handleCancel}
        onConfirm={handleConfirm}
      >
        <div className='flex justify-center mt-5'>
          <input
            type="text"
            placeholder="请输入账号"
            className={classNames("input input-bordered input-sm w-full max-w-xs", {
              'input-error': errorField === 'account'
            })}
            value={record.account}
            onChange={(e) => handleChange(e, 'account')}
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
    </div>
  )
}