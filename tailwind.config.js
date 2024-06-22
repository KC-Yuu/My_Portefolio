/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{html,js}"],
    theme: {
        extend: {
            borderWidth: {
                10: "10px",
                12: "12px",
                20: "20px",
                22: "22px",
                25: "25px",
                30: "30px",
            },
            borderColor: {
                "custom-brown": "#756861",
                "custom-black": "#1E1E24",
                "custom-beige": "#FFF9F2",
                "custom-gold": "#FEFBEC",
            },
            backgroundColor: {
                "custom-beige": "#FFF9F2",
                "custom-black": "#1E1E24",
                "custom-gold": "#FEFBEC",
                "custom-brown": "#756861",
            },
            opacity: {
                "0": "0",
            },
            backgroundSize: {
                "72": "72%",
                "75": "75%",
                "85": "85%",
                "95": "95%",
                "auto": "auto",
            },
            fontFamily: {
                "custom-font-japon": ["'Japon-Font'", "sans-serif"],
                "custom-font-madeinfinity": ["'MADEINFINITY-Font'", "sans-serif"],
            },
            left: {
                80: "80%",
            },
            blur: {
                'leger': '2px',
            },
            fontSize: {
                "min": "1.25rem",
            },
            width: {
                17: "4.25rem",
            },
        }
    },
    variants: {
        extend: {
            opacity: ['responsive']
        }
    },
}