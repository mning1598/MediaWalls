import React, { Component } from 'react';
import { Image } from 'react-bootstrap';
import BackdropFilter from 'react-backdrop-filter';

import "./landingPage.css"



document.title = 'Media Walls';


class App extends Component {
  render() {
    return (
      <div className="menu_wrapper">
        <div className="bgColor2">
          <div className="container center">
            <nav className="menu">
              <ul className="menu__list">
                <a href="/">
                  <Image src="/assets/logo.png" className="logo"/>
                </a>
                <li className="menu__list-item"><a className="menu__link menu__link--active" href="#">Home</a></li>
                <li className="menu__list-item"><a className="menu__link" href="#">About</a></li>
                <li className="menu__list-item"><a className="menu__link" href="#">Contact</a></li>
              </ul>
            </nav>
          </div>
        </div>
        <div className="container1">
          <BackdropFilter
            className="bluredForm"
            filter={"blur(20px) brightness(110%)"}
          >
            <form>
              <h1 className="pt100 title1">
                Media Walls
                  </h1>
              <p className="mlr100 pt75 title fbs">
                Here you can create personalized connections between you and your friends, so that you can always find that video, image, or meme that reminds you of them.
                  </p>
            </form>
          </BackdropFilter>
        </div>
      </div>
    );
  }
}

export default App;
