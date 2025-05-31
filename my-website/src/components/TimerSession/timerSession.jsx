//import des hook
import React, { useEffect, useRef, useState } from "react";

//import des librairies
import axios from "axios";
import { jwtDecode } from "jwt-decode";

//import des composants enfants
import { DisplayCounterDown } from "@components/TimerSession/DisplayCounterDown.jsx";

//import des fonctions
import { clearLocalStorageInfoSession } from "@utils/fonction/clearLocalStorageInfosession";
import { initCounterDown } from "@utils/fonction/initCounterDown";
import { storeToken } from "@utils/fonction/storeToken";
import { localOrProd } from "@utils/fonction/testEnvironement.js";

//feuilles de style
import "@styles/CSS/Timersession.css";

//import des icones
import { FaUser } from "react-icons/fa";

function TimerSession() {
  const { urlApi, mode } = localOrProd();

  //state qui contient la valeur du compteur
  const [timeRemaining, setTimeRemaining] = useState(initCounterDown());

  //state qui contient le nom de l'utilisateur
  const [user, setUser] = useState(null);

  //state qui lance le compte à rebours
  const [startCounterDown, setStartCounterDown] = useState(false);

  //state qui lance le test de la session
  const [testSession, setTestSession] = useState(false);

  //state pour le collapse
  const [isOpen, setIsOpen] = useState(false);

  //state pour savoir si la session est active
  const [isSessionActive, setIsSessionActive] = useState(false);

  //ref qui contient l' id du setInterval du compteur
  const counter = useRef(null);

  /* //ref qui contient la valeur initiale du compteur
  const initialTime = useRef(initCounterDown()); */

  //fonction qui décrémente le compteur
  const counterDown = () => {
    console.log("counter.current dans le compte à rebours:", counter.current);

    counter.current = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime > 0) {
          console.log("prevTime in counterDown:", prevTime);
          localStorage.setItem("timeRemaining", (prevTime - 1).toString());
          localStorage.setItem("lastTime", new Date().getTime().toString());
          return prevTime - 1;
        } else {
          //alert("Session expirée!, redirection vers page de connexion");
          console.log("Session expirée!, redirection vers page de connexion");
          clearInterval(counter.current);
          clearLocalStorageInfoSession("");
          setIsSessionActive(false);
          //setTestSession(!testSession);
          return 0;
        }
      });
    }, 1000);
  };

  //simule une session active
  /*useEffect(() => {
    //supprime les données du localStorage
    //clearLocalStorageInfoSession("");
    //simule une session active
    if (!localStorage.getItem("timeRemaining")) {
      setTimeout(() => {
        localStorage.setItem("timeRemaining", "20");
        localStorage.setItem("user", "John Doe");
      }, 3000);
    }
  }, []);*/

  //detect if a session is active all 1s
  useEffect(() => {
    if (localStorage.getItem("timeRemaining")) {
      setIsSessionActive(true);
      setStartCounterDown(!startCounterDown);
      return;
    }

    const intervalSearchSession = setInterval(() => {
      console.log("pas de session active");
      if (localStorage.getItem("timeRemaining")) {
        console.log("session active");
        setIsSessionActive(true);
        //setTimeRemaining(parseInt(localStorage.getItem("timeRemaining")));
        setTimeRemaining(initCounterDown());
        clearInterval(intervalSearchSession);
        setStartCounterDown(!startCounterDown);
      }
    }, 1000);
    return () => clearInterval(intervalSearchSession);
  }, []);

  //lance le compte à rebours
  useEffect(() => {
    if (localStorage.getItem("user")) {
      const userName = localStorage.getItem("user");
      setUser(userName);
    }
    counterDown();
    return () => {
      if (counter.current) {
        clearInterval(counter.current);
      }
    };
  }, [startCounterDown]);

  //fetch to refresh token
  const refreshToken = async () => {
    try {
      const response = await axios.post(
        `${urlApi}/auth/refresh-token`,
        {},
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status === "success") {
        //stop le count down actuel
        clearInterval(counter.current);

        //store the new accesstoken
        const isTokenRefreshed = storeToken(response.data, jwtDecode);
        if (!isTokenRefreshed) {
          throw new Error("Impossible de stoker le token dans le localStorage");
        }

        //reinitialise le compteur
        setTimeRemaining(initCounterDown());

        //relance le count down
        setStartCounterDown(!startCounterDown);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // Erreur côté serveur (ex: 401, 403, 500)
          console.error(
            "Erreur HTTP :",
            error.response.status,
            error.response.data
          );
        } else if (error.request) {
          // Aucune réponse (timeout, offline)
          console.error("Pas de réponse du serveur :", error.request);
        } else {
          // Erreur autre (mauvaise URL, etc.)
          console.error("Erreur Axios :", error.message);
        }
      } else {
        // Erreur non Axios (ex: bug JS)
        console.error("Erreur inconnue :", error);
      }
    }
  };

  const toggleCollapse = () => {
    setIsOpen(!isOpen);
  };

  return isSessionActive ? (
    <div className="flex-column-start-center timer-session">
      <div
        className={`timer-user-session ${isOpen ? "active" : ""}`}
        onClick={toggleCollapse}
      >
        <p>
          <span>
            <FaUser />
          </span>
          {user}
        </p>
      </div>
      <ul
        className={`flex-column-start-center collapsible-content ${
          isOpen ? "active" : ""
        }`}
      >
        <li className="timer-session-counter">
          <DisplayCounterDown timeRemaining={timeRemaining} />
        </li>
        {timeRemaining < 880 && (
          <li className="flex-column-center-center timer-session-button">
            <button onClick={() => refreshToken()}>Rester connecté</button>
          </li>
        )}
        <li className="flex-column-center-center timer-session-button">
          <button
            onClick={() => {
              clearLocalStorageInfoSession("index.html");
            }}
          >
            Déconnexion
          </button>
        </li>
      </ul>
    </div>
  ) : null;
}

export { TimerSession };
