import React from 'react'
import './Contact.css'
import msg_icon from '../assets/edusity_assets/msg-icon.png'
import mail_icon from '../assets/edusity_assets/mail-icon.png'
import phone_icon from '../assets/edusity_assets/phone-icon.png'
import white_arrow from '../assets/edusity_assets/white-arrow.png'

function Contact() {
  const [result, setResult] = React.useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    setResult("Sending....");
    const formData = new FormData(event.target);

    formData.append("access_key", "b9ac6fda-f18d-4c76-b852-2d88fe61bf46");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (data.success) {
      setResult("Form Submitted Successfully");
      event.target.reset();
    } else {
      console.log("Error", data);
      setResult(data.message);
    }
  };
  return (
    <div className='contact'>
      <div className="contact-col">
        <h3>Send us message <img src={msg_icon} alt="" /></h3>
        <p>Feel free to reach out through contact form</p>
        <ul className='l'>
          <li> <img src={mail_icon} alt="" />Contact@Abinash.dev</li>
          <li> <img src={phone_icon} alt="" />+1 123-456-7890</li>

        </ul>
      </div>
      <div className="contact-col">
        <form onSubmit={onSubmit} >
          <label>Your name</label>
          <input type="text" name='name' placeholder='Enter your name' required />
          <label>Phone number</label>
          <input type="tel" name='phone' placeholder='Enter your phone number' required />
          <label > Write your message here</label>
          <textarea name="message" rows="10" placeholder='Enter your message'></textarea>
          <button type='submit' className='btn dark-btn'>Submit <img src={white_arrow} alt="" /></button>
        </form>
        <span>{result}</span>
      </div>
    </div>
  )
}

export default Contact
