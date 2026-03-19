import Modal from "./Modal";

export default function ConfirmDialog({ open, title, description, onClose, onConfirm }) {
  return (
    <Modal
      open={open}
      title={title}
      onClose={onClose}
      footer={
        <>
          <button type="button" className="btn-secondary" onClick={onClose}>
            Huy
          </button>
          <button type="button" className="btn-danger" onClick={onConfirm}>
            Xac nhan xoa
          </button>
        </>
      }
    >
      <p className="text-sm leading-6 text-slate-500">{description}</p>
    </Modal>
  );
}
