import React from "react";

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <h2 className="footer-logo">🦸‍♂️ Superheroes Hub</h2>
                <p className="footer-tagline">Every hero has a story</p>

                <div className="footer-links">
                    <a href="#">Marvel</a>
                    <a href="#">DC</a>
                    <a href="#">Comics</a>
                    <a href="#">Contact</a>
                </div>


            </div>

            <div className="footer-bottom">
                <p>© {new Date().getFullYear()} Superheroes Hub. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
