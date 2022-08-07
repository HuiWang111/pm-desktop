import { useState } from 'react'
import { useRemeshDomain, useRemeshQuery, useRemeshSend } from 'remesh-react'
import type { ChangeEvent } from 'react'
import type { PM } from '@kennys_wang/pm-core'
import { SearchDomain, AccountDomain } from '@/domains'
import { CreateModal } from './CreateModal'
import { Select } from '@/ui'

export function Search() {
  const send = useRemeshSend()
  const [visible, setVisible] = useState(false)
  const [board, setBoard] = useState('')
  const searchDomain = useRemeshDomain(SearchDomain())
  const accountDomain = useRemeshDomain(AccountDomain())
  const keyword = useRemeshQuery(searchDomain.query.KeywordQuery())
  const record = useRemeshQuery(accountDomain.query.RecordQuery())
  const boards = useRemeshQuery(accountDomain.query.BoardsQuery())
  
  const handleKeywordChange = (e: ChangeEvent<HTMLInputElement>) => {
    send(searchDomain.command.SetKeywordCommand(e.target.value))
  }
  const handleChange = (e: ChangeEvent<HTMLInputElement>, name: keyof (PM & { confirmPwd?: string })) => {
    send(accountDomain.command.MergeRecordCommand({ [name]: e.target.value }))
  }
  const handleCancel = (reset: () => void) => {
    reset()
    send(accountDomain.command.ClearRecordCommand())
    setVisible(false)
  }
  const handleConfirm = (
    setMessage: (msg: string) => void,
    setErrorField: (field: 'account' | 'password' | 'confirmPwd' | '') => void
  ) => {
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

      send(accountDomain.command.SetListCommand(window.pm.getList()))

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
      send(accountDomain.command.SetListCommand(window.pm.getList()))
    }
  }

  return (
    <>
      <div className="flex justify-between text-white">
        <div className='flex'>
          <input
            type="text"
            placeholder="请输入账号或备注关键字搜索"
            className="input input-bordered input-sm"
            value={keyword}
            onChange={handleKeywordChange}
            style={{ width: '210px' }}
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
        </div>
        <div className='flex items-center'>
          <label style={{ whiteSpace: 'nowrap' }}>面板：</label>
          <Select
            value={board}
            onChange={(e) => {
              const selected = e.target.value
              const list = window.pm.getList()

              if (selected) {
                send(accountDomain.command.SetListCommand(list.filter(i => i.board === selected)))
              } else {
                send(accountDomain.command.SetListCommand(list))
              }
            }}
            options={[
              { value: '', label: '全部' },
              ...boards.map(b => ({ value: b, label: b }))
            ]}
          />
        </div>
      </div>
      {
        visible && (
          <CreateModal
            visible={visible}
            onCancel={handleCancel}
            onChange={handleChange}
            onConfirm={handleConfirm}
            record={record}
          />
        )
      }
    </>
  )
}