import { useRemeshDomain, useRemeshQuery, useRemeshSend } from 'remesh-react'
import { useState, useRef } from 'react'
import type { PM } from '@kennys_wang/pm-core'
import {
  DeleteOutlined,
  CopyOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  EditOutlined
} from '@ant-design/icons'
import {
  Search,
  Table,
  EditModal
} from '.'
import { AccountDomain } from '../domains'

export function MyAccount() {
  const send = useRemeshSend()
  const [visible, setVisible] = useState(false)
  const accountDomain = useRemeshDomain(AccountDomain())
  const list = useRemeshQuery(accountDomain.query.ListQuery())
  const page = useRemeshQuery(accountDomain.query.PageQuery())
  const record = useRef<PM | null>(null)

  const hideModal = () => setVisible(false)
  const showModal = () => setVisible(true)

  return (
    <div className="my-account mt-5">
      <Search />
      <Table<PM>
        className='mt-5'
        columns={[
          { title: '编号', dataIndex: 'id' },
          { title: '账号', dataIndex: 'account', render: (t: string) => t.startsWith('\\') ? t.slice(1) : t },
          { title: '密码', dataIndex: 'password' },
          { title: '面板', dataIndex: 'board' },
          { title: '备注', dataIndex: 'remark' },
          { title: '操作', dataIndex: 'operation', render: (t, item: PM) => {
            const { id, password } = item
            const isHidden: boolean = password === '******'

            return (
              <>
                <DeleteOutlined
                  className='mr-4'
                  onClick={() => {
                    try {
                      if (confirm('确认删除该账号吗？')) {
                        window.pm.deleteAccount(id)
                        send(accountDomain.command.SetListCommand(window.pm.getList().reverse()))
                      }
                    } catch (e) {
                      console.error(e)
                    }
                  }}
                />
                <CopyOutlined
                  className='mr-4'
                  onClick={() => {
                    try {
                      window.pm.copyPassword(id)
                    } catch (e) {
                      console.error(e)
                    }
                  }}
                />
                {
                  isHidden
                    ? (
                      <EyeOutlined
                        className='mr-4'
                        onClick={() => {
                          try {
                            const account = window.pm.getAccount(id, '')
                            send(accountDomain.command.SetListCommand([
                              ...list.map(i => {
                                if (i.id === account.id) {
                                  i.password = account.password
                                }
                                return { ...i }
                              })
                            ]))
                          } catch (e) {
                            console.error(e)
                          }
                        }}
                      />
                    )
                    : (
                      <EyeInvisibleOutlined
                        className='mr-4'
                        onClick={() => {
                          try {
                            const account = window.pm.getAccount(id)
                            send(accountDomain.command.SetListCommand([
                              ...list.map(i => {
                                if (i.id === account.id) {
                                  i.password = account.password
                                }
                                return { ...i }
                              })
                            ]))
                          } catch (e) {
                            console.error(e)
                          }
                        }}
                      />
                    )
                }
                <EditOutlined
                  className='mr-4'
                  onClick={() => {
                    record.current = { ...item }
                    showModal()
                  }}
                />
              </>
            )
          } }
        ]}
        dataSource={list}
        rowKey={data => data.id}
        pagination={{
          current: page,
          pageSize: 10,
          onChange: (current: number) => {
            send(accountDomain.command.SetPageCommand(current))
          }
        }}
      />
      {
        visible && (
          <EditModal
            visible={visible}
            onCancel={hideModal}
            onConfirm={hideModal}
            data={record.current!}
          />
        )
      }
    </div>
  )
}
