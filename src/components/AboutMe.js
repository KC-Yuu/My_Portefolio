import React from "react";
import "aos/dist/aos.css";

function AboutMe() {

    return (
        <div id="about" className="h-screen mb-16">
            <div className="opacity-80">
                <div style={{
                    backgroundImage: `url(/assets/file.png)`,
                    backgroundSize: 'cover',
                }}
                     className="w-full h-full absolute z-0" data-aos="fade-right" data-aos-delay="500">
                </div>
            </div>
            <div className="flex items-center justify-center h-screen">
                <div className="flex flex-col items-center justify-center md:mr-20 sm:mr-20">
                    <div className="flex w-full items-center flex-wrap justify-center space-x-20 mb-24 relative">
                        <div className="bg-custom-black bg-opacity-80 rounded-2xl border-2 border-custom-brown md:mb-5
                          sm:mb-5 sm:ml-20"
                             data-aos="zoom-in">
                            <img src="/assets/profil-pic-without-bg.png" alt="Profile pic"
                                 className="relative max-h-80 max-w-80 sm:w-52 sm:h-52 md:w-64 md:h-64 lg:w-64 lg:h-64
                                 object-cover"/>
                        </div>
                        <div className="bg-custom-black bg-opacity-80 rounded-2xl border-2 border-custom-brown
                        md:justify-center md:items-center p-2">
                            <div className="flex justify-center text-min md:text-7xl lg:text-7xl sm:text-6xl lg:mb-5
                                font-custom-font-japon text-white">
                                <div className="mr-5" data-aos="fade-right">
                                    <span>A</span>
                                </div>
                                <div className="mr-5" data-aos="fade-down">
                                    <span>propos</span>
                                </div>
                                <div data-aos="fade-up">
                                    <span>de moi</span>
                                </div>
                            </div>
                            <div
                                className="text-lg text-center text-white md:text-xl lg:text-2xl max-w-4xl p-12
                                font-custom-font-madeinfinity sm:p-1">
                                <p>
                                    Après de 3 années dans la Gendarmerie Nationale, j’ai décidé de donner un nouveau
                                    souffle à ma vie et d’oser vivre mon rêve de devenir Développeur Web.
                                </p>
                                <br/>
                                <p>
                                    Actuellement en formation à la Web@académie by Epitech de Lille afin d'y préparer et
                                    obtenir mon titre RNCP de niveau 5 "Développeur Web" en 2 ans.
                                </p>
                                <br/>
                                <p>
                                    Passionné avant tout, je réalise de nombreux projets à travers mon année au sein de
                                    la Web@académie pour monter en compétences, et découvrir de nouveaux outils, mais
                                    soyons honnête... pour m'amuser aussi !
                                </p>
                                <br/>
                                <p>
                                    Je suis actuellement à la recherche d'une alternance pour ma deuxième année de
                                    formation, à partir de septembre 2024.
                                </p>
                                <br/>
                                <div data-aos="flip-down">
                                    <a href="/cv/CV%20-%20CARON_Maxime.pdf" download
                                       className="bg-custom-gold text-black rounded-lg px-4 py-2 mt-4 inline-block
                                       sm:mb-2 md:mt-2 md:mb-2 lg:mt-2 lg:mb-2 transform transition duration-200
                                       ease-in-out hover:scale-110">
                                        Télécharger mon CV
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AboutMe;