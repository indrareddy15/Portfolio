import React from 'react';
import './contact.css';
import WallMartImage from "../../assets/walmart.png";
import AdobeImage from "../../assets/adobe.png";
import GoogleImage from "../../assets/walmart.png";
// import WallMartImage from "../../assets/walmart.png";

function Contact() {
    return (
        <section className="contactpage">
            <div className="clientPage">
                <h1 className="contactPageTitle">My Clients</h1>
                <span className="clientDesc">A listing can be deleted from the Database after a listing is dropped. This can be done via the Delete route.</span>
            </div>
            <div className="clientImgs">
                <img src={WallMartImage} alt="Client" className="clientImg" />
                <img src={AdobeImage} alt="Client" className="clientImg" />
                <img src={GoogleImage} alt="Client" className="clientImg" />
                <img src={AdobeImage} alt="Client" className="clientImg" />
            </div>
            <div className="contact">

            </div>
        </section>
    )
}

export default Contact;