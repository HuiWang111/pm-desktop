interface Subscription {
  remove: () => void;
}

export function useEvent<K extends keyof DocumentEventMap>(type: K, listener: (this: Document, ev: DocumentEventMap[K]) => any, options?: boolean | AddEventListenerOptions): Subscription;
export function useEvent(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): Subscription;
export function useEvent(type: string, listener: any, options?: boolean | AddEventListenerOptions): Subscription {                    
  document.addEventListener(type, listener, options)

  return {
    remove: () => {
      document.removeEventListener(type, listener, options)
    }
  }
}

export function useKeyup(keyName: string,
                         listener: (this: Document, ev: DocumentEventMap['keyup']) => any,
                         options?: boolean | AddEventListenerOptions): Subscription {
  return useEvent('keyup', function(e) {
    if (e.code === keyName) {
      listener.call(this, e)
    }
  }, options)
}

export function useEnter(el: HTMLElement | null,
                         listener: (this: Document, ev: DocumentEventMap['keyup']) => any,
                         options?: boolean | AddEventListenerOptions): Subscription {
  return useKeyup('Enter', function(e) {
    if (e.target === el) {
      listener.call(this, e)
    }
  }, options)
}
