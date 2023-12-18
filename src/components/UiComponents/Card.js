// Card.js

import React from "react";
import "./card.css"; // Import the CSS file for styling
import { MdPerson, MdLock } from "react-icons/md";
const Card = ({ title, subTitle }) => {
  return (
    <div className="card1">
      <h2 className="cardTitle">{title}</h2>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          //   alignItems: "center",
          //   backgroundColor: "red",
          marginTop: 20,
        }}
      >
        <MdPerson size={25} style={{ color: "black", marginRight: 5 }} />
        <p className="cardSubTitle" style={{ marginTop: 3 }}>
          {subTitle}
        </p>
      </div>
    </div>
  );
};

export default Card;
