import { useState } from "react";

export type ValidatorFn = (value: any) => string | null;
export type AsyncValidatorFn = (value: any) => Promise<string | null>;

export type FieldType = "text" | "email" | "password" | "number" | "select" | "checkbox";

interface BaseField {
    name: string;
    label: string;
    type: FieldType;
    required?: boolean;
    validators?: ValidatorFn[];
    asyncValidators?: AsyncValidatorFn[];
}

interface SelectField extends BaseField {
    type: "select";
    options: { value: string; label: string }[];
}

export type FormField = BaseField | SelectField;

interface FormProps {
    fields: FormField[];
    onSubmit: (data: Record<string, any>) => void | Promise<void>;
}

const Form = ({ fields, onSubmit }: FormProps) => {
    const [formValues, setFormValues] = useState<Record<string, any>>(() => {
        const initial: Record<string, any> = {};
        fields.forEach((f) => {
            initial[f.name] = f.type === "checkbox" ? false : "";
        });
        return initial;
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loadingFields, setLoadingFields] = useState<Set<string>>(new Set());

    const handleChange = async (name: string, value: any) => {
        setFormValues((prev) => ({ ...prev, [name]: value }));
        const field = fields.find((f) => f.name === name);
        if (!field) return;

        let error: string | null = null;

        // Sync validation
        if (field.required && (value === "" || value === false)) {
            error = `${field.label} is required`;
        } else if (field.validators) {
            for (let validator of field.validators) {
                error = validator(value);
                if (error) break;
            }
        }

        // Async validation
        if (!error && field.asyncValidators) {
            setLoadingFields((prev) => new Set(prev).add(name));
            for (let asyncValidator of field.asyncValidators) {
                error = await asyncValidator(value);
                if (error) break;
            }
            setLoadingFields((prev) => {
                const next = new Set(prev);
                next.delete(name);
                return next;
            });
        }

        setErrors((prev) => ({ ...prev, [name]: error || "" }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let isValid = true;
        const newErrors: Record<string, string> = {};

        for (const field of fields) {
            const value = formValues[field.name];
            let error: string | null = null;

            if (field.required && (value === "" || value === false)) {
                error = `${field.label} is required`;
            } else if (field.validators) {
                for (let validator of field.validators) {
                    error = validator(value);
                    if (error) break;
                }
            }
            if (!error && field.asyncValidators) {
                for (let asyncValidator of field.asyncValidators) {
                    error = await asyncValidator(value);
                    if (error) break;
                }
            }
            if (error) {
                isValid = false;
                newErrors[field.name] = error;
            }
        }

        setErrors(newErrors);
        if (isValid) await onSubmit(formValues);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map((field) => {
                const error = errors[field.name];
                const isLoading = loadingFields.has(field.name);

                return (
                    <div key={field.name} className="space-y-1">
                        <label className="block font-medium">
                            {field.label}
                            {field.required && <span className="text-red-500"> *</span>}
                        </label>

                        {field.type === "select" ? (
                            <select
                                id={field.name}
                                name={field.name}
                                value={formValues[field.name]}
                                onChange={(e) => handleChange(field.name, e.target.value)}
                                className="border px-3 py-2 rounded w-full"
                            >
                                <option value="">Select...</option>
                                {(field as SelectField).options.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        ) : field.type === "checkbox" ? (
                            <input
                                id={field.name}
                                name={field.name}
                                type="checkbox"
                                checked={formValues[field.name]}
                                onChange={(e) => handleChange(field.name, e.target.checked)}
                            />
                        ) : (
                            <input
                                id={field.name}
                                name={field.name}
                                type={field.type}
                                value={formValues[field.name]}
                                onChange={(e) => handleChange(field.name, e.target.value)}
                                className="border px-3 py-2 rounded w-full"
                            />
                        )}

                        {isLoading && <div className="text-xs text-blue-500">Validating...</div>}
                        {error && <div className="text-sm text-red-600">{error}</div>}
                    </div>
                );
            })}

            <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
                Submit
            </button>
        </form>
    );
};

export default Form;

const formFields: FormField[] = [
    {
        name: "email",
        label: "Email",
        type: "email",
        required: true,
        validators: [
            (v) => (!v ? "Email không được để trống" : null),
            (v) => (v && !v.includes("@") ? "Email không hợp lệ" : null),
        ],
    },
    {
        name: "quatity",
        label: "Số lượng",
        type: "number",
        required: true,
        validators: [
            (v) => (v < 10 ? "số lượng phải lớn hơn 10" : null),
            // (v) => (v && !v.includes("@") ? "Email không hợp lệ" : null),
        ],
    },
    {
        name: "username",
        label: "Username",
        type: "text",
        required: true,
        asyncValidators: [
            async (val) => {
                await new Promise((r) => setTimeout(r, 700));
                if (val === "admin") return "Username đã được sử dụng";
                return null;
            },
        ],
    },
    {
        name: "role",
        label: "Role",
        type: "select",
        options: [
            { value: "admin", label: "Admin" },
            { value: "user", label: "User" },
        ],
    },
    {
        name: "agree",
        label: "Tôi đồng ý các điều khoản",
        type: "checkbox",
        validators: [(v) => (!v ? "Bạn phải đồng ý điều khoản" : null)],
    },
];


const formFields2: FormField[] = [
    {
        name: "email",
        label: "Email",
        type: "email",
        required: true,
        validators: [
            (v) => (!v ? "Email không được để trống" : null),
            (v) => (v && !v.includes("@") ? "Email không hợp lệ" : null),
        ],
    },
    {
        name: "username",
        label: "Username",
        type: "text",
        required: true,
        asyncValidators: [
            async (val) => {
                await new Promise((r) => setTimeout(r, 700));
                if (val === "admin") return "Username đã được sử dụng";
                return null;
            },
        ],
    },
    {
        name: "role",
        label: "Role",
        type: "select",
        options: [
            { value: "admin", label: "Admin" },
            { value: "user", label: "User" },
        ],
    },
    {
        name: "agree",
        label: "Tôi đồng ý các điều khoản",
        type: "checkbox",
        validators: [(v) => (!v ? "Bạn phải đồng ý điều khoản" : null)],
    },
];

export const Exe3 = () => {
    const handleSubmit = (data: Record<string, any>) => {
        console.log("Form data:", data);
        alert("Submit thành công!");
    };

    return (
        <div className="max-w-md mx-auto p-4">
            <h2 className="text-xl font-semibold mb-4">Demo Form</h2>
            <Form fields={formFields} onSubmit={handleSubmit} />
        </div>
    );
}