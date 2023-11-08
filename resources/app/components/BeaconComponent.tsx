import { useEffect } from "react";

const BeaconComponent = () => {
  useEffect(() => {
    const initializeBeacon = () => {
      const e = window;
      const t = document;
      const n = window.Beacon || function () {};

      function a() {
        const e = t.getElementsByTagName("script")[0];
        const n = t.createElement("script");
        n.type = "text/javascript";
        n.async = true;
        n.src = "https://beacon-v2.helpscout.net";
        e.parentNode.insertBefore(n, e);
      }

      if (((e.Beacon = n), (n.readyQueue = []), "complete" === t.readyState)) {
        return a();
      }

      if (e.attachEvent) {
        e.attachEvent("onload", a);
      } else {
        e.addEventListener("load", a, false);
      }
    };

    initializeBeacon();
    window.Beacon("init", "2e5a0eed-23bc-47fa-8a3f-62eee9b450ce");
  }, []);

  return <div></div>;
};

export default BeaconComponent;
