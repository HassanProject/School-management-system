import React, { useState } from 'react';
import { Play, X, Maximize2 } from 'lucide-react';

const DemoVideo = () => {
    const [isVideoOpen, setIsVideoOpen] = useState(false);

    return (
        <>
            {/* Video Modal */}
            {isVideoOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="relative w-full max-w-4xl">
                        <button
                            onClick={() => setIsVideoOpen(false)}
                            className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
                        >
                            <X size={24} />
                        </button>
                        <div className="relative w-full h-0 pb-[56.25%]">
                            <iframe
                                className="absolute top-0 left-0 w-full h-full rounded-lg"
                                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                                title="SMS Pro Demo"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                </div>
            )}

            {/* Video Thumbnail */}
            <div className="relative group cursor-pointer" onClick={() => setIsVideoOpen(true)}>
                <div className="relative w-full h-64 md:h-80 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg overflow-hidden">
                    {/* Video Thumbnail Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
                        <div className="text-center text-white">
                            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                <Play className="text-white ml-1" size={32} />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Watch Demo</h3>
                            <p className="text-blue-100">See SMS Pro in action</p>
                        </div>
                    </div>

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300"></div>

                    {/* Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Play className="text-blue-600 ml-1" size={24} />
                        </div>
                    </div>
                </div>

                {/* Video Info */}
                <div className="mt-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">SMS Pro Demo</h3>
                    <p className="text-gray-600">Watch how our school management system transforms your administrative workflow</p>
                </div>
            </div>
        </>
    );
};

export default DemoVideo; 