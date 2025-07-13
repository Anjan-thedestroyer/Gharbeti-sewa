import React from 'react'
import Navbar from './component/Navbar'
import './index.css'
import Hero from './component/Hero'
import Programs from './component/Programs'
import Title from './component/Title'
import Campus from './component/Campus'
import Contact from './component/Contact'
import Footer from './component/Footer'
import About from './component/About'

const Main = () => {
    return (
        <div className="main-container">
            <Navbar />
            <div className="content-wrapper">
                <Hero />
                <div className="container">
                    <Title subTitle='Wanna add hostel' title='Add now' />
                    <About />
                    <Title subTitle='Our PROGRAM' title='What We Offer' />
                    <Programs />

                    <Title subTitle='ZERO charges' title='for students' />
                    <Campus />

                    <Title subTitle='Contact US' title='GEt in touch' />
                    <Contact />
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Main