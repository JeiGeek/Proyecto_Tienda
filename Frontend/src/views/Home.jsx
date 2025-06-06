import React from "react";
import Carousel from "react-bootstrap/Carousel";

import img1 from "../imagenes/20.jpg";
import img2 from "../imagenes/21.jpg";
import img3 from "../imagenes/22.jpg";
import img4 from "../imagenes/23.jpg";

import ProductSlider from "./ProductSlider";
import Mission from "../Componentes/Mission";
import ChatBot from "../Componentes/Chatbot";
import Tipos from "../Componentes/Tipos";

function Home() {
  return (
    <div id="main-carousel" className="carousel">
      <Carousel>
        <Carousel.Item>
          <img className="d-block w-100" src={img1} alt="first slide" />
        </Carousel.Item>
        <Carousel.Item>
          <img className="d-block w-100" src={img2} alt="second slide" />
        </Carousel.Item>
        <Carousel.Item>
          <img className="d-block w-100" src={img3} alt="third slide" />
        </Carousel.Item>
        <Carousel.Item>
          <img className="d-block w-100" src={img4} alt="fourth slide" />
        </Carousel.Item>
      </Carousel>
      <ProductSlider />
      <Mission /> {/* La pestaña lateral de misión */}
      <Tipos />
      <ChatBot />{" "}
      {/* El botón flotante del chatbot con mensajes predefinidos */}
    </div>
  );
}

export default Home;
