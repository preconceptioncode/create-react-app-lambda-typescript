import { useState } from "react";
import { createContainer } from "unstated-next";

function useDeviceAndStateDetector() {
  const [isIos, setIsIos] = useState();
  const [isStandalone, setIsStandalone] = useState();
  const checkIfIos = () => {
    setIsIos(iOS());
  };
  const checkIfStandalone = () => {
    setIsStandalone(standalone());
  };
  return {
    isIos,
    isStandalone,
    checkIfIos,
    checkIfStandalone
  };
}

export const DeviceType = createContainer(useDeviceAndStateDetector);

function standalone() {
  //@ts-ignore
  if (navigator.standalone) {
    return true; // iOS
  }
  if (window.matchMedia("(display-mode: standalone)").matches) {
    return true; // Android with "display": "standalone" in Manifest
  }
  //@ts-ignore

  if (new URL(window.location).searchParams.has("homescreen")) {
    return true; // fallback to check for "?homescreen=1"
  }
  return false;
}

// iPad Optional?
function iOS() {
  return ["iPhone", "iPod"].includes(navigator.platform);
}
