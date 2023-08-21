import { useEffect } from "react";
import { Container, Carousel } from "react-bootstrap";

function Slider() {
  return (
    <div className="position-relative">
      <Carousel interval={2000} pause="hover">
        <Carousel.Item>
          <img
            src="https://disin-react.hibootstrap.com/images/home-two/home-2-slider1.jpg"
            className="d-block"
            alt="Medical Image"
            style={{}}
          />
          <div
            className="carousel-caption d-none d-md-block"
            style={{
              textAlign: "left",
              top: "50%",
              transform: "translateY(-50%)",
              color: "black",
            }}
          >
            <h3>Fantastic Doctors</h3>
            <p>Text description about fantastic doctors here.</p>
          </div>
        </Carousel.Item>
        <Carousel.Item>
          <img
            src="https://disin-react.hibootstrap.com/images/home-two/home-2-slider2.jpg"
            className="d-block"
            alt="Medical Image"
            style={{}}
          />
          <div
            className="carousel-caption d-none d-md-block"
            style={{
              textAlign: "left",
              top: "50%",
              transform: "translateY(-50%)",
              color: "black",
            }}
          >
            <h3>Fantastic Doctors</h3>
            <p>Text description about fantastic doctors here.</p>
          </div>
        </Carousel.Item>
        <Carousel.Item>
          <img
            src="https://cliniq.bold-themes.com/curves/wp-content/uploads/sites/4/2021/08/hero_home_01-1.jpg"
            className="d-block"
            alt="Medical Image"
            style={{}}
          />
          <div
            className="carousel-caption d-none d-md-block"
            style={{
              textAlign: "left",
              top: "50%",
              transform: "translateY(-50%)",
              color: "black",
            }}
          >
            <h3>Fantastic Doctors</h3>
            <p>Text description about fantastic doctors here.</p>
          </div>
        </Carousel.Item>
      </Carousel>
    </div>
  );
}

export default Slider;
