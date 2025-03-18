import React from "react"

function Footer() {
    return (
        <footer
            className="fixed bottom-0 w-full hidden sm:block"
            style={{ zIndex: 10 }}
        >
            <img
                src="/assets/vague-japonaise.png"
                alt="bannière footer"
                className="w-full relative wave-animation max-h-24 sm:max-h-full object-cover"
            />
            <div className="border-12 border-custom-brown max-sm:border-6"></div>
        </footer>
    )
}

export default Footer
