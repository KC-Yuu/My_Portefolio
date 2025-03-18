import React from "react";
import "aos/dist/aos.css";

function AboutMe() {
    return (
        <div id="about" className="min-h-screen mb-8">
            <div className="opacity-80">
                <div
                    style={{
                        backgroundImage: `url(/assets/file.png)`,
                        backgroundSize: "cover",
                    }}
                    className="w-full h-full absolute z-0"
                    data-aos="fade-right"
                    data-aos-delay="500"
                ></div>
            </div>
            <div className="flex items-center justify-center min-h-screen pt-20 pb-10 max-sm:pt-24">
                <div className="flex flex-col items-center justify-center px-4 w-full mx-auto">
                    <div className="flex w-full items-center flex-wrap justify-center mb-24 relative max-sm:mb-2">
                        <div
                            className="bg-custom-black bg-opacity-80 rounded-2xl border-2 border-custom-brown md:mb-5
                            sm:mb-5 max-sm:mb-5 max-sm:w-full max-sm:flex max-sm:justify-center md:mr-8 lg:mr-12"
                            data-aos="zoom-in"
                        >
                            <img
                                src="/assets/profil-pic-without-bg.png"
                                alt="Profile pic"
                                className="relative max-h-80 max-w-80 sm:w-52 sm:h-52 md:w-64 md:h-64 lg:w-64 lg:h-64
                                max-sm:w-40 max-sm:h-40 object-cover"
                            />
                        </div>
                        <div
                            className="bg-custom-black bg-opacity-80 rounded-2xl border-2 border-custom-brown
                            md:justify-center md:items-center p-2 max-sm:mt-8 max-sm:w-full"
                        >
                            <div className="flex items-center mb-5">
                                <div className="h-px flex-grow bg-custom-brown"></div>
                                <div
                                    className="flex text-min md:text-7xl lg:text-7xl sm:text-6xl px-4
                                    font-custom-font-japon text-white max-sm:text-4xl"
                                >
                                    <div
                                        className="mr-5 max-sm:mr-2"
                                        data-aos="fade-right"
                                    >
                                        <span>A</span>
                                    </div>
                                    <div
                                        className="mr-5 max-sm:mr-2"
                                        data-aos="fade-down"
                                    >
                                        <span>propos</span>
                                    </div>
                                    <div data-aos="fade-up">
                                        <span>de moi</span>
                                    </div>
                                </div>
                                <div className="h-px flex-grow bg-custom-brown"></div>
                            </div>
                            <div
                                className="text-lg text-center text-white md:text-xl lg:text-2xl max-w-4xl p-12
                                font-custom-font-madeinfinity sm:p-4 max-sm:p-5 max-sm:text-sm mx-auto"
                            >
                                <p>
                                    Après de 3 années dans la Gendarmerie
                                    Nationale, j'ai décidé de donner un nouveau
                                    souffle à ma vie et d'oser vivre mon rêve de
                                    devenir Développeur Web.
                                </p>
                                <br />
                                <p>
                                    Actuellement en formation à la Web@académie
                                    by Epitech de Lille afin d'y préparer et
                                    obtenir mon titre RNCP de niveau 5
                                    "Développeur Web" en 2 ans.
                                </p>
                                <br />
                                <p>
                                    Passionné avant tout, je réalise de nombreux
                                    projets à travers mon année au sein de la
                                    Web@académie pour monter en compétences, et
                                    découvrir de nouveaux outils, mais soyons
                                    honnête... pour m'amuser aussi !
                                </p>
                                <br />
                                <p>
                                    Je suis actuellement en alternance chez
                                    Hop3Team pour ma deuxième année de
                                    formation, depuis septembre 2024.
                                </p>
                                <br />
                                <div
                                    data-aos="flip-down"
                                    className="flex justify-center mt-4"
                                >
                                    <a
                                        href="/cv/CV%20-%20CARON_Maxime.pdf"
                                        download
                                        className="bg-custom-gold text-black font-bold rounded-lg px-6 py-3
                                        transform transition duration-200 ease-in-out hover:scale-110
                                        shadow-md max-sm:text-xs max-sm:px-6 max-sm:py-3"
                                    >
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
