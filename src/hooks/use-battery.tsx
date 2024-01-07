import {
  $,
  NoSerialize,
  Signal,
  noSerialize,
  useSignal,
  useVisibleTask$,
} from "@builder.io/qwik";

export interface BatteryState {
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  level: number;
}

interface BatteryManager extends Readonly<BatteryState>, EventTarget {
  onchargingchange: () => void;
  onchargingtimechange: () => void;
  ondischargingtimechange: () => void;
  onlevelchange: () => void;
}

interface NavigatorWithPossibleBattery extends Navigator {
  getBattery?: () => Promise<BatteryManager>;
}

type UseBatteryState =
  | { isSupported: false } // Battery API is not supported
  | { isSupported: true; fetched: false } // battery API supported but not fetched yet
  | (BatteryState & { isSupported: true; fetched: true }); // battery API supported and fetched

const nav: NavigatorWithPossibleBattery | undefined =
  typeof navigator !== "undefined" ? navigator : undefined;
const isBatteryApiSupported = nav && typeof nav.getBattery === "function";

function useBatteryMock(): UseBatteryState {
  return { isSupported: false };
}

export const useBattery = (): Signal<UseBatteryState> => {
  const state = useSignal<UseBatteryState>({
    isSupported: true,
    fetched: false,
  });

  const battery = useSignal<NoSerialize<BatteryManager> | null>(null);

  const handleChange = $(() => {
    if (!battery.value) return;
    const newState: UseBatteryState = {
      isSupported: true,
      fetched: true,
      level: battery.value.level,
      charging: battery.value.charging,
      dischargingTime: battery.value.dischargingTime,
      chargingTime: battery.value.chargingTime,
    };

    state.value = newState;
  });

  // eslint-disable-next-line
  useVisibleTask$(async ({ cleanup }) => {
    if (!nav?.getBattery) return;
    const bat = await nav.getBattery();

    bat.onchargingchange = handleChange;
    bat.onchargingtimechange = handleChange;
    bat.ondischargingtimechange = handleChange;
    bat.onlevelchange = handleChange;

    battery.value = noSerialize(bat);

    await handleChange();

    cleanup(() => {
      if (bat) {
        bat.removeEventListener("chargingchange", handleChange);
        bat.removeEventListener("chargingtimechange", handleChange);
        bat.removeEventListener("dischargingtimechange", handleChange);
        bat.removeEventListener("levelchange", handleChange);
      }
    });
  });

  return state;
};

export default isBatteryApiSupported ? useBattery : useBatteryMock;
