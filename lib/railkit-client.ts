import { configure, getTrainInfo, stationsByName, trackTrain, fareLookup, liveAtStation, cancelList, checkPNRStatus } from "railkit";

// Initialize RailKit SDK
let initialized = false;

function initRailKit() {
  if (initialized) return;
  const key = process.env.RAILKIT_API_KEY;
  if (!key) throw new Error("RAILKIT_API_KEY not set");
  configure(key);
  initialized = true;
}

export {
  initRailKit,
  getTrainInfo,
  stationsByName,
  trackTrain,
  fareLookup,
  liveAtStation,
  cancelList,
  checkPNRStatus,
};
