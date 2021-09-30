import React from 'react'; 

import Header from '../containers/IntroductionPage/Header';
import HeroHome from '../containers/IntroductionPage/HeroHome';
import FeaturesHome from '../containers/IntroductionPage/Features';
import FeaturesBlocks from '../containers/IntroductionPage/FeaturesBlocks';
import Testimonials from '../containers/IntroductionPage/Testimonials';
import Newsletter from '../containers/IntroductionPage/Newsletter';
import Footer from '../containers/IntroductionPage/Footer';

// import '../intro.css'
// import '../other.css'


function Home() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden" id="introductionPage">
      {/* <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/1.9.6/tailwind.min.css"></link> */}
      {/* <link rel="stylesheet" href="../other.css"></link>
      <link rel="stylesheet" href="../intro.css"></link> */}
      

      {/*  Site header */}
      <Header />

      {/*  Page content */}
      <main className="flex-grow">

        {/*  Page sections */}
        <HeroHome />
        <FeaturesHome />
        <FeaturesBlocks />
        <Testimonials />
        <Newsletter />

      </main>

      {/*  Site footer */}
      <Footer />

    </div>
  );
}

export default Home;