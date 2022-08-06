import ReactDOM from 'react-dom'
import type { PropsWithChildren, ReactNode } from 'react'
import { noop } from '@/utils'

interface ModalProps {
  visible?: boolean;
  title?: ReactNode;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export function Modal({
  visible,
  title,
  children,
  onCancel,
  onConfirm
}: PropsWithChildren<ModalProps>) {
  return ReactDOM.createPortal(
    <>
      <input
        type="checkbox"
        id="create-account-modal"
        className="modal-toggle"
        checked={visible}
        onChange={noop}
      />
      <div className="modal" style={{ color: '#fff' }}>
        <div className="modal-box">
          <div className='flex justify-center' style={{ fontSize: '24px' }}>
            { title }
          </div>
          { children }
          <div className="modal-action flex justify-center">
            <label
              className="btn"
              onClick={onCancel}
            >
              取消
            </label>
            <label
              className="btn btn-primary"
              onClick={onConfirm}
            >
              确定
            </label>
          </div>
        </div>
      </div>
    </>,
    document.body
  )
}
