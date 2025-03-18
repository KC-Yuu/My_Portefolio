import React from "react"
import Layout from "./components/Layout"
import "./App.css"

function App() {
    React.useEffect(() => {
        document.body.style.overflowX = "hidden"
        document.documentElement.style.overflowX = "hidden"
        
        const meta = document.createElement('meta')
        meta.name = 'viewport'
        meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
        document.getElementsByTagName('head')[0].appendChild(meta);
        
        document.body.style.touchAction = 'manipulation'
    }, [])

    return (
        <div className="overflow-x-hidden w-full">
            <Layout></Layout>
        </div>
    )
}

export default App
