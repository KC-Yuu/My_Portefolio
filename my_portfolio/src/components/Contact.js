import React, {useState} from 'react';
import emailjs from 'emailjs-com';

function ContactForm() {
    const [formData, setFormData] = useState({
        from_name: '',
        to_name: 'Maxime',
        email: '',
        message: ''
    });

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        emailjs.send('service_9mr1hak', 'template_7g4p7m8', formData, 'PHlRp6N7r9css7qXE')
            .then((result) => {
                console.log(result.text);
                alert('Message envoyé !');
                setFormData({
                    from_name: '',
                    to_name: 'Maxime',
                    email: '',
                    message: ''
                });
            }, (error) => {
                console.log(error.text);
                alert('Erreur lors de l\'envoi du message.');
            });
    };

    return (

        <div id="contact" style={{position: 'relative', zIndex: 1}}>
            <div className="border-12 border-custom-black"></div>
            <img src="/assets/bg-contact.jpg"
                 alt="Contact" className="w-full h-[500px] object-cover opacity-80"/>
            <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}
                 className="z-20 border-2 border-custom-brown rounded p-5 w-1/4 bg-custom-black">
                <h2 className="text-6xl font-bold mb-5 font-custom-font-japon text-white">Contactez-moi</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-white text-sm font-bold mb-2 " htmlFor="from_name">
                            Nom
                        </label>
                        <input
                            type="text"
                            id="from_name"
                            name="from_name"
                            value={formData.from_name}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full max-w-md py-2 px-3 text-gray-700
                        leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-white text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full max-w-md py-2 px-3 text-gray-700
                        leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-white text-sm font-bold mb-2" htmlFor="message">
                            Message
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full max-w-md py-2 px-3 text-gray-700
                        leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="border-2 border-custom-brown text-base md:text-xl mr-5 cursor-pointer flex
                        items-center bg-custom-gold hover:bg-custom-brown hover:text-white hover:shadow-lg
                        transition-all duration-500 rounded-lg md:px-4 md:py-2 px-2 shadow"
                        >
                            Envoyer
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ContactForm;