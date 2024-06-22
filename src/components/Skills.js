import React from 'react';

function Skills() {
    return (
        <div id="skills" className="h-screen p-1 md:p-10 pl-0 md:mt-0 flex flex-col lg:w-7/12">
            <div className="lg:opacity-90 md:opacity-0 sm:opacity-0">
                <div style={{
                    backgroundImage: `url(/assets/bg-competence.png)`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right',
                }}
                    className="flex w-full h-full lg:bg-72 absolute z-0" data-aos="fade-left" data-aos-delay="500">
                </div>
            </div>
            <div className=" mx-auto px-4 z-0">
                <div className="flex text-min md:text-7xl lg:text-7xl sm:text-6xl lg:mb-7
                font-custom-font-japon text-black">
                    <div data-aos="fade-right">
                        <span>Com</span>
                    </div>
                    <div data-aos="fade-down">
                        <span>petence</span>
                    </div>
                    <div data-aos="fade-up">
                        <span>s</span>
                    </div>
                </div>
                <p className="text-lg font-custom-font-madeinfinity">
                    J'aime créer des choses qui prennent forme à l'écran, que ce soit sites Web,
                    applications ou quoi que ce soit entre les deux.
                    J'adore voir mon imagination s'animer sous les clics, autant que résoudre des
                    casses-têtes exigeants.
                    Voici la liste des stacks et outils (pour le moment) avec lesquels j'ai déjà travaillé :
                </p>
                <div className="md:mt-10 sm:mt-10 flex flex-col justify-center items-center">
                    <div className="flex flex-col border-2 rounded-2xl border-custom-brown px-0 md:px-8">
                        <p className="mx-auto px-2 md:px-16 w-max  font-black text-2xl
                    -translate-y-5 bg-custom-gold text-red-700">
                            Front-End
                        </p>
                        <div className="flex">
                            <div data-aos="fade-right">
                                <div className="m-2 md:m-3">
                                    <img src="/assets/logos/HTML.png" alt="HTML5" className="w-16 h-16"/>
                                </div>
                            </div>
                            <div data-aos="fade-up">
                                <div className="m-2 md:m-3">
                                    <img src="/assets/logos/CSS.png" alt="CSS3" className="w-16 h-16"/>
                                </div>
                            </div>
                            <div data-aos="fade-down">
                                <div className="m-2 md:m-3">
                                    <img src="/assets/logos/JS.png" alt="JavaScript" className="w-16 h-16"/>
                                </div>
                            </div>
                            <div data-aos="fade-left">
                                <div className="m-2 md:m-3">
                                    <img src="/assets/logos/REACT.png" alt="React" className="w-16 h-16"/>
                                </div>
                            </div>
                            <div data-aos="fade-down">
                                <div className="m-2 md:m-3">
                                    <img src="/assets/logos/TAILWINDS.png" alt="Tailwinds" className="w-16 h-16"/>
                                </div>
                            </div>
                            <div data-aos="fade-right">
                                <div className="m-2 md:m-3">
                                    <img src="/assets/logos/BOOSTRAP.png" alt="Boostrap" className="w-16 h-16"/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-12 flex flex-col border-2 rounded-2xl border-custom-brown px-0 md:px-8">
                        <p className="mx-auto px-2 md:px-16 w-max  font-black text-2xl
                    -translate-y-5 bg-custom-gold text-red-700">
                            Back-End
                        </p>
                        <div className="flex">
                            <div data-aos="fade-right">
                                <div className="m-2 md:m-3">
                                    <img src="/assets/logos/PHP.png" alt="HTML5" className="w-16 h-16"/>
                                </div>
                            </div>
                            <div data-aos="fade-down">
                                <div className="m-2 md:m-3">
                                    <img src="/assets/logos/MYSQL.png" alt="MySQL" className="w-16 h-16"/>
                                </div>
                            </div>
                            <div data-aos="fade-left">
                                <div className="m-2 md:m-3">
                                    <img src="/assets/logos/LARAVEL.png" alt="Laravel" className="w-16 h-16"/>
                                </div>
                            </div>
                            <div data-aos="fade-down">
                                <div className="m-2 md:m-3">
                                    <img src="/assets/logos/SYMFONY.png" alt="Symfony" className="w-16 h-16"/>
                                </div>
                            </div>
                            <div data-aos="fade-right">
                                <div className="m-2 md:m-3">
                                    <img src="/assets/logos/NODE.png" alt="NodeJS" className="w-16 h-16"/>
                                </div>
                            </div>
                            <div data-aos="fade-up">
                                <div className="m-2 md:m-3">
                                    <img src="/assets/logos/EXPRESS.png" alt="Express" className="w-16 h-16"/>
                                </div>
                            </div>
                            <div data-aos="fade-left">
                                <div className="m-2 md:m-3">
                                    <img src="/assets/logos/MONGODB.png" alt="MongoDB" className="w-16 h-16"/>
                                </div>
                            </div>
                            <div data-aos="fade-down">
                                <div className="m-2 md:m-3">
                                    <img src="/assets/logos/API.png" alt="Api" className="w-16 h-16"/>
                                </div>
                            </div>
                            <div data-aos="fade-right">
                                <div className="m-2 md:m-3">
                                    <img src="/assets/logos/DOCKER.png" alt="Docker" className="w-16 h-16"/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-12 flex flex-col border-2 rounded-2xl border-custom-brown px-0 md:px-8">
                        <p className="mx-auto px-2 md:px-16 w-max  font-black text-2xl
                    -translate-y-5 bg-custom-gold text-red-700">
                        Outils
                        </p>
                        <div className="flex">
                            <div data-aos="fade-down">
                                <div className="m-2 md:m-3">
                                    <img src="/assets/logos/GITHUB.png" alt="Github" className="w-16 h-16"/>
                                </div>
                            </div>
                            <div data-aos="fade-right">
                                <div className="m-2 md:m-3">
                                    <img src="/assets/logos/FIGMA.png" alt="Figma" className="w-16 h-16"/>
                                </div>
                            </div>
                            <div data-aos="fade-up">
                                <div className="m-2 md:m-3">
                                    <img src="/assets/logos/POSTMAN.png" alt="Postman" className="w-16 h-16"/>
                                </div>
                            </div>
                            <div data-aos="fade-down">
                                <div className="m-2 md:m-3">
                                    <img src="/assets/logos/TRELLO.png" alt="Trello" className="w-16 h-16"/>
                                </div>
                            </div>
                            <div data-aos="fade-left">
                                <div className="m-2 md:m-3">
                                    <img src="/assets/logos/INTELLIJ.png" alt="IntelliJ" className="w-16 h-16"/>
                                </div>
                            </div>
                            <div data-aos="fade-down">
                                <div className="m-2 md:m-3">
                                    <img src="/assets/logos/VSCODE.png" alt="VsCode" className="w-16 h-16"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Skills;