import React, { useState } from "react"
import emailjs from "emailjs-com"
import RichTextArea from "./RichTextArea"

function ContactForm() {
    const [formData, setFormData] = useState({
        from_name: "",
        to_name: "Maxime",
        email: "",
        subject: "",
        phone: "",
        message: "",
    })
    
    const [focusedField, setFocusedField] = useState(null)
    const [formSubmitted, setFormSubmitted] = useState(false)
    const [submitStatus, setSubmitStatus] = useState(null)
    const [validationErrors, setValidationErrors] = useState({
        email: false,
        phone: false
    })

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    const phoneRegex = /^(\+?\d{1,4}[-.\s]?)?(\(?\d{1,}\)?[-.\s]?)?\d{1,}([-.\s]?\d{1,})*$/

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value,
        })
        
        if (name === 'email') {
            setValidationErrors({
                ...validationErrors,
                email: value !== "" && !emailRegex.test(value)
            })
        } else if (name === 'phone') {
            setValidationErrors({
                ...validationErrors,
                phone: value !== "" && !phoneRegex.test(value)
            })
        }
    }

    const handleFocus = (fieldName) => {
        setFocusedField(fieldName)
    }

    const handleBlur = () => {
        setFocusedField(null)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        
        const emailValid = formData.email === "" || emailRegex.test(formData.email)
        const phoneValid = formData.phone === "" || phoneRegex.test(formData.phone)
        
        setValidationErrors({
            email: !emailValid,
            phone: !phoneValid
        })
        
        if (emailValid && phoneValid) {
            setFormSubmitted(true)
            setSubmitStatus('sending')

            const emailData = {
                ...formData,
                subject: formData.subject || "Nouveau message du portfolio",
                phone: formData.phone || "Non renseigné"
            }

            emailjs
                .send(
                    "service_u5d5gb8",
                    "template_8e341qj",
                    emailData,
                    "M8zuyHM1ESxXR59NR"
                )
                .then(
                    (result) => {
                        console.log(result.text)
                        setSubmitStatus('success')
                        setTimeout(() => {
                            setFormSubmitted(false)
                            setSubmitStatus(null)
                        }, 3000)
                        setFormData({
                            from_name: "",
                            to_name: "Maxime",
                            email: "",
                            subject: "",
                            phone: "",
                            message: "",
                        })
                    },
                    (error) => {
                        console.log(error.text)
                        setSubmitStatus('error')
                        setTimeout(() => {
                            setFormSubmitted(false)
                            setSubmitStatus(null)
                        }, 3000)
                    }
                )
        }
    }

    return (
        <div id="contact" className="relative w-full" style={{ zIndex: 1 }}>
            <div className="border-12 border-custom-black"></div>
            <div 
                className="w-full py-16 bg-cover bg-center bg-no-repeat relative"
                style={{ 
                    backgroundImage: "url('/assets/bg-contact.jpg')",
                    backgroundSize: "cover",
                    position: "relative"
                }}
            >
                <div className="absolute inset-0 bg-black opacity-60"></div>
                
                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex items-center mb-8 max-sm:mb-4">
                        <div className="h-px flex-grow bg-custom-brown"></div>
                        <div
                            className="flex text-3xl md:text-4xl lg:text-5xl max-sm:text-2xl px-4
                            font-custom-font-japon text-white"
                        >
                            <div data-aos="fade-right">
                                <span>Con</span>
                            </div>
                            <div data-aos="fade-down">
                                <span>tact</span>
                            </div>
                            <div data-aos="fade-up">
                                <span>ez-moi</span>
                            </div>
                        </div>
                        <div className="h-px flex-grow bg-custom-brown"></div>
                    </div>
                    
                    <div className="max-w-6xl mx-auto bg-custom-black bg-opacity-80 p-6 rounded-lg border-2 border-custom-brown">
                        <form
                            onSubmit={handleSubmit}
                            className="grid grid-cols-1 md:grid-cols-2 gap-6"
                        >
                            <div className="relative">
                                <label
                                    className={`block text-white text-sm font-bold mb-2 transition-all duration-300 ${
                                        focusedField === 'from_name' ? 'text-custom-gold' : ''
                                    }`}
                                    htmlFor="from_name"
                                >
                                    Votre Nom :
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        id="from_name"
                                        name="from_name"
                                        value={formData.from_name}
                                        onChange={handleChange}
                                        onFocus={() => handleFocus('from_name')}
                                        onBlur={handleBlur}
                                        className={`shadow appearance-none border-2 rounded w-full py-3 px-4 max-sm:py-2 max-sm:px-3 text-gray-700
                                        leading-tight focus:outline-none focus:shadow-outline transition-all duration-300 ${
                                            focusedField === 'from_name' ? 'border-custom-gold bg-gray-100' : 'border-gray-300'
                                        }`}
                                        required
                                    />
                                    <div className={`absolute -bottom-1 left-0 right-0 h-1 bg-custom-gold rounded-b-md transform transition-all duration-300 ${
                                        focusedField === 'from_name' ? 'scale-x-100' : 'scale-x-0'
                                    }`}></div>
                                </div>
                            </div>
                            
                            <div className="relative">
                                <label
                                    className={`block text-white text-sm font-bold mb-2 transition-all duration-300 ${
                                        focusedField === 'email' ? 'text-custom-gold' : ''
                                    }`}
                                    htmlFor="email"
                                >
                                    Votre Email :
                                </label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        onFocus={() => handleFocus('email')}
                                        onBlur={handleBlur}
                                        className={`shadow appearance-none border-2 rounded w-full py-3 px-4 max-sm:py-2 max-sm:px-3 text-gray-700
                                        leading-tight focus:outline-none focus:shadow-outline transition-all duration-300 ${
                                            focusedField === 'email' ? 'border-custom-gold bg-gray-100' : 'border-gray-300'
                                        } ${
                                            validationErrors.email ? 'border-red-500' : ''
                                        }`}
                                        required
                                    />
                                    <div className={`absolute -bottom-1 left-0 right-0 h-1 bg-custom-gold rounded-b-md transform transition-all duration-300 ${
                                        focusedField === 'email' ? 'scale-x-100' : 'scale-x-0'
                                    }`}></div>
                                    {validationErrors.email && (
                                        <p className="text-red-500 text-xs italic mt-1">Veuillez entrer une adresse email valide.</p>
                                    )}
                                </div>
                            </div>
                            
                            <div className="relative">
                                <label
                                    className={`block text-white text-sm font-bold mb-2 transition-all duration-300 ${
                                        focusedField === 'phone' ? 'text-custom-gold' : ''
                                    }`}
                                    htmlFor="phone"
                                >
                                    Votre Téléphone (optionnel) :
                                </label>
                                <div className="relative">
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        onFocus={() => handleFocus('phone')}
                                        onBlur={handleBlur}
                                        className={`shadow appearance-none border-2 rounded w-full py-3 px-4 max-sm:py-2 max-sm:px-3 text-gray-700
                                        leading-tight focus:outline-none focus:shadow-outline transition-all duration-300 ${
                                            focusedField === 'phone' ? 'border-custom-gold bg-gray-100' : 'border-gray-300'
                                        } ${
                                            validationErrors.phone ? 'border-red-500' : ''
                                        }`}
                                    />
                                    <div className={`absolute -bottom-1 left-0 right-0 h-1 bg-custom-gold rounded-b-md transform transition-all duration-300 ${
                                        focusedField === 'phone' ? 'scale-x-100' : 'scale-x-0'
                                    }`}></div>
                                    {validationErrors.phone && (
                                        <p className="text-red-500 text-xs italic mt-1">Veuillez entrer un numéro de téléphone valide.</p>
                                    )}
                                </div>
                            </div>
                            
                            <div className="relative md:col-span-2">
                                <label
                                    className={`block text-white text-sm font-bold mb-2 transition-all duration-300 ${
                                        focusedField === 'subject' ? 'text-custom-gold' : ''
                                    }`}
                                    htmlFor="subject"
                                >
                                    Objet :
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        onFocus={() => handleFocus('subject')}
                                        onBlur={handleBlur}
                                        className={`shadow appearance-none border-2 rounded w-full py-3 px-4 max-sm:py-2 max-sm:px-3 text-gray-700
                                        leading-tight focus:outline-none focus:shadow-outline transition-all duration-300 ${
                                            focusedField === 'subject' ? 'border-custom-gold bg-gray-100' : 'border-gray-300'
                                        }`}
                                    />
                                    <div className={`absolute -bottom-1 left-0 right-0 h-1 bg-custom-gold rounded-b-md transform transition-all duration-300 ${
                                        focusedField === 'subject' ? 'scale-x-100' : 'scale-x-0'
                                    }`}></div>
                                </div>
                            </div>
                            
                            <div className="relative md:col-span-2">
                                <label
                                    className={`block text-white text-sm font-bold mb-2 transition-all duration-300 ${
                                        focusedField === 'message' ? 'text-custom-gold' : ''
                                    }`}
                                    htmlFor="message"
                                >
                                    Message :
                                </label>
                                <RichTextArea 
                                    value={formData.message}
                                    onChange={handleChange}
                                    onFocus={() => handleFocus('message')}
                                    onBlur={handleBlur}
                                    isFocused={focusedField === 'message'}
                                    required={true}
                                />
                            </div>
                            
                            <div className="flex items-center justify-center mt-6 md:col-span-2">
                                <button
                                    type="submit"
                                    className={`bg-custom-brown hover:bg-custom-gold text-white font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline transition-all duration-300 ${
                                        formSubmitted ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                    disabled={formSubmitted}
                                >
                                    {formSubmitted ? (
                                        submitStatus === 'sending' ? (
                                            <span className="flex items-center">
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Envoi en cours...
                                            </span>
                                        ) : submitStatus === 'success' ? (
                                            <span className="flex items-center">
                                                <svg className="-ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                Message envoyé !
                                            </span>
                                        ) : (
                                            <span className="flex items-center">
                                                <svg className="-ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                                Erreur d'envoi
                                            </span>
                                        )
                                    ) : (
                                        'Envoyer'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ContactForm



