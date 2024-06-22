import React, {useState} from 'react';
import 'aos/dist/aos.css';
import {projects} from "../data/projetData";

function Projects() {
    const [currentProject, setCurrentProject] = useState(projects[0]);
    const [showDescriptionAndStacks, setShowDescriptionAndStacks] = useState(true);

    const handleButtonClick = (project) => {
        setCurrentProject(project);
        setShowDescriptionAndStacks(true); // Reset to description and stacks when switching projects
    };

    const toggleView = () => {
        setShowDescriptionAndStacks(!showDescriptionAndStacks);
    };

    return (
        <div id="projects" className="mx-auto mt-44 mb-44 grid grid-cols-2 gap-20">
            <div>
                <img src={currentProject.image} alt={currentProject.title} className="w-200 h-200 ml-10
                rounded-2xl border-2 border-custom-brown mt-28" data-aos="fade-right"/>
            </div>
            <div>
                <div className="flex text-min md:text-7xl lg:text-7xl sm:text-6xl lg:mb-3
                            font-custom-font-japon text-black">
                    <div data-aos="fade-up">
                        <span>Pro</span>
                    </div>
                    <div data-aos="fade-down">
                        <span>jets</span>
                    </div>
                </div>
                <div>
                    {projects.map(project => (
                        <button key={project.id} onClick={() => handleButtonClick(project)}
                                className={`border border-custom-brown rounded-full pr-2 pl-2 h-10 w-10 space-x-8
                                mr-2 mb-3 transform transition duration-500 ease-in-out hover:scale-125 
                            ${currentProject.id === project.id ? 'bg-custom-brown text-white' : ''}`}>
                            {project.id}
                        </button>
                    ))}
                </div>
                <h2 className="text-red-700 font-bold text-3xl font-custom-font-madeinfinity mb-3">
                    {currentProject.title}
                </h2>
                {showDescriptionAndStacks ? (
                    <>
                        <div className="md:mt-10 sm:mt-10 flex flex-col justify-center items-center border-2
                            border-custom-brown rounded mr-10 mb-5">
                            <p className="px-2 md:px-16 w-max font-black text-2xl
                            -translate-y-5 bg-custom-gold text-red-700">
                                Description du projet
                            </p>
                            <p className="font-custom-font-madeinfinity mb-5 text-justify mr-10 list-disc pl-5">
                                {currentProject.description}
                            </p>
                        </div>
                        <div className="md:mt-10 sm:mt-10 flex flex-col justify-center items-center border-2
                            border-custom-brown rounded mr-10 mb-5">
                            <p className="mx-auto px-2 md:px-16 w-max font-black text-2xl
                            -translate-y-5 bg-custom-gold text-red-700">
                                Stacks
                            </p>
                            <div className="flex">
                                {currentProject.stacks.map((stack, index) => (
                                    <div key={index} data-aos="fade-up" className="mb-2">
                                        <div className="flex m-2 md:m-3">
                                            <img src={`/assets/logos/${stack}.png`} alt={stack} className="w-16 h-16"/>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="md:mt-10 sm:mt-10 flex flex-col justify-center items-center border-2
                            border-custom-brown rounded mr-10 mb-5">
                            <p className="mx-auto px-2 md:px-16 w-max font-black text-2xl
                            -translate-y-5 bg-custom-gold text-red-700">
                                Compétences acquises
                            </p>
                            <ul className="mb-5 text-justify mr-5 list-disc pl-10">
                                {currentProject.competences.map((competence, index) => (
                                    <li key={index}>{competence}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="md:mt-10 sm:mt-10 flex flex-col justify-center items-center border-2
                            border-custom-brown rounded mr-10 mb-5">
                            <p className="mx-auto px-2 md:px-16 w-max font-black text-2xl
                            -translate-y-5 bg-custom-gold text-red-700">
                                Réussite / Difficulté
                            </p>
                            <div className="flex flex-col pr-24">
                                <div className="mb-4">
                                    <h3 className="font-custom-font-madeinfinity mb-2 text-lg">Réussites :</h3>
                                    <ul className="list-disc pl-10">
                                        {currentProject.reussites.map((reussite, index) => (
                                            <li key={index}>{reussite}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="font-custom-font-madeinfinity mb-2 text-lg">Difficultés :</h3>
                                    <ul className="list-disc pl-10 mb-5">
                                        {currentProject.difficultes.map((difficulte, index) => (
                                            <li key={index}>{difficulte}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </>
                )}
                <div className="flex">
                    <button onClick={() => window.open(currentProject.githubLink, "_blank")}
                            className="border-2 border-custom-brown text-base md:text-xl mr-5 cursor-pointer flex
                        items-center bg-custom-gold hover:bg-custom-brown hover:text-white hover:shadow-lg
                        transition-all duration-500 rounded-lg md:px-4 md:py-2 px-2 shadow">
                        Voir le code source
                    </button>
                    <button onClick={toggleView}
                            className="border-2 border-custom-brown text-base md:text-xl mr-5 cursor-pointer flex
                        items-center bg-custom-gold hover:bg-custom-brown hover:text-white hover:shadow-lg
                        transition-all duration-500 rounded-lg md:px-4 md:py-2 px-2 shadow">
                        {showDescriptionAndStacks ? 'Voir les compétences acquises + les réussites et difficultés ' +
                            'lors du projet' : 'Voir la description du projet + les stacks utilisés'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Projects;
