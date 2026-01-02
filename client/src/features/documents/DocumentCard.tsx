import { CheckCircle2, Star, User, BookOpen, CheckCircle } from 'lucide-react';
import { useMemo } from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

interface DocumentProps {
    data: {
        id: number;
        title: string;
        description: string;
        image: string;
        type: string;
        progress?: number;
        isCompleted?: boolean;
        price?: number;
        author?: string;
        rating?: number;
    };
}

const DocumentCard = ({ data }: DocumentProps) => {
    const { addToCart } = useCart();
    const navigate = useNavigate();

    const handleAction = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent card click
        if (data.type === 'paid') {
            addToCart(data);
            alert('Đã thêm vào giỏ hàng!');
        } else if (data.type === 'test') {
            navigate(`/documents/${data.id}`);
        } else {
            navigate(`/documents/${data.id}`);
        }
    };

    const handleCardClick = () => {
        navigate(`/documents/${data.id}`);
    };
    const { isDarkMode } = useTheme();

    // Logic: If progress > 0 (Started) or Completed -> Dim background
    const hasStarted = (data.progress && data.progress > 0) || data.isCompleted;

    return (
        <div
            className="group relative rounded-2xl overflow-hidden cursor-pointer h-80 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 select-none"
            onClick={handleCardClick}
        >
            {/* Background Image */}
            <div className="absolute inset-0">
                <img
                    src={data.image}
                    alt={data.title}
                    className={`w-full h-full object-cover transition-all duration-700 ease-in-out group-hover:scale-110 ${hasStarted ? 'blur-sm brightness-50' : ''
                        }`}
                />
                {/* Dark Overlay on Hover */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            {/* Content Container - Flex flex-col to push content to bottom on hover */}
            <div className="absolute inset-0 p-6 flex flex-col justify-end">

                {/* Initial View (Title only) - Fades out on hover */}
                <div className={`transition-all duration-300 group-hover:opacity-0 ${hasStarted ? 'opacity-0' : 'opacity-100'} translate-y-0 group-hover:-translate-y-4`}>
                    <h3 className="text-xl font-bold text-white drop-shadow-md line-clamp-2">{data.title}</h3>
                </div>

                {/* Progress View (Always visible if started, moves up on hover) */}
                {hasStarted && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 transition-all duration-300 group-hover:opacity-0">
                        {data.isCompleted ? (
                            <div className="flex flex-col items-center text-green-400">
                                <CheckCircle size={48} className="mb-2" />
                                <span className="font-bold text-lg">Đã hoàn thành</span>
                            </div>
                        ) : (
                            <div className="text-center w-full">
                                <div className="text-4xl font-bold text-white mb-2">{data.progress}%</div>
                                <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                                    <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${data.progress}%` }}></div>
                                </div>
                                <div className="text-cyan-400 text-sm mt-2 font-medium">Đang học</div>
                            </div>
                        )}
                    </div>
                )}

                {/* Hover Details (Slides up) */}
                <div className="absolute inset-x-6 bottom-6 flex flex-col items-center text-center transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-75">
                    <h3 className="text-xl font-bold text-white mb-1 line-clamp-1">{data.title}</h3>
                    <div className="flex items-center gap-1 text-yellow-400 mb-2">
                        <span className="font-bold text-sm">{data.rating || 4.5}</span>
                        <Star size={14} fill="currentColor" />
                    </div>

                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                        {data.description}
                    </p>

                    {data.author && (
                        <p className="text-cyan-300 text-xs font-medium mb-3">GV: {data.author}</p>
                    )}

                    <button
                        onClick={handleAction}
                        className="bg-cyan-500 hover:bg-cyan-400 text-white px-6 py-2 rounded-full font-bold text-sm transition-all shadow-lg shadow-cyan-500/30 translate-y-4 group-hover:translate-y-0 duration-300 delay-200"
                    >
                        {data.type === 'paid'
                            ? `Mua ngay $${data.price}`
                            : data.type === 'test'
                                ? (data.isCompleted ? 'Xem kết quả' : 'Làm bài ngay')
                                : 'Học ngay'}
                    </button>
                </div>
            </div>

            {/* Bottom Footer Info (Always visible, fades out on hover to show details) */}
            <div className={`absolute bottom-0 left-0 w-full p-5 pt-12 bg-gradient-to-t from-black/90 via-black/60 to-transparent transition-opacity duration-300 ${hasStarted ? 'opacity-0' : 'opacity-100 group-hover:opacity-0'}`}>
                <h3 className="text-white font-bold text-lg line-clamp-1">{data.title}</h3>
                <div className="flex justify-between items-center mt-1">
                    <p className="text-gray-300 text-xs font-medium">{data.author}</p>
                    {data.type === 'paid' && <span className="text-cyan-400 font-bold bg-cyan-900/30 px-2 py-0.5 rounded text-xs">${data.price}</span>}
                </div>
            </div>
        </div>
    );
};

export default DocumentCard;
