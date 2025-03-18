import React, { useState, useEffect } from "react"
import AOS from "aos"
import "aos/dist/aos.css"

/* eslint-disable jsx-a11y/anchor-is-valid */

function Header() {
    const [showNav, setShowNav] = useState(false)
    const [isClicked, setIsClicked] = useState(false)
    const [activeSection, setActiveSection] = useState("home")

    const toggleNav = () => {
        setShowNav(!showNav)
    }

    useEffect(() => {
        document.body.style.overflow = "hidden"

        const timer1 = setTimeout(() => setShowNav(false), 800)
        const timer2 = setTimeout(() => {
            setIsClicked(true)
            document.body.style.overflowY = "auto"
        }, 800)

        return () => {
            clearTimeout(timer1)
            clearTimeout(timer2)
        }
    }, [])

    useEffect(() => {
        AOS.init()
    }, [])

    useEffect(() => {
        if (isClicked) {
            const timer3 = setTimeout(() => {
                const leftDoor = document.querySelector(
                    ".animate-slideOutToLeft"
                )
                const rightDoor = document.querySelector(
                    ".animate-slideOutToRight"
                )
                if (leftDoor) leftDoor.style.display = "none"
                if (rightDoor) rightDoor.style.display = "none"
            }, 2000)

            return () => clearTimeout(timer3)
        }
    }, [isClicked])

    useEffect(() => {
        const handleScroll = () => {
            const sections = ["home", "about", "skills", "projects", "contact"]
            const scrollPosition = window.scrollY + 50

            let currentActiveSection = "home"

            sections.forEach((sectionId) => {
                const element = document.getElementById(sectionId)
                if (element) {
                    const sectionTop = element.offsetTop - 50
                    const sectionHeight = element.offsetHeight

                    if (
                        scrollPosition >= sectionTop &&
                        scrollPosition < sectionTop + sectionHeight
                    ) {
                        currentActiveSection = sectionId
                    }
                }
            })

            if (activeSection !== currentActiveSection) {
                setActiveSection(currentActiveSection)
            }
        }

        let ticking = false
        const scrollListener = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    handleScroll()
                    ticking = false
                })
                ticking = true
            }
        }

        window.addEventListener("scroll", scrollListener)
        return () => window.removeEventListener("scroll", scrollListener)
    }, [activeSection])

    function handleClick(id) {
        document.getElementById(id).scrollIntoView({ behavior: "smooth" })
        setActiveSection(id)
    }

    return (
        <header id="home" className="mb-44 max-sm:mb-20 overflow-x-hidden">
            <nav className="bg-custom-gold border-2 p-4 w-full border-custom-gold shadow-xl fixed top-0 z-10">
                <button
                    onClick={toggleNav}
                    className="md:hidden flex items-center"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className={`h-6 w-6 transition-transform duration-300 ${
                            showNav ? "rotate-90" : ""
                        }`}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d={
                                showNav
                                    ? "M6 18L18 6M6 6l12 12"
                                    : "M4 6h16M4 12h16M4 18h16"
                            }
                        />
                    </svg>
                    <span className="ml-2 font-custom-font-japon text-sm">
                        {activeSection === "home"
                            ? "ACCUEIL"
                            : activeSection === "about"
                            ? "A PROPOS"
                            : activeSection === "skills"
                            ? "COMPETENCES"
                            : activeSection === "projects"
                            ? "PROJETS"
                            : "CONTACT"}
                    </span>
                </button>
                <div
                    className={`fixed inset-0 bg-black bg-opacity-50 z-0 transition-opacity duration-300 md:hidden ${
                        showNav
                            ? "opacity-100"
                            : "opacity-0 pointer-events-none"
                    }`}
                    onClick={toggleNav}
                ></div>
                <ul
                    className={`flex flex-col space-y-2 md:space-y-0 md:flex-row md:space-x-4 justify-center text-base md:text-xl lg:text-2xl cursor-pointer
                        font-custom-font-japon ${
                            showNav ? "translate-x-0" : "-translate-x-full"
                        } md:translate-x-0 md:hidden bg-custom-gold fixed left-0 top-0 h-full w-3/4 p-8 shadow-lg z-20 transition-transform duration-300 ease-in-out pt-16`}
                >
                    <li className="absolute top-4 right-4 md:hidden">
                        <button onClick={toggleNav} className="text-2xl text-black rounded-full w-8 h-8 flex items-center justify-center">
                            &times;
                        </button>
                    </li>
                    <li
                        className={`bg-custom-gold opacity-0 animate-fadeIn border-b border-custom-brown pb-2 ${
                            activeSection === "home"
                                ? "text-red-700 font-bold"
                                : ""
                        }`}
                    >
                        <a
                            onClick={() => {
                                handleClick("home")
                                toggleNav()
                            }}
                            className="hover:text-red-700 block py-2 transition-all duration-300 transform hover:translate-x-2"
                        >
                            ACCUEIL
                        </a>
                    </li>
                    <li
                        className={`bg-custom-gold opacity-0 animate-fadeIn border-b border-custom-brown pb-2 ${
                            activeSection === "about"
                                ? "text-red-700 font-bold"
                                : ""
                        }`}
                    >
                        <a
                            onClick={() => {
                                handleClick("about")
                                toggleNav()
                            }}
                            className="hover:text-red-700 block py-2 transition-all duration-300 transform hover:translate-x-2"
                        >
                            A PROPOS
                        </a>
                    </li>
                    <li
                        className={`bg-custom-gold opacity-0 animate-fadeIn border-b border-custom-brown pb-2 ${
                            activeSection === "skills"
                                ? "text-red-700 font-bold"
                                : ""
                        }`}
                    >
                        <a
                            onClick={() => {
                                handleClick("skills")
                                toggleNav()
                            }}
                            className="hover:text-red-700 block py-2 transition-all duration-300 transform hover:translate-x-2"
                        >
                            COMPETENCES
                        </a>
                    </li>
                    <li
                        className={`bg-custom-gold opacity-0 animate-fadeIn border-b border-custom-brown pb-2 ${
                            activeSection === "projects"
                                ? "text-red-700 font-bold"
                                : ""
                        }`}
                    >
                        <a
                            onClick={() => {
                                handleClick("projects")
                                toggleNav()
                            }}
                            className="hover:text-red-700 block py-2 transition-all duration-300 transform hover:translate-x-2"
                        >
                            PROJETS
                        </a>
                    </li>
                    <li
                        className={`bg-custom-gold opacity-0 animate-fadeIn ${
                            activeSection === "contact"
                                ? "text-red-700 font-bold"
                                : ""
                        }`}
                    >
                        <a
                            onClick={() => {
                                handleClick("contact")
                                toggleNav()
                            }}
                            className="hover:text-red-700 block py-2 transition-all duration-300 transform hover:translate-x-2"
                        >
                            CONTACT
                        </a>
                    </li>

                    <div className="mt-auto pt-8">
                        <div className="flex justify-center space-x-4 mb-4">
                            <a
                                href="https://github.com/KC-Yuu"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="transform transition duration-300 hover:scale-110"
                            >
                                <img
                                    src="/assets/logos/GITHUB.png"
                                    alt="GitHub"
                                    className="w-8 h-8"
                                />
                            </a>
                            <a
                                href="https://www.linkedin.com/in/maxime-caron-epitech/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="transform transition duration-300 hover:scale-110"
                            >
                                <img
                                    src="/assets/logos/LIKEDIN.png"
                                    alt="LinkedIn"
                                    className="w-8 h-8"
                                />
                            </a>
                        </div>
                        <p className="text-xs text-center font-custom-font-madeinfinity">
                            © 2025 Caron Maxime
                        </p>
                    </div>
                </ul>

                <ul
                    className="hidden md:flex flex-row space-x-8 justify-center cursor-pointer
                    text-base md:text-xl lg:text-4xl font-custom-font-japon relative"
                >
                    <li className="bg-custom-gold opacity-0 animate-fadeIn relative group">
                        <a
                            onClick={() => handleClick("home")}
                            className="hover:text-red-700 px-2 py-1 block"
                        >
                            ACCUEIL
                        </a>
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-700 transition-all duration-300 group-hover:w-full"></span>
                    </li>
                    <li className="bg-custom-gold opacity-0 animate-fadeIn relative group">
                        <a
                            onClick={() => handleClick("about")}
                            className="hover:text-red-700 px-2 py-1 block"
                        >
                            A PROPOS
                        </a>
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-700 transition-all duration-300 group-hover:w-full"></span>
                    </li>
                    <li className="bg-custom-gold opacity-0 animate-fadeIn relative group">
                        <a
                            onClick={() => handleClick("skills")}
                            className="hover:text-red-700 px-2 py-1 block"
                        >
                            COMPETENCES
                        </a>
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-700 transition-all duration-300 group-hover:w-full"></span>
                    </li>
                    <li className="bg-custom-gold opacity-0 animate-fadeIn relative group">
                        <a
                            onClick={() => handleClick("projects")}
                            className="hover:text-red-700 px-2 py-1 block"
                        >
                            PROJETS
                        </a>
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-700 transition-all duration-300 group-hover:w-full"></span>
                    </li>
                    <li className="bg-custom-gold opacity-0 animate-fadeIn relative group">
                        <a
                            onClick={() => handleClick("contact")}
                            className="hover:text-red-700 px-2 py-1 block"
                        >
                            CONTACT
                        </a>
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-700 transition-all duration-300 group-hover:w-full"></span>
                    </li>
                </ul>
            </nav>
            <div className="lg:mt-36 md:mt-24 sm:mt-20 mt-28">
                <div className="border-10 border-custom-black bg-custom-black overflow-hidden">
                    <p className="text-defillant text-white text-lg max-sm:text-sm font-bold animate-infiniteScrollLeft whitespace-nowrap">
                        マキシム |ウェブ開発者 - マキシム |ウェブ開発者 -
                        マキシム |ウェブ開発者 -マキシム |ウェブ開発者 -
                        マキシム |ウェブ開発者 - マキシム |ウェブ開発者 -
                        マキシム |ウェブ開発者 - マキシム |ウェブ開発者 -
                        マキシム |ウェブ開発者
                    </p>
                </div>
                <div className="border-12 border-custom-brown max-sm:border-8"></div>
                <div className="relative">
                    <img
                        src="/assets/torii-image.jpg"
                        alt="bannière header haut"
                        className="w-full h-auto object-cover object-top shadow-2xl opacity-80 max-sm:h-[400px]"
                    />
                    <div
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                    bg-black bg-opacity-60 text-white text-center font-custom-font-japon p-4 max-sm:p-5
                    opacity-0 animate-fadeIn rounded-2xl text-base md:text-lg lg:text-8xl max-sm:text-3xl max-sm:w-[90%]"
                    >
                        CARON MAXIME
                        <br />
                        DEVELOPPEUR WEB
                        <br />
                        <span className="block mt-2 text-xs md:text-sm lg:text-2xl max-sm:text-xs">
                            (Je code des pixels et dompte les bugs)
                        </span>
                    </div>
                </div>
                <div className="border-12 border-custom-brown max-sm:border-8"></div>
                <div className="border-10 border-custom-black bg-custom-black overflow-hidden">
                    <p className="text-defillant text-white text-lg max-sm:text-sm font-bold animate-infiniteScrollRight whitespace-nowrap">
                        マキシム |ウェブ開発者 - マキシム |ウェブ開発者 -
                        マキシム |ウェブ開発者 -マキシム |ウェブ開発者 -
                        マキシム |ウェブ開発者 - マキシム |ウェブ開発者 -
                        マキシム |ウェブ開発者 - マキシム |ウェブ開発者 -
                        マキシム |ウェブ開発者
                    </p>
                </div>
            </div>
            <div
                className={`w-1/2 overflow-hidden z-20 absolute top-0 left-0 h-full ${
                    isClicked ? "animate-slideOutToLeft" : ""
                }`}
            >
                <img
                    src="/assets/porte-gauche.png"
                    alt="bannière header gauche"
                    className="w-full h-full object-cover"
                />
            </div>
            <div
                className={`w-1/2 overflow-hidden z-20 absolute top-0 right-0 h-full ${
                    isClicked ? "animate-slideOutToRight" : ""
                }`}
            >
                <img
                    src="/assets/porte-droite.png"
                    alt="bannière header droite"
                    className="w-full h-full object-cover"
                />
            </div>
        </header>
    )
}

export default Header
