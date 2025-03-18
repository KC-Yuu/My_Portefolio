import React from "react";
import "aos/dist/aos.css";

function PreFooter() {
    return (
        <div className="bg-custom-brown">
            <div className="border-12 border-custom-black max-sm:border-8"></div>
            <div
                className="flex flex-col items-center
                text-white font-custom-font-madeinfinity text-xl pb-24 pt-5 max-sm:pb-16 max-sm:text-base"
            >
                <p data-aos="">Caron Maxime</p>
                <div
                    className="flex items-center justify-center space-x-4 mt-2"
                    data-aos=""
                >
                    <a
                        href="https://github.com/KC-Yuu"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center transform transition duration-300 hover:scale-110"
                    >
                        <img
                            src={
                                process.env.PUBLIC_URL +
                                "/assets/logos/GITHUB.png"
                            }
                            alt="GitHub Logo"
                            className="h-auto w-6"
                        />
                    </a>
                    <a
                        href="https://www.linkedin.com/in/maxime-caron-epitech/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center transform transition duration-300 hover:scale-110"
                    >
                        <img
                            src={
                                process.env.PUBLIC_URL +
                                "/assets/logos/LIKEDIN.png"
                            }
                            alt="LinkedIn Logo"
                            className="h-auto w-6"
                        />
                    </a>
                </div>
                <p data-aos="" className="flex items-center mt-2">
                    Made with{" "}
                    <span className="text-white-500 mx-1">❤️ and</span>
                    <img
                        src={process.env.PUBLIC_URL + "/assets/logos/REACT.png"}
                        alt="React Logo"
                        className="inline h-auto w-5 ml-1"
                    />
                </p>
            </div>
        </div>
    );
}

export default PreFooter;
