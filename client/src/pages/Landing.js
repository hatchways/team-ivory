import React from 'react';
import Hero from '../base_components/landing/Hero';
import HowItWorks from '../base_components/landing/HowItWorks';
import Newsletter from '../base_components/landing/Newsletter';
import Contact from '../base_components/landing/Contact';
import Footer from '../base_components/landing/Footer';

const LandingPage = () => {
	return (
		<div>
			<Hero />
			<HowItWorks />
			<Newsletter />
			<Contact />
			<Footer />
		</div>
	);
};

export default LandingPage;
