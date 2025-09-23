import React, { useEffect } from "react";

const Navbar = () => {
  useEffect(() => {
    // Hamburger menu functionality
    const hamMenu = document.querySelector(".ham-menu");
    const details = document.querySelector(".header-details");
    const allDeals = document.getElementById("all-deals");

    if (hamMenu && details && allDeals) {
      const toggleMenu = () => {
        hamMenu.classList.toggle("active");
        details.classList.toggle("active");
        allDeals.style.display = "none";
      };

      hamMenu.addEventListener("click", toggleMenu);

      // Deals dropdown functionality
      const dealsElement = document.getElementById("deals");
      if (dealsElement) {
        const toggleDealsDropdown = (e) => {
          e.preventDefault();
          const currentDisplay = window.getComputedStyle(allDeals).display;

          if (currentDisplay === "none") {
            allDeals.style.display = "grid";
          } else {
            allDeals.style.display = "none";
          }
        };

        dealsElement.addEventListener("click", toggleDealsDropdown);

        // Cleanup to avoid duplicate listeners
        return () => {
          hamMenu.removeEventListener("click", toggleMenu);
          dealsElement.removeEventListener("click", toggleDealsDropdown);
        };
      }

      return () => hamMenu.removeEventListener("click", toggleMenu);
    }
  }, []);

  return (
    <>
      <header>
        <div className="flex-mine header">
          <div className="header-brand">
            <h1 className="text-3xl font-semibold">Document</h1>
          </div>

          <div className="header-details flex-mine">
            <div className="header-pages">
              <ul className="flex-mine">
                <li>
                  <a href="#">Flights</a>
                </li>
                <li>
                  <a href="#">Cruise</a>
                </li>
                <li id="deals">
                  <a href="/">
                    Deals <span className="fa fa-angle-down"></span>
                  </a>
                </li>
              </ul>
            </div>
            <i
              className="fa-solid fa-phone-volume fa-shake fa-xl header-call-button"
              style={{ color: "var(--primary)", marginRight: "10px" }}
            ></i>
            <div className="header-call">
              <p>Call 24/7 for our Best Deals</p>
              <h2 className="text-xl font-semibold">+1-888-888-8888</h2>
            </div>
          </div>

          <div className="ham-menu">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </header>

      {/* Deals Dropdown */}
      <div className="all-deals show" id="all-deals">
        <div className="all-deals-inner">
          <ul>
            <li>
              <b>Top Deals</b>
            </li>
            <li>
              <a href="#">Travel Coupons</a>
            </li>
            <li>
              <a href="#">Domestic Flights</a>
            </li>
            <li>
              <a href="#">International Flights</a>
            </li>
            <li>
              <a href="#">Round Trip Flights</a>
            </li>
            <li>
              <a href="#">One Way Flights</a>
            </li>
            <li>
              <a href="#">Flight Tickets</a>
            </li>
            <li>
              <a href="#">Group Travel</a>
            </li>
          </ul>
        </div>

        <div className="all-deals-inner all-deals-inner-1">
          <ul>
            <li>
              <b>Travel by interest</b>
            </li>
            <li>
              <a href="#">Last Minute Flights</a>
            </li>
            <li>
              <a href="#">Military Travel</a>
            </li>
            <li>
              <a href="#">Student Flights</a>
            </li>
            <li>
              <a href="#">Senior Travel</a>
            </li>
            <li>
              <a href="#">Family Travel</a>
            </li>
            <li>
              <a href="#">Top Airlines</a>
            </li>
          </ul>
        </div>

        <div className="all-deals-inner">
          <ul>
            <li>
              <b>Travel by Price</b>
            </li>
            <li>
              <a href="#">Deals Under $99</a>
            </li>
            <li>
              <a href="#">Deals Under $199</a>
            </li>
            <li>
              <a href="#">Business Class</a>
            </li>
            <li>
              <a href="#">First Class Flights</a>
            </li>
            <li>
              <a href="#">Low-Cost Airline Tickets</a>
            </li>
          </ul>
        </div>

        <div className="all-deals-inner all-deals-inner-1">
          <ul>
            <li>
              <b>US Destinations</b>
            </li>
            <li>
              <a href="#">Dallas</a>
            </li>
            <li>
              <a href="#">Orlando</a>
            </li>
            <li>
              <a href="#">West Palm Beach</a>
            </li>
            <li>
              <a href="#">San Diego</a>
            </li>
            <li>
              <a href="#">New Orleans</a>
            </li>
            <li>
              <a href="#">Baltimore</a>
            </li>
            <li>
              <a href="#">Philadelphia</a>
            </li>
            <li>
              <a href="#">Seattle</a>
            </li>
          </ul>
        </div>

        <div className="all-deals-inner">
          <ul>
            <li>
              <b>International Destinations</b>
            </li>
            <li>
              <a href="#">India Flights</a>
            </li>
            <li>
              <a href="#">Mexico City</a>
            </li>
            <li>
              <a href="#">Guadalajara</a>
            </li>
            <li>
              <a href="#">San Juan</a>
            </li>
            <li>
              <a href="#">Delhi</a>
            </li>
            <li>
              <a href="#">Mumbai</a>
            </li>
            <li>
              <a href="#">Bengaluru</a>
            </li>
            <li>
              <a href="#">Vancouver</a>
            </li>
            <li>
              <a href="#">Cancun</a>
            </li>
            <li>
              <a href="#">Punta Cana</a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Navbar;