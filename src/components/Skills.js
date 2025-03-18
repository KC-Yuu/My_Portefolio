import React from "react";

function Skills() {
    return (
        <div
            id="skills"
            className="h-screen p-1 md:p-8 pl-0 md:mt-0 flex flex-col lg:w-6/12 max-sm:h-auto max-sm:mt-10 max-sm:mb-10"
        >
            <div className="lg:opacity-90 md:opacity-0 sm:opacity-0">
                <div
                    style={{
                        backgroundImage: `url(/assets/bg-competence.png)`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                    }}
                    className="flex w-full h-full absolute z-0 bg-cover bg-center hidden blur- md:block"
                    data-aos="fade-left"
                    data-aos-delay="500"
                ></div>
            </div>
            <div className="mx-auto px-4 z-0 max-sm:w-full">
                <div className="flex items-center mb-5">
                    <div className="h-px flex-grow bg-custom-brown"></div>
                    <div
                        className="flex text-min md:text-7xl lg:text-7xl sm:text-6xl px-4
                            font-custom-font-japon text-black max-sm:text-4xl"
                    >
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
                    <div className="h-px flex-grow bg-custom-brown"></div>
                </div>
                <p className="text-lg font-custom-font-madeinfinity max-sm:text-sm max-sm:text-center max-sm:mb-10">
                    J'aime créer des choses qui prennent forme à l'écran, que ce
                    soit sites Web, applications ou quoi que ce soit entre les
                    deux. J'adore voir mon imagination s'animer sous les clics,
                    autant que résoudre des casses-têtes exigeants. Voici la
                    liste des stacks et outils (pour le moment) avec lesquels
                    j'ai déjà travaillé :
                </p>
                <div className="md:mt-10 sm:mt-10 flex flex-col justify-center items-center max-sm:mt-5">
                    <div className="flex flex-col border-2 rounded-2xl border-custom-brown px-0 md:px-8 w-full backdrop-blur-sm bg-white/10">
                        <p
                            className="mx-auto px-2 md:px-16 w-max font-black text-2xl max-sm:text-xl
                    -translate-y-5 bg-custom-gold text-red-700"
                        >
                            Front-End
                        </p>
                        <div className="flex flex-wrap justify-center">
                            <div data-aos="fade-right" className="m-1 md:m-2">
                                <i
                                    className="devicon-html5-plain colored text-6xl max-sm:text-4xl"
                                    title="HTML5"
                                    aria-label="HTML5"
                                    role="img"
                                ></i>
                            </div>
                            <div data-aos="fade-up" className="m-1 md:m-2">
                                <i
                                    className="devicon-css3-plain colored text-6xl max-sm:text-4xl"
                                    title="CSS3"
                                    aria-label="CSS3"
                                    role="img"
                                ></i>
                            </div>
                            <div data-aos="fade-down" className="m-1 md:m-2">
                                <i
                                    className="devicon-javascript-plain colored text-6xl max-sm:text-4xl"
                                    title="JavaScript"
                                    aria-label="JavaScript"
                                    role="img"
                                ></i>
                            </div>
                            <div data-aos="fade-left" className="m-1 md:m-2">
                                <i
                                    className="devicon-react-original colored text-6xl max-sm:text-4xl"
                                    title="React"
                                    aria-label="React"
                                    role="img"
                                ></i>
                            </div>
                            <div data-aos="fade-down" className="m-1 md:m-2">
                                <i
                                    className="devicon-typescript-plain colored text-6xl max-sm:text-4xl"
                                    title="Typescript"
                                    aria-label="Typescript"
                                    role="img"
                                ></i>
                            </div>
                            <div data-aos="fade-down" className="m-1 md:m-2">
                                <i
                                    className="devicon-tailwindcss-plain colored text-6xl max-sm:text-4xl"
                                    title="Tailwind CSS"
                                    aria-label="Tailwind CSS"
                                    role="img"
                                ></i>
                            </div>
                            <div data-aos="fade-right" className="m-1 md:m-2">
                                <i
                                    className="devicon-bootstrap-plain colored text-6xl max-sm:text-4xl"
                                    title="Bootstrap"
                                    aria-label="Bootstrap"
                                    role="img"
                                ></i>
                            </div>
                        </div>
                    </div>
                    <div className="mt-12 flex flex-col border-2 rounded-2xl border-custom-brown px-0 md:px-8 w-full max-sm:mt-6 backdrop-blur-sm bg-white/10">
                        <p
                            className="mx-auto px-2 md:px-16 w-max font-black text-2xl max-sm:text-xl
                    -translate-y-5 bg-custom-gold text-red-700"
                        >
                            Back-End
                        </p>
                        <div className="flex flex-wrap justify-center">
                            <div data-aos="fade-right" className="m-1 md:m-2">
                                <i
                                    className="devicon-php-plain colored text-6xl max-sm:text-4xl"
                                    title="PHP"
                                    aria-label="PHP"
                                    role="img"
                                ></i>
                            </div>
                            <div data-aos="fade-down" className="m-1 md:m-2">
                                <i
                                    className="devicon-mysql-plain colored text-6xl max-sm:text-4xl"
                                    title="MySQL"
                                    aria-label="MySQL"
                                    role="img"
                                ></i>
                            </div>
                            <div data-aos="fade-left" className="m-1 md:m-2">
                                <i
                                    className="devicon-laravel-plain colored text-6xl max-sm:text-4xl"
                                    title="Laravel"
                                    aria-label="Laravel"
                                    role="img"
                                ></i>
                            </div>
                            <div data-aos="fade-down" className="m-1 md:m-2">
                                <i
                                    className="devicon-symfony-original colored text-6xl max-sm:text-4xl"
                                    title="Symfony"
                                    aria-label="Symfony"
                                    role="img"
                                ></i>
                            </div>
                            <div data-aos="fade-right" className="m-1 md:m-2">
                                <i
                                    className="devicon-nodejs-plain colored text-6xl max-sm:text-4xl"
                                    title="Node.js"
                                    aria-label="Node.js"
                                    role="img"
                                ></i>
                            </div>
                            <div data-aos="fade-up" className="m-1 md:m-2">
                                <i
                                    className="devicon-express-original colored text-6xl max-sm:text-4xl"
                                    title="Express.js"
                                    aria-label="Express.js"
                                    role="img"
                                ></i>
                            </div>
                            <div data-aos="fade-left" className="m-1 md:m-2">
                                <i
                                    className="devicon-mongodb-plain colored text-6xl max-sm:text-4xl"
                                    title="MongoDB"
                                    aria-label="MongoDB"
                                    role="img"
                                ></i>
                            </div>
                            <div data-aos="fade-right" className="m-1 md:m-2">
                                <i
                                    className="devicon-ruby-plain colored text-5xl max-sm:text-4xl"
                                    title="Ruby"
                                    aria-label="Ruby"
                                    role="img"
                                ></i>
                            </div>
                            <div data-aos="fade-right" className="m-1 md:m-2">
                                <i
                                    className="devicon-rails-plain colored text-6xl max-sm:text-4xl"
                                    title="Rails"
                                    aria-label="Rails"
                                    role="img"
                                ></i>
                            </div>
                            <div data-aos="fade-right" className="m-1 md:m-2">
                                <i
                                    className="devicon-postgresql-plain colored text-6xl max-sm:text-4xl"
                                    title="PostgreSQL"
                                    aria-label="PostgreSQL"
                                    role="img"
                                ></i>
                            </div>
                        </div>
                    </div>
                    <div className="mt-12 flex flex-col border-2 rounded-2xl border-custom-brown px-0 md:px-8 w-full max-sm:mt-6 max-sm:mb-10 backdrop-blur-sm bg-white/10">
                        <p
                            className="mx-auto px-2 md:px-16 w-max font-black text-2xl max-sm:text-xl
                    -translate-y-5 bg-custom-gold text-red-700"
                        >
                            Outils
                        </p>
                        <div className="flex flex-wrap justify-center">
                            <div data-aos="fade-down" className="m-1 md:m-2">
                                <i
                                    className="devicon-github-original colored text-6xl max-sm:text-4xl"
                                    title="GitHub"
                                    aria-label="GitHub"
                                    role="img"
                                ></i>
                            </div>
                            <div data-aos="fade-up" className="m-1 md:m-2">
                                <i
                                    className="devicon-docker-plain colored text-6xl max-sm:text-4xl"
                                    title="Docker"
                                    aria-label="Docker"
                                    role="img"
                                ></i>
                            </div>
                            <div data-aos="fade-right" className="m-1 md:m-2">
                                <i
                                    className="devicon-figma-plain colored text-6xl max-sm:text-4xl"
                                    title="Figma"
                                    aria-label="Figma"
                                    role="img"
                                ></i>
                            </div>
                            <div data-aos="fade-up" className="m-1 md:m-2">
                                <i
                                    className="devicon-postman-plain colored text-6xl max-sm:text-4xl"
                                    title="Postman"
                                    aria-label="Postman"
                                    role="img"
                                ></i>
                            </div>
                            <div data-aos="fade-down" className="m-1 md:m-2">
                                <i
                                    className="devicon-trello-plain colored text-6xl max-sm:text-4xl"
                                    title="Trello"
                                    aria-label="Trello"
                                    role="img"
                                ></i>
                            </div>
                            <div data-aos="fade-right" className="m-1 md:m-2">
                                <i
                                    className="devicon-jira-plain colored text-6xl max-sm:text-4xl"
                                    title="Jira"
                                    aria-label="Jira"
                                    role="img"
                                ></i>
                            </div>
                            <div data-aos="fade-left" className="m-1 md:m-2">
                                <i
                                    className="devicon-intellij-plain colored text-6xl max-sm:text-4xl"
                                    title="IntelliJ IDEA"
                                    aria-label="IntelliJ IDEA"
                                    role="img"
                                ></i>
                            </div>
                            <div data-aos="fade-down" className="m-1 md:m-2">
                                <i
                                    className="devicon-vscode-plain colored text-6xl max-sm:text-4xl"
                                    title="Visual Studio Code"
                                    aria-label="Visual Studio Code"
                                    role="img"
                                ></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Skills;
