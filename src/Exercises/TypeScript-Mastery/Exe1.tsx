import { useState } from "react";
import Modal from "./comp/Modal";
import { UserIcon, MailIcon, ImageIcon, PencilIcon, TrashIcon } from "lucide-react";

export interface IUsser {
    id: number;
    name: string;
    email: string;
    avtUrl?: string;
}

const Exe1 = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [users, setUsers] = useState<IUsser[]>([]);
    const [mode, setMode] = useState<"compact" | "full" | "card">("card");
    const [formData, setFormData] = useState<IUsser>({ id: 0, name: "", email: "", avtUrl: "" });
    const [editingId, setEditingId] = useState<number | null>(null);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (user: IUsser) => {
        if (editingId !== null) {
            // Cập nhật user
            setUsers((prev) =>
                prev.map((u) => (u.id === editingId ? { ...user, id: editingId } : u))
            );
        } else {
            // Thêm mới user
            setUsers((prev) => [...prev, { ...user, id: Date.now() }]);
        }

        // Reset
        setFormData({ id: 0, name: "", email: "", avtUrl: "" });
        setEditingId(null);
        setIsOpen(false);
    };

    const handleEdit = (user: IUsser) => {
        setFormData(user);
        setEditingId(user.id);
        setIsOpen(true);
    };

    const handleRemove = (user: IUsser) => {
        setUsers((prev) => prev.filter((u) => u.id !== user.id));
    };

    const handleCloseModal = () => {
        setIsOpen(false);
        setFormData({ id: 0, name: "", email: "", avtUrl: "" });
        setEditingId(null);
    };

    return (
        <div className="w-full p-4 space-y-4">
            <div className="flex justify-between items-center">
                <button
                    onClick={() => {
                        setFormData({ id: 0, name: "", email: "", avtUrl: "" });
                        setEditingId(null);
                        setIsOpen(true);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Thêm mới User
                </button>

                <Modal
                    mode="form"
                    isOpen={isOpen}
                    onClose={handleCloseModal}
                    title={editingId !== null ? "Edit User" : "Add User"}
                    onSubmit={(data) => {
                        const user = Object.fromEntries(data.entries());
                        handleSubmit(user as IUsser);
                    }}
                >
                    <UserForm formData={formData} onChange={handleChange} />
                </Modal>

                <div className="flex items-center gap-3">
                    <label htmlFor="mode" className="text-sm font-medium text-zinc-700">
                        Chế độ hiển thị:
                    </label>
                    <select
                        id="mode"
                        value={mode}
                        onChange={(e) => setMode(e.target.value as any)}
                        className="px-3 py-1.5 rounded-md border bg-white text-sm"
                    >
                        <option value="compact">Compact</option>
                        <option value="full">Full</option>
                        <option value="card">Card</option>
                    </select>
                </div>
            </div>

            {mode === "card" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {users.map((u) => (
                        <UserDisplay key={u.id} user={u} mode={mode} onEdit={handleEdit} onDelete={handleRemove} />
                    ))}
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full border text-sm text-left">
                        <thead className="bg-gray-100">
                            <tr>
                                {mode === "full" && <th className="px-4 py-2">Avatar</th>}
                                <th className="px-4 py-2">Name</th>
                                {mode === "full" && <th className="px-4 py-2">Email</th>}
                                <th className="px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <UserDisplay key={u.id} user={u} mode={mode} onEdit={handleEdit} onDelete={handleRemove} />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Exe1;

// --- UserForm ---
interface Props {
    formData: IUsser;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const UserForm = ({ formData, onChange }: Props) => (
    <>
        <div className="flex items-center gap-2 border rounded-lg px-3 py-2 focus-within:ring-2 ring-blue-500">
            <UserIcon className="w-5 h-5 text-zinc-500" />
            <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={onChange}
                className="w-full bg-transparent outline-none"
                required
            />
        </div>
        <div className="flex items-center gap-2 border rounded-lg px-3 py-2 focus-within:ring-2 ring-blue-500">
            <MailIcon className="w-5 h-5 text-zinc-500" />
            <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={onChange}
                className="w-full bg-transparent outline-none"
                required
            />
        </div>
        <div className="flex items-center gap-2 border rounded-lg px-3 py-2 focus-within:ring-2 ring-blue-500">
            <ImageIcon className="w-5 h-5 text-zinc-500" />
            <input
                type="url"
                name="avtUrl"
                placeholder="Avatar URL (optional)"
                value={formData.avtUrl}
                onChange={onChange}
                className="w-full bg-transparent outline-none"
            />
        </div>
    </>
);

// --- UserDisplay ---
interface UserDisplayProps {
    user: IUsser;
    mode?: "compact" | "full" | "card";
    onEdit?: (user: IUsser) => void;
    onDelete?: (user: IUsser) => void;
}

const UserDisplay: React.FC<UserDisplayProps> = ({ user, mode = "full", onEdit, onDelete }) => {
    const avatar = user.avtUrl || `https://i.pravatar.cc/150?u=${user.email}`;

    const ActionButtons = () => (
        <div className="flex gap-2">
            {onEdit && (
                <button onClick={() => onEdit(user)} className="text-blue-500 hover:text-blue-700" title="Edit">
                    <PencilIcon className="w-4 h-4" />
                </button>
            )}
            {onDelete && (
                <button onClick={() => onDelete(user)} className="text-red-500 hover:text-red-700" title="Delete">
                    <TrashIcon className="w-4 h-4" />
                </button>
            )}
        </div>
    );

    if (mode === "card") {
        return (
            <div className="rounded-xl border shadow-sm p-4 bg-white flex flex-col items-center text-center space-y-2">
                <img src={avatar} alt={user.name} className="w-20 h-20 rounded-full border" />
                <div>
                    <div className="font-semibold text-zinc-900">{user.name}</div>
                    <div className="text-zinc-500 text-sm">{user.email}</div>
                </div>
                <ActionButtons />
            </div>
        );
    }

    return (
        <tr className="border-b">
            {mode === "full" && (
                <td className="px-4 py-2">
                    <img src={avatar} alt={user.name} className="w-10 h-10 rounded-full border" />
                </td>
            )}
            <td className="px-4 py-2">{user.name}</td>
            {mode === "full" && <td className="px-4 py-2 text-sm text-zinc-600">{user.email}</td>}
            <td className="px-4 py-2">
                <ActionButtons />
            </td>
        </tr>
    );
};
