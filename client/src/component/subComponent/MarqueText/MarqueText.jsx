import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

const Marquee = ({ direction, speed, delay, children }) => {
  const [position, setPosition] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const marqueeRef = useRef();

  useEffect(() => {
    const element = marqueeRef.current;
    const interval = setInterval(() => {
      if (!isPaused) {
        setPosition(
          (prevPosition) =>
            prevPosition +
            speed * (direction === "left" || direction === "top" ? -1 : 1)
        );
      }
    }, delay);
    return () => clearInterval(interval);
  }, [direction, speed, delay, isPaused]);

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  const styles = {
    position: "relative",
    overflow: "hidden",
    // width: "100%",
    // height: "100%",
    whiteSpace: "nowrap",
    fontSize: "1em",
  };

  if (marqueeRef.current) {
    switch (direction) {
      case "top":
        if (position < -marqueeRef.current.offsetHeight) {
          setPosition(marqueeRef.current.parentElement.offsetHeight);
        }
        styles.top = `${position}px`;
        break;
      case "bottom":
        if (position > marqueeRef.current.parentElement.offsetHeight) {
          setPosition(-marqueeRef.current.offsetHeight);
        }
        styles.bottom = `${-position}px`;
        break;
      case "left":
        if (position < -marqueeRef.current.offsetWidth) {
          setPosition(marqueeRef.current.parentElement.offsetWidth);
        }
        styles.left = `${position}px`;
        break;
      case "right":
        if (position > marqueeRef.current.parentElement.offsetWidth) {
          setPosition(-marqueeRef.current.offsetWidth);
        }
        styles.right = `${-position}px`;
        break;
      default:
        break;
    }
  }

  const resizeText = () => {
    const element = marqueeRef.current;
    const parentWidth = element.parentElement.offsetWidth;
    const childWidth = element.offsetWidth;
    const ratio = parentWidth / childWidth;
    const fontSize = parseFloat(getComputedStyle(element).fontSize);
    const newFontSize = fontSize * ratio;
    element.style.fontSize = `${newFontSize}px`;
  };

  useEffect(() => {
    window.addEventListener("resize", resizeText);
    resizeText();
    return () => {
      window.removeEventListener("resize", resizeText);
    };
  }, []);

  return (
    <div
      ref={marqueeRef}
      style={styles}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="Marque_text"
    >
      {children}
    </div>
  );
};

Marquee.propTypes = {
  direction: PropTypes.oneOf(["top", "bottom", "left", "right"]).isRequired,
  speed: PropTypes.number.isRequired,
  delay: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired,
};

export default Marquee;
