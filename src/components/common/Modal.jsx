import React, { useEffect } from "react";
import { useUI } from "../../context/UIContext";

export const Modal = () => {
  const { modal, closeModal } = useUI();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && modal.isOpen) {
        closeModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [modal.isOpen, closeModal]);

  if (!modal.isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={closeModal} role="dialog" aria-modal="true">
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{modal.title}</h3>
          <button
            type="button"
            className="toast-close"
            onClick={closeModal}
            aria-label="Close modal"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="modal-body">{modal.content}</div>

        {modal.onConfirm && (
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary btn-sm" onClick={closeModal}>
              {modal.cancelText}
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => {
                modal.onConfirm();
                closeModal();
              }}
            >
              {modal.confirmText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
