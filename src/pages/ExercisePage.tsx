import { useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import Exe1 from "@/Exercises/TypeScript-Mastery/Exe1";
import { Exe2 } from "@/Exercises/TypeScript-Mastery/Exe2";
import { Exe3 } from "@/Exercises/TypeScript-Mastery/Exe3";
import { QurreyLesson } from "@/Exercises/React-Query-Lessons/QueryLessons";

const ExercisePage = () => {
    const [openCourse, setOpenCourse] = useState<string | null>(null);
    const params = useParams<{ course: string; exercise: string }>();

    const navItems = [
        {
            path: "typeScript-mastery",
            label: "TypeScript Mastery",
            exe: [{ path: "exe-1", label: "Exe-1", component: <Exe1 /> }, { path: "exe-2", label: "Exe-2", component: <Exe2 /> }, { path: "exe-3", label: "Exe-3", component: <Exe3 /> }],
        },
        {
            path: "react-query-mastery",
            label: "React Query Mastery",
            exe: [{ path: "exe-1", label: "Exe-1", component: <QurreyLesson /> }],
        },
    ];

    const toggleCourse = (coursePath: string) => {
        setOpenCourse((prev) => (prev === coursePath ? null : coursePath));
    };

    // Lấy component từ params
    const exerciseComponent = (() => {
        const course = navItems.find((c) => c.path === params.course);
        const exercise = course?.exe.find((e) => e.path === params.exercise);
        return exercise?.component;
    })();

    return (
        <div className="h-full w-full flex">
            {/* Sidebar */}
            <div className="w-80 p-4 border-r space-y-4">
                {navItems.map((item) => (
                    <div key={item.path} className="border rounded-lg">
                        <button
                            onClick={() => toggleCourse(item.path)}
                            className="w-full text-left px-4 py-2 font-semibold bg-gray-100 hover:bg-gray-200 rounded-t"
                        >
                            {item.label}
                        </button>

                        {openCourse === item.path && (
                            <div className="bg-white border-t px-4 py-2 space-y-2">
                                {item.exe.map((exe) => (
                                    <NavLink
                                        key={exe.path}
                                        to={`/exercise/${item.path}/${exe.path}`}
                                        className={({ isActive }) =>
                                            `block px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                                                ? "bg-blue-500 text-white"
                                                : "text-gray-700 hover:bg-gray-200"
                                            }`
                                        }
                                    >
                                        {exe.label}
                                    </NavLink>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Exercise body */}
            <div className="flex-1 bg-green-100 p-6 overflow-auto">
                {exerciseComponent ?? <div>Chọn một bài tập từ menu bên trái.</div>}
            </div>
        </div>
    );
};

export default ExercisePage;
