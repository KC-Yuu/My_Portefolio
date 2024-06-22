import React from 'react';

function Footer() {
    return (
        <footer className="fixed bottom-0 w-full" style={{zIndex: 2}}>
            <img src="/assets/vague-japonaise.png" alt="bannière footer" className="w-full relative wave-animation"/>
            <div className="border-12 border-custom-brown"></div>
        </footer>
    );
}

export default Footer;