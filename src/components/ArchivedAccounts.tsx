import { useRemeshDomain, useRemeshQuery, useRemeshSend } from 'remesh-react'
import type { PM } from '@kennys_wang/pm-core'
import { RedoOutlined } from '@ant-design/icons'
import { ArchivedAccountsDomain, AccountDomain } from '@/domains'
import { useMount } from '@/hooks'
import { Table } from '@/ui'

export function ArchivedAccounts() {
  const send = useRemeshSend()
  const archivedDomain = useRemeshDomain(ArchivedAccountsDomain())
  const accountDomain = useRemeshDomain(AccountDomain())
  const list = useRemeshQuery(archivedDomain.query.ListQuery())
  const page = useRemeshQuery(archivedDomain.query.PageQuery())

  useMount(() => {
    send(archivedDomain.command.SetListCommand(window.pm.getArchivedAccounts()))
  })

  return (
    <main className="archived-accounts main-content mt-5">
      <div>
        <button
          className="btn btn-outline btn-error btn-sm"
          onClick={() => {
            if (confirm('确认清空垃圾箱吗？')) {
              window.pm.clearArchivedAccounts()
              send(archivedDomain.command.SetListCommand(window.pm.getArchivedAccounts()))
            }
          }}
        >
          清空垃圾箱
        </button>
      </div>
      <Table<PM>
        className='mt-5'
        columns={[
          { title: '编号', dataIndex: 'id' },
          { title: '账号', dataIndex: 'account', render: (t: string) => t.startsWith('\\') ? t.slice(1) : t },
          { title: '密码', dataIndex: 'password' },
          { title: '面板', dataIndex: 'board' },
          { title: '备注', dataIndex: 'remark' },
          { title: '操作', dataIndex: 'operation', render: (t, item: PM) => {
            const { id } = item

            return (
              <>
                <RedoOutlined
                  title='恢复账号'
                  onClick={() => {
                    window.pm.restore([id])
                    send(archivedDomain.command.SetListCommand(window.pm.getArchivedAccounts()))
                    send(accountDomain.command.SetListCommand(window.pm.getList()))
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
            send(archivedDomain.command.SetPageCommand(current))
          }
        }}
      />
    </main>
  );
}