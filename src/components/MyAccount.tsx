import { useRemeshDomain, useRemeshQuery, useRemeshSend, useRemeshEvent } from 'remesh-react'
import { useState, useRef } from 'react'
import type { PM } from '@kennys_wang/pm-core'
import {
  DeleteOutlined,
  CopyOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  EditOutlined
} from '@ant-design/icons'
import { Search } from './Search'
import { Table } from '@/ui'
import { EditModal } from './EditModal'
import { ValidateMainPasswordModal, OnConfirm } from './ValidateMainPassword'
import { MainPasswordModal } from './MainPasswordModal'
import { AccountDomain, ArchivedAccountsDomain } from '@/domains'
import { useMount } from '@/hooks'
import '@/styles/my-account.less'

export function MyAccount() {
  const send = useRemeshSend()
  const [visible, setVisible] = useState(false)
  const [mainVisible, setMainVisible] = useState(false)
  const [validVisible, setValidVisible] = useState(false)
  const accountDomain = useRemeshDomain(AccountDomain())
  const archivedDomain = useRemeshDomain(ArchivedAccountsDomain())
  const list = useRemeshQuery(accountDomain.query.ListQuery())
  const page = useRemeshQuery(accountDomain.query.PageQuery())
  const record = useRef<PM | null>(null)
  const validatePwdOnConfirm = useRef<OnConfirm>(null)
  
  const hideModal = () => setVisible(false)
  const showModal = () => setVisible(true)

  useMount(() => {
    const list = window.pm.getList()
    send(accountDomain.command.SetListCommand(list))

    const boards: string[] = [
      ...list.reduce<Set<string>>((acc, item) => acc.add(item.board), new Set())
    ]
    send(accountDomain.command.SetBoardsCommand(boards))
  })

  return (
    <main className="my-account main-content mt-5">
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
                  title='删除账号'
                  onClick={() => {
                    try {
                      if (confirm('确认删除该账号吗？')) {
                        window.pm.deleteAccount(id)
                        send(accountDomain.command.SetListCommand(window.pm.getList()))
                        send(archivedDomain.command.SetListCommand(window.pm.getArchivedAccounts()))
                      }
                    } catch (e) {
                      console.error(e)
                    }
                  }}
                />
                <CopyOutlined
                  className='mr-4'
                  title='复制密码'
                  onClick={() => {
                    if (!window.pm.hasMainPassword()) {
                      setMainVisible(true)
                      return
                    }

                    setValidVisible(true)

                    validatePwdOnConfirm.current = (pwd, setMsg, reset) => {
                      try {
                        if (window.pm.validateMainPassword(pwd)) {
                          setValidVisible(false)
                          reset()
                          window.pm.copyPassword(id)
                          alert('复制密码成功')
                        } else {
                          setMsg('密码不正确')
                        }
                      } catch (e) {
                        console.error(e)
                      }
                    }
                  }}
                />
                {
                  isHidden
                    ? (
                      <EyeOutlined
                        className='mr-4'
                        title='显示密码'
                        onClick={async () => {
                          if (!window.pm.hasMainPassword()) {
                            setMainVisible(true)
                            return
                          }

                          setValidVisible(true)

                          validatePwdOnConfirm.current = (pwd, setMsg, reset) => {
                            try {
                              if (window.pm.validateMainPassword(pwd)) {
                                setValidVisible(false)
                                reset()
                                const account = window.pm.getAccount(id, '')
                                send(accountDomain.command.SetListCommand([
                                  ...list.map(i => {
                                    if (i.id === account.id) {
                                      i.password = account.password
                                    }
                                    return { ...i }
                                  })
                                ]))
                              } else {
                                setMsg('密码不正确')
                              }
                            } catch (e) {
                              console.error(e)
                            }
                          }
                        }}
                      />
                    )
                    : (
                      <EyeInvisibleOutlined
                        className='mr-4'
                        title='隐藏密码'
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
                  title='编辑账号'
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
      {
        mainVisible && (
          <MainPasswordModal
            visible={mainVisible}
            onCancel={() => {
              setMainVisible(false)
            }}
            onConfirm={(pwd) => {
              setMainVisible(false)
              window.pm.setMainPassword(pwd)
            }}
          />
        )
      }
      {
        validVisible && (
          <ValidateMainPasswordModal
            visible={validVisible}
            onCancel={() => {
              setValidVisible(false)
            }}
            onConfirm={validatePwdOnConfirm.current}
          />
        )
      }
    </main>
  )
}
