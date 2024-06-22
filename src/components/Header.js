import React, {useState, useEffect} from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

function Header() {
    const [showNav, setShowNav] = useState(false);
    const [isClicked, setIsClicked] = useState(false);

    const toggleNav = () => {
        setShowNav(!showNav);
    }

    useEffect(() => {
        document.body.style.overflow = 'hidden';

        const timer1 = setTimeout(() => setShowNav(false), 800);
        const timer2 = setTimeout(() => {
            setIsClicked(true);
            document.body.style.overflowY = 'auto';
        }, 800);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, []);

    useEffect(() => {
        AOS.init();
    }, []);

    function handleClick(id) {
        document.getElementById(id).scrollIntoView({behavior: 'smooth'});
    }

    return (
        <header id="home" className="mb-44">
            <nav className="bg-custom-gold border-2 p-4 border-custom-gold shadow-xl fixed top-0 w-full z-10">
                <button onClick={toggleNav} className="md:hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                         className="h-6 w-6">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M4 6h16M4 12h16M4 18h16"/>
                    </svg>
                </button>
                <ul className={`flex flex-row space-x-8 md:space-x-4 justify-center text-4xl md:text-4xl cursor-pointer 
                        lg:text-5xl font-custom-font-japon ${showNav ? 'block' : 'hidden'} md:hidden`}>
                    <li className="bg-custom-gold opacity-0 animate-fadeIn">
                        <a onClick={() => handleClick('home')} className="hover:text-red-700">ACCUEIL</a>
                    </li>
                    <li className="bg-custom-gold opacity-0 animate-fadeIn">
                        <a onClick={() => handleClick('about')} className="hover:text-red-700">A PROPOS</a>
                    </li>
                    <li className="bg-custom-gold opacity-0 animate-fadeIn">
                        <a onClick={() => handleClick('skills')} className="hover:text-red-700">COMPETENCES</a>
                    </li>
                    <li className="bg-custom-gold opacity-0 animate-fadeIn">
                        <a onClick={() => handleClick('projects')} className="hover:text-red-700">PROJETS</a>
                    </li>
                    <li className="bg-custom-gold opacity-0 animate-fadeIn">
                        <a onClick={() => handleClick('contact')} className="hover:text-red-700">CONTACT</a>
                    </li>
                </ul>
                <ul className="hidden md:flex flex-row space-x-8 md:space-x-8 justify-center cursor-pointer
                    text-4xl md:text-4xl lg:text-5xl font-custom-font-japon">
                    <li className="bg-custom-gold opacity-0 animate-fadeIn">
                        <a onClick={() => handleClick('home')} className="hover:text-red-700">ACCUEIL</a>
                    </li>
                    <li className="bg-custom-gold opacity-0 animate-fadeIn">
                        <a onClick={() => handleClick('about')} className="hover:text-red-700">A PROPOS</a>
                    </li>
                    <li className="bg-custom-gold opacity-0 animate-fadeIn">
                        <a onClick={() => handleClick('skills')} className="hover:text-red-700">COMPETENCES</a>
                    </li>
                    <li className="bg-custom-gold opacity-0 animate-fadeIn">
                        <a onClick={() => handleClick('projects')} className="hover:text-red-700">PROJETS</a>
                    </li>
                    <li className="bg-custom-gold opacity-0 animate-fadeIn">
                        <a onClick={() => handleClick('contact')} className="hover:text-red-700">CONTACT</a>
                    </li>
                </ul>
            </nav>
            <div className="lg:mt-44 md:mt-24 sm:mt-20">
                <div className="border-10 border-custom-black bg-custom-black">
                    <p className="text-defillant text-white text-lg font-bold animate-infiniteScrollLeft">マキシム
                        |ウェブ開発者 -
                        マキシム
                        |ウェブ開発者 - マキシム |ウェブ開発者 -マキシム |ウェブ開発者 - マキシム |ウェブ開発者 -
                        マキシム |ウェブ開発者 - マキシム |ウェブ開発者 - マキシム |ウェブ開発者 - マキシム
                        |ウェブ開発者</p>
                </div>
                <div className="border-12 border-custom-brown"></div>
                <div className="relative">
                    <img src="/assets/torii-image.jpg" alt="bannière header haut"
                         className="w-full object-cover object-top shadow-2xl opacity-80"/>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                    bg-black bg-opacity-60 text-white text-center font-custom-font-japon p-4
                    opacity-0 animate-fadeIn rounded-2xl text-4xl md:text-5xl lg:text-6xl">
                        CARON MAXIME
                        <br/>
                        DEVELOPPEUR WEB
                        <br/>
                        <span className="block mt-2 text-lg md:text-xl lg:text-4xl">(Je code des pixels et dompte
                            les bugs)</span>
                    </div>
                </div>
                <div className="border-12 border-custom-brown"></div>
                <div className="border-10 border-custom-black bg-custom-black">
                    <p className="text-defillant text-white text-lg font-bold animate-infiniteScrollRight">マキシム
                        |ウェブ開発者 -
                        マキシム
                        |ウェブ開発者 - マキシム |ウェブ開発者 -マキシム |ウェブ開発者 - マキシム |ウェブ開発者 -
                        マキシム |ウェブ開発者 - マキシム |ウェブ開発者 - マキシム |ウェブ開発者 - マキシム
                        |ウェブ開発者</p>
                </div>
            </div>
            <div
                className={`w-1/2 overflow-hidden z-20 absolute top-0 left-0 h-full ${isClicked ? "animate-slideOutToLeft" : ""}`}
            >
                <img src="/assets/porte-gauche.png" alt="bannière header gauche"
                     className="w-full h-full object-cover"/>
            </div>
            <div
                className={`w-1/2 overflow-hidden z-20 absolute top-0 right-0 h-full ${isClicked ? "animate-slideOutToRight" : ""}`}
            >
                <img src="/assets/porte-droite.png" alt="bannière header droite"
                     className="w-full h-full object-cover"/>
            </div>
        </header>
    );
}

export default Header;