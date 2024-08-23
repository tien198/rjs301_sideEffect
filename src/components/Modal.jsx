import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { createPortal } from 'react-dom';

function Modal({ children, isOpenModal, onClose }) {
  const dialog = useRef();

  useEffect(() => {
    if (isOpenModal) {
      dialog.current.showModal()
    }
    else {
      dialog.current.close()
    }
  }, [isOpenModal])

  // useImperativeHandle(ref, () => {
  //   return {
  //     open: () => {
  //       dialog.current.showModal();
  //     },
  //     close: () => {
  //       dialog.current.close();
  //     },
  //   };
  // });

  return createPortal(
    <dialog className="modal" ref={dialog} onClose={onClose}>
      {children}
    </dialog>,
    document.getElementById('modal')
  );
}

export default Modal;
