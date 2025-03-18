import React, { useState, useEffect } from "react"
import "aos/dist/aos.css"
import { projects } from "../data/projetData"

function Projects() {
    const [currentProjectIndex, setCurrentProjectIndex] = useState(0)
    const [showDescriptionAndStacks, setShowDescriptionAndStacks] =
        useState(true)
    const [userInteracted, setUserInteracted] = useState(false)
    const [inactivityTimer, setInactivityTimer] = useState(null)
    const [progress, setProgress] = useState(0)
    const [isMobileView, setIsMobileView] = useState(false)

    useEffect(() => {
        const checkMobileView = () => {
            setIsMobileView(window.innerWidth < 640)
        }

        checkMobileView()
        window.addEventListener("resize", checkMobileView)

        return () => window.removeEventListener("resize", checkMobileView)
    }, [])

    useEffect(() => {
        const interval = setInterval(() => {
            if (!userInteracted && !isMobileView) {
                setProgress((prevProgress) => {
                    if (prevProgress >= 100) {
                        setCurrentProjectIndex(
                            (prevIndex) => (prevIndex + 1) % projects.length
                        )
                        return 0
                    }
                    return prevProgress + 1
                })
            }
        }, 50)

        return () => clearInterval(interval)
    }, [userInteracted, isMobileView])

    useEffect(() => {
        if (userInteracted) {
            clearTimeout(inactivityTimer)
            const timer = setTimeout(() => {
                setUserInteracted(false)
            }, 10000)
            setInactivityTimer(timer)
        }
        // eslint-disable-next-line
    }, [userInteracted])

    const handleButtonClick = (index) => {
        setCurrentProjectIndex(index)
        setShowDescriptionAndStacks(true)
        setUserInteracted(true)
        setProgress(0)
    }

    const toggleView = () => {
        setShowDescriptionAndStacks(!showDescriptionAndStacks)
        setUserInteracted(true)
    }

    const currentProject = projects[currentProjectIndex]

    return (
        <div
            id="projects"
            className="mx-auto mt-32 mb-44 grid grid-cols-1 md:grid-cols-2 gap-20 max-sm:mt-10 max-sm:mb-20 max-sm:gap-10 px-4"
        >
            <div className="max-sm:hidden">
                <div className="relative overflow-hidden rounded-2xl border-2 border-custom-brown mt-28 group h-96">
                    <img
                        src={currentProject.image}
                        alt={currentProject.title}
                        className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                        data-aos="fade-right"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-70 transition-opacity duration-300"></div>
                </div>
            </div>
            <div>
                <div className="flex items-center mb-6">
                    <div className="h-px flex-grow bg-custom-brown"></div>
                    <div
                        className="flex text-min md:text-7xl lg:text-7xl sm:text-6xl px-4
                            font-custom-font-japon text-black max-sm:text-4xl"
                    >
                        <div data-aos="fade-up">
                            <span>Pro</span>
                        </div>
                        <div data-aos="fade-down">
                            <span>jets</span>
                        </div>
                    </div>
                    <div className="h-px flex-grow bg-custom-brown"></div>
                </div>
                <div className="max-sm:flex max-sm:justify-center max-sm:flex-wrap max-sm:mb-4">
                    {projects.map((project, index) => (
                        <button
                            key={project.id}
                            onClick={() => handleButtonClick(index)}
                            className={`border border-custom-brown rounded-full pr-2 pl-2 h-10 w-10 space-x-8
                                        mr-2 mb-3 transform transition duration-500 ease-in-out hover:scale-125
                                    ${
                                        currentProjectIndex === index
                                            ? "bg-custom-brown text-white"
                                            : ""
                                    }`}
                        >
                            {project.id}
                        </button>
                    ))}
                </div>
                <h2 className="text-red-700 font-bold text-3xl font-custom-font-madeinfinity mb-3 max-sm:text-2xl max-sm:text-center">
                    {currentProject.title}
                </h2>

                <div className="hidden max-sm:block max-sm:mb-5">
                    <img
                        src={currentProject.image}
                        alt={currentProject.title}
                        className="w-full h-64 object-cover object-center
                    rounded-2xl border-2 border-custom-brown"
                        data-aos="fade-right"
                    />
                </div>

                {showDescriptionAndStacks ? (
                    <>
                        <div
                            className="md:mt-10 sm:mt-10 flex flex-col justify-center items-center border-2
                            border-custom-brown rounded mr-10 mb-5 max-sm:mr-0 max-sm:mt-5"
                        >
                            <p
                                className="px-2 md:px-16 w-max font-black text-2xl max-sm:text-xl
                            -translate-y-5 bg-custom-gold text-red-700"
                            >
                                Description du projet
                            </p>
                            <p className="font-custom-font-madeinfinity mb-5 text-justify mr-10 list-disc pl-5 max-sm:mr-5 max-sm:pl-3 max-sm:pr-3 max-sm:text-sm">
                                {currentProject.description}
                            </p>
                        </div>

                        <div
                            className="md:mt-10 sm:mt-10 flex flex-col justify-center items-center border-2
                            border-custom-brown rounded mr-10 mb-5 max-sm:mr-0 max-sm:mt-5"
                        >
                            <p
                                className="mx-auto px-2 md:px-16 w-max font-black text-2xl max-sm:text-xl
                            -translate-y-5 bg-custom-gold text-red-700"
                            >
                                Stacks
                            </p>
                            <div className="flex flex-wrap justify-center">
                                {currentProject.stacks.map((stack, index) => (
                                    <div
                                        key={index}
                                        data-aos="fade-up"
                                        className="mb-2"
                                    >
                                        <div className="flex m-2 md:m-3">
                                            <img
                                                src={`/assets/logos/${stack}.png`}
                                                alt={stack}
                                                className="w-16 h-16 max-sm:w-12 max-sm:h-12"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div
                            className="md:mt-10 sm:mt-10 flex flex-col justify-center items-center border-2
                            border-custom-brown rounded mr-10 mb-5 max-sm:mr-0 max-sm:mt-5"
                        >
                            <p
                                className="mx-auto px-2 md:px-16 w-max font-black text-2xl max-sm:text-xl
                            -translate-y-5 bg-custom-gold text-red-700"
                            >
                                Compétences acquises
                            </p>
                            <ul className="mb-5 text-justify mr-5 list-disc pl-10 max-sm:pl-5 max-sm:pr-3 max-sm:text-sm">
                                {currentProject.competences.map(
                                    (competence, index) => (
                                        <li key={index}>{competence}</li>
                                    )
                                )}
                            </ul>
                        </div>
                        <div
                            className="md:mt-10 sm:mt-10 flex flex-col justify-center items-center border-2
                            border-custom-brown rounded mr-10 mb-5 max-sm:mr-0 max-sm:mt-5"
                        >
                            <p
                                className="mx-auto px-2 md:px-16 w-max font-black text-2xl max-sm:text-xl
                            -translate-y-5 bg-custom-gold text-red-700"
                            >
                                Réussite / Difficulté
                            </p>
                            <div className="flex flex-col pr-24 max-sm:pr-3">
                                <div className="mb-4">
                                    <h3 className="font-custom-font-madeinfinity mb-2 text-lg max-sm:text-base max-sm:pl-3">
                                        Réussites :
                                    </h3>
                                    <ul className="list-disc pl-10 max-sm:pl-8 max-sm:pr-3 max-sm:text-sm">
                                        {currentProject.reussites.map(
                                            (reussite, index) => (
                                                <li key={index}>{reussite}</li>
                                            )
                                        )}
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="font-custom-font-madeinfinity mb-2 text-lg max-sm:text-base max-sm:pl-3">
                                        Difficultés :
                                    </h3>
                                    <ul className="list-disc pl-10 mb-5 max-sm:pl-8 max-sm:pr-3 max-sm:text-sm">
                                        {currentProject.difficultes.map(
                                            (difficulte, index) => (
                                                <li key={index}>
                                                    {difficulte}
                                                </li>
                                            )
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </>
                )}
                <div className="flex max-sm:flex-col max-sm:items-center">
                    <button
                        onClick={() =>
                            window.open(currentProject.githubLink, "_blank")
                        }
                        className="border-2 border-custom-brown text-base md:text-xl mr-5 cursor-pointer flex
                        items-center bg-custom-gold hover:bg-custom-brown hover:text-white hover:shadow-lg
                        transition-all duration-500 rounded-lg md:px-4 md:py-2 px-2 shadow max-sm:mb-3 max-sm:mr-0 max-sm:text-sm max-sm:justify-center max-sm:w-full"
                    >
                        Voir le code source
                    </button>
                    <button
                        onClick={toggleView}
                        className="border-2 border-custom-brown text-base md:text-xl mr-5 cursor-pointer flex
                        items-center bg-custom-gold hover:bg-custom-brown hover:text-white hover:shadow-lg
                        transition-all duration-500 rounded-lg md:px-4 md:py-2 px-2 shadow max-sm:mr-0 max-sm:text-xs max-sm:text-center max-sm:p-2"
                    >
                        {showDescriptionAndStacks
                            ? "Voir les compétences acquises + les réussites et difficultés"
                            : "Voir la description du projet + les stacks utilisés"}
                    </button>
                </div>
                <div className="mt-4">
                    <div className="w-full bg-custom-gold rounded-full h-1.5">
                        <div
                            className="bg-custom-brown h-1.5 rounded-full transition-width duration-300 ease-in-out"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Projects
