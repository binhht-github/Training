
import { SaveIcon } from "lucide-react";

interface BaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
}

interface ConfirmModalProps extends BaseModalProps {
    mode: 'confirm';
    message: string;
    onConfirm: () => void;
    confirmText?: string;
    cancelText?: string;
}

interface FormModalProps extends BaseModalProps {
    mode: 'form';
    children: React.ReactNode;
    onSubmit: (data: any) => void;
}

interface InfoModalProps extends BaseModalProps {
    mode: 'info';
    content: React.ReactNode;
}

// Union type ensures only valid combinations
type ModalProps = ConfirmModalProps | FormModalProps | InfoModalProps;

const Modal: React.FC<ModalProps> = (props) => {
    const { isOpen, onClose, title } = props;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-zinc-800">
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-zinc-500 hover:text-red-500 text-xl font-bold"
                    >
                        ×
                    </button>
                </div>

                {/* Body */}
                <div className="p-4 space-y-4 text-sm text-zinc-700">
                    {props.mode === 'confirm' && (
                        <>
                            <p>{props.message}</p>
                            <div className="flex justify-end gap-3 mt-4">
                                <button
                                    onClick={props.onConfirm}
                                    className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                                >
                                    {props.confirmText || 'Confirm'}
                                </button>
                                <button
                                    onClick={onClose}
                                    className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
                                >
                                    {props.cancelText || 'Cancel'}
                                </button>
                            </div>
                        </>
                    )}

                    {props.mode === 'form' && (
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                props.onSubmit(new FormData(e.currentTarget));
                            }}
                            className="space-y-4"
                        >
                            {props.children}
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition"
                                >
                                    <SaveIcon className="w-4 h-4" />
                                    Submit
                                </button>
                            </div>
                        </form>
                    )}

                    {props.mode === 'info' && (
                        <div>{props.content}</div>
                    )}
                </div>
            </div>
        </div>

    );
};
export default Modal
