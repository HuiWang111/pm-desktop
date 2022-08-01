import { useRemeshDomain, useRemeshQuery, useRemeshSend } from 'remesh-react'
import {
  DeleteOutlined,
  CopyOutlined,
  EyeOutlined,
  EyeInvisibleOutlined
} from '@ant-design/icons'
import {
  Search,
  Table,
  NavBar
} from './components'
import { AccountDomain } from './domains'

function App() {
  const send = useRemeshSend()
  const accountDomain = useRemeshDomain(AccountDomain())
  const list = useRemeshQuery(accountDomain.query.ListQuery())
  const page = useRemeshQuery(accountDomain.query.PageQuery())

  return (
    <div className="App bg-base-100">
      <NavBar />
      <div className='ml-10 mr-10 mt-5'>
        <Search />
        <Table
          className='mt-5'
          columns={[
            { title: '编号', dataIndex: 'id' },
            { title: '账号', dataIndex: 'account', render: (t: string) => t.startsWith('\\') ? t.slice(1) : t },
            { title: '密码', dataIndex: 'password' },
            { title: '面板', dataIndex: 'board' },
            { title: '备注', dataIndex: 'remark' },
            { title: '', dataIndex: 'operation', render: (t, { id, password }) => {
              const isHidden = password === '******'

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
                </>
              )
            } }
          ]}
          dataSource={list as any as Record<string, string>[]}
          rowKey={data => data.id}
          pagination={{
            current: page,
            pageSize: 10,
            onChange: (current: number) => {
              send(accountDomain.command.SetPageCommand(current))
            }
          }}
        />
      </div>
    </div>
  )
}

export default App
