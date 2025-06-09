import { useRef, MouseEventHandler } from "react";
import { FaMinusCircle } from "react-icons/fa";

interface ConfirmProps {
  title: string;
  message: string;
  onTrue: (event: React.MouseEvent<HTMLElement>) => void;
  onClose: (event: React.MouseEvent<HTMLElement>) => void;
}

export default function ModalConfirm({ title, message, onTrue, onClose }: ConfirmProps) {
  const overlay = useRef<HTMLDivElement>(null);

  const close: MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.target === overlay.current) {
      onClose(e);
    }
  };

  return (
    <div
      ref={overlay}
      onClick={close}
      className="fixed inset-0 z-50 bg-black/60 bg-opacity-40 flex items-center justify-center"
    >
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden">
        <section className="text-center px-6 pt-6">
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        </section>
        <section className="flex items-center gap-4 bg-gray-100 px-6 py-6">
          <FaMinusCircle size={48} className="text-red-500" />
          <p className="text-gray-700 text-sm">{message}</p>
        </section>
        <section className="flex gap-2 justify-end px-6 py-4 bg-gray-50">
          <button
            className="px-4 py-2 text-sm rounded border border-gray-300 bg-white hover:bg-gray-100 text-gray-700"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 text-sm rounded bg-blue-600 hover:bg-blue-700 text-white"
            onClick={onTrue}
          >
            Yes
          </button>
        </section>
      </div>
    </div>
  );
}
