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
import { handleAxiosError } from "@utils/fonction/handleAxiosError";

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
  //const [testSession, setTestSession] = useState(false);

  //state pour le collapse
  const [isOpen, setIsOpen] = useState(false);

  //state pour savoir si la session est active
  const [isSessionActive, setIsSessionActive] = useState(false);

  //ref qui contient l' id du setInterval du compteur
  const counter = useRef(null);

  //fonction counterdown version 2 - basée sur l'expiration réelle du token
  const counterDownV2 = () => {
    // Nettoie un éventuel interval en cours avant d'en recréer un
    if (counter.current) {
      clearInterval(counter.current);
      counter.current = null;
    }
    counter.current = setInterval(() => {
      const hasToken = !!localStorage.getItem("token");
      const remaining = initCounterDown();
      if (remaining > 0 && hasToken) {
        // Recalcule en fonction de l'heure système pour éviter les décalages
        setTimeRemaining(remaining);
      } else {
        clearInterval(counter.current);
        counter.current = null;
        deleteSession();
      }
    }, 1000);
  };

  //fonction qui vérifie si la session est active et valide
  const checkSession = () => {
    let tokenExpiration =
      parseInt(localStorage.getItem("tokenExpiration")) || 0;
    let currentTime = Math.floor(Date.now() / 1000);
    if (currentTime >= tokenExpiration) {
      return false;
    }
    return true;
  };

  //fonction qui supprime la session
  const deleteSession = () => {
    setTimeRemaining(initCounterDown());
    setIsSessionActive(false);
    clearLocalStorageInfoSession();
  };

  //fonction qui lance la session
  const startSession = () => {
    setIsSessionActive(true);
    if (localStorage.getItem("user")) {
      const userName = JSON.parse(localStorage.getItem("user"));
      setUser(userName);
    }
    setTimeRemaining(initCounterDown());
    setStartCounterDown(true);
  };

  //gere la detection d'une session declarer dans le localStorage
  useEffect(() => {
    let intervalSearchSession = null;
    //si une session est declarée dans le localStorage et que la session n'est pas active, on la lance une session
    if (checkSession() && !isSessionActive) {
      startSession();
    }
    //si pas de session declaree dans le localStorage, et pas de session active,
    //  on la lance un check session toutes les secondes
    if (!checkSession() && !isSessionActive) {
      intervalSearchSession = setInterval(() => {
        console.log("pas de session active");
        if (checkSession()) {
          console.log("session active");
          startSession();
          clearInterval(intervalSearchSession); //stop la recherche d'une session
        }
      }, 1000);
    }

    return () => {
      if (intervalSearchSession > 0) {
        clearInterval(intervalSearchSession);
      }
    };
  }, [isSessionActive]);

  //lance le compte à rebours et nettoie à l'unmount/changement d'état
  useEffect(() => {
    if (startCounterDown) {
      counterDownV2();
    }
    return () => {
      if (counter.current) {
        clearInterval(counter.current);
        counter.current = null;
      }
    };
  }, [startCounterDown]);

  //useEffect qui referme le collapse si detecte un click en dehors du collapse
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (event.target.closest(".timer-user-session")) {
        return;
      }
      if (isOpen) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen]);

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
          timeout: 10000,
        }
      );

      if (response.data.status === "success") {
        //stop le count down actuel
        clearInterval(counter.current);
        setStartCounterDown(false);

        //store the new accesstoken
        const isTokenRefreshed = storeToken(response.data, jwtDecode);
        if (!isTokenRefreshed) {
          return "Impossible de stoker le token dans le localStorage ou le token n'est pas valide";
        }

        //reinitialise le compteur
        setTimeRemaining(initCounterDown());

        //relance le count down
        setStartCounterDown(true);
      }
    } catch (error) {
      handleAxiosError(error);
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
      <ul className={`collapsible-content ${isOpen ? "active" : ""}`}>
        <li className="timer-session-counter">
          <DisplayCounterDown timeRemaining={timeRemaining} />
        </li>
        <li>
          <a id="timer-session-link" href="/public/fr/dashboard.html">
            Dashboard
          </a>
        </li>
        {timeRemaining < 880 && (
          <li>
            <button
              className="timer-session-button"
              onClick={() => refreshToken()}
            >
              Rester connecté
            </button>
          </li>
        )}
        <li>
          <button
            className="timer-session-button"
            onClick={() => {
              deleteSession();
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
