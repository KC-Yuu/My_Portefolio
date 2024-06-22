import React, {useEffect} from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Header from './Header';
import AboutMe from "./AboutMe";
import Skills from "./Skills";
import Projects from "./Projects";
import Contact from "./Contact";
import PreFooter from "./PreFooter";
import Footer from './Footer';

function Layout(props) {
    useEffect(() => {
        const timer = setTimeout(() => {
            document?.getElementsByClassName('custom-hidden')[0]?.classList?.remove('custom-hidden');
            AOS.init({duration: 2000});
        }, 2800);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div>
            <Header/>
            <div className="custom-hidden">
                <AboutMe/>
                <Skills/>
                <Projects/>
                <Contact/>
                <PreFooter/>
                {props.children}
            </div>
            <Footer/>
        </div>
    );
}

export default Layout;