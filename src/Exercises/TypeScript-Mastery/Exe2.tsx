
interface Column<T> {
    key: keyof T;
    label: string;
    sortable?: boolean;
    render?: (value: T[keyof T], item: T) => React.ReactNode;
}

interface TableProps<T> {
    data: T[];
    columns: Column<T>[];
    onRowSelect?: (selectedRows: T[]) => void;
    onSort?: (key: keyof T, direction: 'asc' | 'desc') => void;
    loading?: boolean;
}


interface User {
    id: string;
    name: string;
    email: string;
    age: number;
}

const users: User[] = [
    { id: "1", name: "Alice", email: "alice@example.com", age: 24 },
    { id: "2", name: "Bob", email: "bob@example.com", age: 30 },
];

export const Exe2 = () => {
    const userColumns: Column<User>[] = [
        { key: "name", label: "Name", sortable: true },
        { key: "email", label: "Email", sortable: true },
        { key: "age", label: "Age", sortable: true, render: (val) => <b>{val}</b> },
    ];

    return (
        <div>
            <DataTable
                data={users}
                columns={userColumns}
                onSort={(key, dir) => console.log("Sorting", key, dir)}
                onRowSelect={(rows) => console.log("Selected rows", rows)}
            />
        </div>
    )
}

import { useState } from "react";

const DataTable = <T extends { id: string }>({
    data,
    columns,
    onRowSelect,
    onSort,
    loading = false,
}: TableProps<T>) => {
    const [sortKey, setSortKey] = useState<keyof T | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    // Xử lý sắp xếp dữ liệu
    const sortedData = [...data].sort((a, b) => {
        if (!sortKey) return 0;

        const aVal = a[sortKey];
        const bVal = b[sortKey];

        if (typeof aVal === "string" && typeof bVal === "string") {
            return sortDirection === "asc"
                ? aVal.localeCompare(bVal)
                : bVal.localeCompare(aVal);
        }

        if (typeof aVal === "number" && typeof bVal === "number") {
            return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
        }

        return 0;
    });

    // Xử lý toggle chọn dòng
    const toggleSelect = (id: string) => {
        const newSet = new Set(selectedIds);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);

        setSelectedIds(newSet);
        if (onRowSelect) {
            const selectedRows = data.filter((row) => newSet.has(row.id));
            onRowSelect(selectedRows);
        }
    };

    const handleSort = (key: keyof T) => {
        const direction = key === sortKey && sortDirection === 'asc' ? 'desc' : 'asc';
        setSortKey(key);
        setSortDirection(direction);
        onSort?.(key, direction);
    };

    return (
        <div className="overflow-x-auto border rounded-md">
            {loading && <div className="p-4">Đang tải dữ liệu...</div>}
            <table className="min-w-full table-auto text-sm">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-2 py-1">
                            <input
                                type="checkbox"
                                checked={selectedIds.size === data.length}
                                onChange={() => {
                                    const allIds = data.map((d) => d.id);
                                    const newSet: Set<string> = selectedIds.size === data.length ? new Set() : new Set(allIds);
                                    setSelectedIds(newSet);
                                    if (onRowSelect) {
                                        const selectedRows = data.filter((row) => newSet.has(row.id));
                                        onRowSelect(selectedRows);
                                    }
                                }}
                            />
                        </th>
                        {columns.map((col) => (
                            <th
                                key={String(col.key)}
                                className="px-4 py-2 cursor-pointer"
                                onClick={() => col.sortable && handleSort(col.key)}
                            >
                                {col.label}
                                {sortKey === col.key && (
                                    <span> {sortDirection === 'asc' ? '↑' : '↓'}</span>
                                )}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {sortedData.map((item) => (
                        <tr key={item.id} className="border-t hover:bg-gray-50">
                            <td className="px-2 py-1">
                                <input
                                    type="checkbox"
                                    checked={selectedIds.has(item.id)}
                                    onChange={() => toggleSelect(item.id)}
                                />
                            </td>
                            {columns.map((col) => (
                                <td key={String(col.key)} className="px-4 py-2">
                                    {col.render
                                        ? col.render(item[col.key], item)
                                        : String(item[col.key])}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default DataTable;

