import React from "react";

const Footer = () => {
  return (
    <>
      {/* Footer */}
      <footer className="footer">
        <div className="container footer-inner">
          {/* Newsletter */}
          <div className="footer-newsletter">
            <div className="flex-mine footer-newsletter-1">
              <i
                className="fa-solid fa-bell fa-shake fa-2xl"
                style={{ color: "var(--accent-dark)", marginRight: "20px" }}
              ></i>
              <div>
                <h2>Subscribe to our Newsletter</h2>
                <h3>Get latest offers from Document</h3>
              </div>
            </div>

            <div className="flex-mine-column footer-newsletter-2">
              <form action="" className="flex-mine footer-newsletter-1">
                <input type="email" placeholder="Example@gmail.com" />
                <select>
                  <option value="United States">United States</option>
                  <option value="India">India</option>
                </select>
                <button type="submit">Submit</button>
              </form>

              <p>
                <input type="checkbox" defaultChecked /> I would like to receive
                email from Document.com with the latest offers and promotions.
                See our privacy policy
              </p>

              <p>
                <input type="checkbox" defaultChecked /> I have read and agree
                to the terms and conditions.
              </p>
            </div>
          </div>

          {/* Footer Links */}
          <div className="footer-links mt-40">
            <div className="footer-link">
              <p>
                <strong>BOOK</strong>
              </p>
              <p>
                <a href="#">Cheap Flights</a>
              </p>
              <p>
                <a href="#">Cheap Hotels</a>
              </p>
              <p>
                <a href="#">Cheap Rentals</a>
              </p>
              <p>
                <a href="#">Group Travel</a>
              </p>
            </div>

            <div className="footer-link">
              <p>
                <strong>ABOUT</strong>
              </p>
              <p>
                <a href="#">About Us</a>
              </p>
              <p>
                <a href="#">Contact Us</a>
              </p>
              <p>
                <a href="#">Site Map</a>
              </p>
            </div>

            <div className="footer-link">
              <p>
                <strong>QUICK LINKS</strong>
              </p>
              <p>
                <a href="#">Popular Airlines</a>
              </p>
              <p>
                <a href="#">Popular Flight Routes</a>
              </p>
              <p>
                <a href="#">Top U.S. Destinations</a>
              </p>
              <p>
                <a href="#">Top International Destinations</a>
              </p>
              <p>
                <a href="#">Top Airports</a>
              </p>
              <p>
                <a href="#">Cruise</a>
              </p>
            </div>

            <div className="footer-link">
              <p>
                <strong>TRAVEL TOOLS</strong>
              </p>
              <p>
                <a href="#">Customer Support</a>
              </p>
              <p>
                <a href="#">Online Check-in</a>
              </p>
              <p>
                <a href="#">Airline Baggage Fees</a>
              </p>
              <p>
                <a href="#">Travel Blog</a>
              </p>
              <p>
                <a href="#">Customer Reviews</a>
              </p>
              <p>
                <a href="#">Browser Compatibility</a>
              </p>
            </div>

            <div className="footer-link">
              <p>
                <strong>LEGAL</strong>
              </p>
              <p>
                <a href="#">Privacy Policy</a>
              </p>
              <p>
                <a href="#">Terms & Conditions</a>
              </p>
              <p>
                <a href="#">Taxes & Fees</a>
              </p>
              <p>
                <a href="#">Post-Ticketing Fees</a>
              </p>
              <p>
                <a href="#">Affiliate Program</a>
              </p>
              <p>
                <a href="#">Your California Privacy Rights</a>
              </p>
              <p>
                <a href="#">Travel Now, Pay Later</a>
              </p>
            </div>
          </div>

          {/* Social Follow */}
          <div className="footer-follow mt-40">
            <h3>Follow us on</h3>
            <div className="flex-mine footer-newsletter-1 footer-follow-icon">
              <i
                className="fa-brands fa-square-facebook fa-2xl"
                style={{ color: "var(--accent-dark)" }}
              ></i>
              <i
                className="fa-brands fa-square-x-twitter fa-2xl"
                style={{ color: "var(--accent-dark)" }}
              ></i>
              <i
                className="fa-brands fa-linkedin fa-2xl"
                style={{ color: "var(--accent-dark)" }}
              ></i>
              <i
                className="fa-brands fa-square-instagram fa-2xl"
                style={{ color: "var(--accent-dark)" }}
              ></i>
              <i
                className="fa-brands fa-square-pinterest fa-2xl"
                style={{ color: "var(--accent-dark)" }}
              ></i>
              <i
                className="fa-brands fa-youtube fa-2xl"
                style={{ color: "var(--accent-dark)" }}
              ></i>
            </div>
          </div>

          <p className="mt-40 mb-10">
            Document is an independent travel portal with no third party
            association. By using Document.com, you agree that Document is not
            accountable for any loss - direct or indirect, arising of offers,
            materials or links to other sites found on this website. In case of
            queries, reach us directly at our Contact Number +1-216-302-2732 or,
            simply email at support@Document.com
          </p>
        </div>
      </footer>

      {/* Section 9 */}
      <section className="section9">
        <div className="container section9-inner flex-mine-column">
          <div className="section9-icons">
            <div className="section9-icons-1">
              <img
                src="src/images/IATA.webp"
                alt="IATA"
                style={{ width: "100%", height: "40px" }}
              />
              <img
                src="src/images/arc.png"
                alt="ARC"
                style={{ width: "100%", height: "40px" }}
              />
              <img
                src="src/images/cloudflare.webp"
                alt="Cloudflare"
                style={{ width: "100%", height: "40px" }}
              />
              <img
                src="src/images/digicert.webp"
                alt="Digicert"
                style={{ width: "100%", height: "40px" }}
              />
              <img
                src="src/images/PCI.webp"
                alt="PCI"
                style={{ width: "100%", height: "40px" }}
              />
            </div>
            <div>
              <img
                src="src/images/payment.png"
                alt="Payments"
                style={{ width: "100%" }}
              />
            </div>
          </div>

          <p className="mt-10">
            Copyright © 2013 - 2025 Document | All Rights Reserved.
          </p>
        </div>
      </section>
    </>
  );
};

export default Footer;
