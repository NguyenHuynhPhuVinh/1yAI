/* eslint-disable prettier/prettier */
interface LoadingModalProps {
    message: string
}

const LoadingModal = ({ message }: LoadingModalProps) => {
    return (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-surface0/90 p-6 rounded-2xl shadow-xl max-w-[280px] w-full">
                <p className="text-center text-base font-medium text-text0 mb-4">
                    {message}
                </p>

                <div className="relative w-64 h-64 mx-auto">
                    <div className="absolute inset-0 animate-spin-slow">
                        <svg
                            viewBox="0 0 100 100"
                            className="w-full h-full fill-none stroke-primary/30"
                            strokeWidth="4"
                        >
                            <circle cx="50" cy="50" r="45" />
                        </svg>
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center animate-pulse">
                        <svg
                            viewBox="0 0 24 24"
                            className="w-64 h-64 fill-primary"
                        >
                            <path d="M12 2L14.85 9.15L22 12L14.85 14.85L12 22L9.15 14.85L2 12L9.15 9.15L12 2Z" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoadingModal
