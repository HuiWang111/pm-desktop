import classNames from 'classnames'
import type { ReactNode } from 'react'
import chunk from 'lodash.chunk'

interface Column<T> {
  title: string;
  dataIndex: string;
  render?: (text: any, record: T, index: number) => ReactNode
}

interface Pagination {
  current: number;
  pageSize: number;
  onChange?: (current: number) => void;
}

export interface TableProps<T> {
  dataSource: T[];
  columns: Column<T>[];
  rowKey: (item: T) => string;
  compact?: boolean;
  className?: string;
  pagination?: Pagination;
}

export function Table<T extends Record<any, any>>(props: TableProps<T>) {
  const {
    dataSource = [],
    columns = [],
    rowKey,
    compact = false,
    className,
    pagination
  } = props
  const dim = pagination ? chunk(dataSource, pagination.pageSize) : [dataSource]
  const list = pagination ? dim[pagination.current - 1] : dim[0]
  const totalPage = dim.length

  return (
    <div
      className={classNames("overflow-x-auto", {
        [className || 'none']: Boolean(className)
      })}
      style={{ color: '#fff' }}
    >
      <table
        className={classNames("table w-full", {
          'table-compact': compact
        })}
      >
        <thead>
          <tr>
            {
              columns.map(({ title, dataIndex }) => {
                return (
                  <th key={dataIndex}>
                    { title }
                  </th>
                )
              })
            }
          </tr>
        </thead>
        <tbody>
          {
            list.map((data) => {
              const key = rowKey(data)

              return (
                <tr key={key} className='hover'>
                  {
                    columns.map(({ dataIndex, render }, index) => {
                      const text = data[dataIndex]
                      
                      return (
                        <td key={dataIndex}>
                          {
                            render
                              ? render(text, data, index)
                              : text
                          }
                        </td>
                      )
                    })
                  }
                </tr>
              )
            })
          }
        </tbody>
      </table>
      {
        pagination
          ? (
            <div className='flex mt-5 items-center justify-center'>
              <div className="btn-group">
                <button
                  className="btn"
                  style={{ cursor: pagination.current > 1 ? 'auto' : 'not-allowed' }}
                  onClick={() => {
                    if (pagination.current > 1) {
                      pagination.onChange?.(pagination.current - 1)
                    }
                  }}
                >
                  «
                </button>
                <button className="btn">Page {pagination.current}</button>
                <button
                  className="btn"
                  style={{ cursor: pagination.current < totalPage ? 'auto' : 'not-allowed' }}
                  onClick={() => {
                    if (pagination.current < totalPage) {
                      pagination.onChange?.(pagination.current + 1)
                    }
                  }}
                >
                  »
                </button>
              </div>
            </div>
          )
          : null
      }
    </div>
  )
}