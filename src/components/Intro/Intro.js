import React from 'react'
import './Intro.css'
import HireBtn from '../../assets/hireme.png'
import ProfileImage from '../../assets/NewImage.jpg'

import { Link } from 'react-scroll'

const Intro = () => {
    return (
        <section id="intro">
            <div className="introContent">
                <span className="hello">Hello..</span>
                <span className="introText">I'm  <span className="introName">Your Name </span> <br />Softwate Developer</span>
                <p className="introPara">How To Implement Smooth Scrolling in React <br/> Installing and Configuring React-Scroll</p>
                <Link><button className="hireMeBtn"><img src={HireBtn} alt="" className="img" />Hire Me</button></Link>
            </div>
            <img src={ProfileImage} alt="Profile" className="bgImg" />
        </section>
    )
}

export default Intro