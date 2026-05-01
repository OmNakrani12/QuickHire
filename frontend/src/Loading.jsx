import { InfinitySpin } from 'react-loader-spinner';
// import { Vortex } from 'react-loader-spinner';
export default function Loading({ text = "Loading..." }) {
    const role = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).role : null;
    let color = "#10B981";
    if(role === "worker"){
        color = "#3B82F6";
    }
    return (
        <div className="flex items-center justify-center h-[70vh]">
            <div className="flex flex-col items-center">
                <InfinitySpin
                    width="200"
                    color={color}
                />
                {/* <Vortex
                    visible={true}
                    height="80"
                    width="80"
                    ariaLabel="vortex-loading"
                    wrapperStyle={{}}
                    wrapperClass="vortex-wrapper"
                    colors={['white', 'white', 'white', 'green', 'green', 'green']}
                /> */}
                {/* <div className="h-12 w-12 border-4 border-gray-300 border-t-secondary-600 rounded-full animate-spin"></div> */}
                <p className="mt-4 text-slate-500 text-sm">{text}</p>
            </div>
        </div>
    );
}