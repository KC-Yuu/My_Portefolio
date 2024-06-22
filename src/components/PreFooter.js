import React from "react";
import "aos/dist/aos.css";

function PreFooter() {
    return (
        <div className="bg-custom-brown">
            <div className="border-12 border-custom-black"></div>
            <div className="flex flex-col items-center
                text-white font-custom-font-madeinfinity text-xl pb-24 pt-5">
                <p data-aos="">Caron Maxime</p>
                <p className="space-x-3" data-aos="">
                    <a href="https://github.com/KC-Yuu" target="_blank" rel="noopener noreferrer">
                        <img src={process.env.PUBLIC_URL + '/assets/logos/GITHUB.png'} alt="GitHub Logo"
                             className="inline h-auto w-6"/>
                    </a>
                    <a href="https://www.linkedin.com/in/maxime-caron-epitech/" target="_blank" rel="noopener noreferrer">
                        <img src={process.env.PUBLIC_URL + '/assets/logos/LIKEDIN.png'} alt="LinkedIn Logo"
                             className="inline h-auto w-6"/>
                    </a>
                </p>
                <p data-aos="">Made with ❤️ / <img src={process.env.PUBLIC_URL + '/assets/logos/REACT.png'} alt="React Logo"
                                                   className="inline h-auto w-5"/></p>
            </div>
        </div>
    );
}

export default PreFooter;
