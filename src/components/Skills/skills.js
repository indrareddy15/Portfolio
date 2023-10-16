import React from 'react';
import './skills.css';
import UIDesign from '../../assets/ui-design.png';
import WebDesign from '../../assets/website-design.png';
import AooDesign from '../../assets/app-design.png';

function skills() {
    return (
        <section id="skills">
            <span className="skillsTitle">What I Do</span>
            <span className="skillDescription">I'm a passionate MERN stack developer based in Chennai. I love building web applications and have a strong affinity for clean and efficient code. Here are some of the technologies  React, TypeScript, Material-UI, Bootstrap, Node.js, Express.js MongoDB , MySQL, Git, GitHub, HTML, CSS, RESTful APIs, Redux, Vs Code Extensions </span>
            <div className="skillBars">
                <div className="skillBar">
                    <img src={UIDesign} alt="UIDesign" className="skillBarImg" />
                    <div className="skillBarText">
                        <h2>What Skill bar Text Says</h2>
                        <p>Paragraph about skill Bar Text</p>
                    </div>
                </div>
                <div className="skillBar">
                    <img src={WebDesign} alt="WebDesign" className="skillBarImg" />
                    <div className="skillBarText">
                        <h2>What Skill bar Text Says</h2>
                        <p>Paragraph about skill Bar Text</p>
                    </div>
                </div>
                <div className="skillBar">
                    <img src={AooDesign} alt="App Design" className="skillBarImg" />
                    <div className="skillBarText">
                        <h2>What Skill bar Text Says</h2>
                        <p>Paragraph about skill Bar Text</p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default skills