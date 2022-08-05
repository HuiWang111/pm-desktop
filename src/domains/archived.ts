import { Remesh } from 'remesh'
import type { PM } from '@kennys_wang/pm-core'

export const ArchivedAccountsDomain = Remesh.domain({
  name: 'ArchivedAccountsDomain',
  impl: domain => {
    const ListState = domain.state<PM[]>({
      name: 'ListState',
      default: []
    })
    const ListChangeEvent = domain.event<PM[]>({
      name: 'ListChangeEvent'
    })
    const SetListCommand = domain.command({
      name: 'SetListCommand',
      impl: ({}, list: PM[]) => {
        return [
          ListState().new(list),
          ListChangeEvent(list)
        ]
      }
    })
    const ListQuery = domain.query({
      name: 'ListQuery',
      impl: ({ get }) => {
        return get(ListState())
      }
    })

    const PageState = domain.state<number>({
      name: 'PageState',
      default: 1
    })
    const SetPageCommand = domain.command({
      name: 'SetPageCommand',
      impl: ({}, current: number) => {
        return [PageState().new(current)]
      }
    })
    const PageQuery = domain.query({
      name: 'PageQuery',
      impl: ({ get }) => {
        return get(PageState())
      }
    })

    return {
      query: {
        ListQuery,
        PageQuery,
      },
      command: {
        SetListCommand,
        SetPageCommand,
      },
      event: {
        ListChangeEvent,
      },
    }
  }
})
