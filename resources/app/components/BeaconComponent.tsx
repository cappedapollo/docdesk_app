import React, { useEffect } from "react";

const useBeacon = () => {
  useEffect(() => {
    // Beacon script initialization
    const initBeacon = () => {
      const e = window;
      const t = document;
      const n = e.Beacon || function () {};

      function a() {
        const s = t.getElementsByTagName("script")[0];
        const n = t.createElement("script");
        n.type = "text/javascript";
        n.async = true;
        n.src = "https://beacon-v2.helpscout.net";
        s.parentNode.insertBefore(n, s);
        console.log(s.parentElement);
      }

      if (((e.Beacon = n), (n.readyQueue = []), "complete" === t.readyState))
        return a();

      e.attachEvent
        ? e.attachEvent("onload", a)
        : e.addEventListener("load", a, false);
    };

    initBeacon();

    setTimeout(() => {
      window.Beacon("init", "2e5a0eed-23bc-47fa-8a3f-62eee9b450ce");
    }, [1000]);

    // Call the Beacon script initialization function
  }, []); // Empty dependency array ensures this effect runs only once when the component mounts
};

export default useBeacon;
