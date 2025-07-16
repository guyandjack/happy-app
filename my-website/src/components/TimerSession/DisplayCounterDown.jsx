//import des hook
import React from "react";

//import du fichier scss
//import "@styles/CSS/CounterDown.css";

function DisplayCounterDown({ timeRemaining }) {
  if (timeRemaining === undefined || timeRemaining === null) {
    return null;
  }

  if (timeRemaining < 0) {
    return (
      <div className="flex-column-center-center counter-down">
        <div>{"La session a expiré"}</div>
      </div>
    );
  }
  let minutes = Math.floor(timeRemaining / 60);
  let seconds = timeRemaining % 60;
  let formatedMinutes = minutes.toString().padStart(2, "0");
  let formatedSeconds = seconds.toString().padStart(2, "0");
  return (
    <div className="flex-column-center-center counter-down">
      <div>{"La session expire dans"}</div>
      <div>{`${formatedMinutes} : ${formatedSeconds}`}</div>
    </div>
  );
}

export { DisplayCounterDown };
