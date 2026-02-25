export default function Loading({ text = "Loading..." }) {
    return (
        <div className="flex items-center justify-center h-[70vh]">
            <div className="flex flex-col items-center">
                <div className="h-12 w-12 border-4 border-gray-300 border-t-primary-600 rounded-full animate-spin"></div>
                <p className="mt-4 text-slate-500 text-sm">{text}</p>
            </div>
        </div>
    );
}