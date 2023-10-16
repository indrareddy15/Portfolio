import React from 'react';
import "./works.css";
import WorkImage1 from "../../assets/portfolio-1.png"
import WorkImage2 from "../../assets/portfolio-2.png"
import WorkImage3 from "../../assets/portfolio-3.png"
import WorkImage4 from "../../assets/portfolio-4.png"
import WorkImage5 from "../../assets/portfolio-5.png"
import WorkImage6 from "../../assets/portfolio-6.png"

function Works() {
    return (
        <section className="works">
            <span className="worksTitle">My Portfolio</span>
            <span className="workDescription">I'm currently working on various exciting projects that include building feature-rich web applications, improving user experiences, and exploring the latest web development trends and best practices</span>
            <div className="worksImgs">
                <img src={WorkImage1} alt="WorkImages" className="worksImg" />
                <img src={WorkImage2} alt="WorkImages" className="worksImg" />
                <img src={WorkImage3} alt="WorkImages" className="worksImg" />
                <img src={WorkImage4} alt="WorkImages" className="worksImg" />
                <img src={WorkImage5} alt="WorkImages" className="worksImg" />
                <img src={WorkImage6} alt="WorkImages" className="worksImg" />
            </div>
            <button className="worksBtn">See More</button>
        </section>
    )
}

export default Works