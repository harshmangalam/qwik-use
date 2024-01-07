import { $, useSignal, useStore, useVisibleTask$ } from "@builder.io/qwik";

export interface GeolocationPositionError {
  readonly code: number;
  readonly message: string;
  readonly PERMISSION_DENIED: number;
  readonly POSITION_UNAVAILABLE: number;
  readonly TIMEOUT: number;
}

export interface GeoLocationSensorState {
  accuracy: number | null;
  altitude: number | null;
  altitudeAccuracy: number | null;
  heading: number | null;
  latitude: number | null;
  longitude: number | null;
  speed: number | null;
  timestamp: number | null;
}

interface GeolocationStore {
  data: GeoLocationSensorState;
  error: GeolocationPositionError | null;
  loading: boolean;
}
export const useGeolocation = (options?: PositionOptions) => {
  const store = useStore<GeolocationStore>({
    error: null,
    data: {
      accuracy: null,
      altitude: null,
      altitudeAccuracy: null,
      heading: null,
      latitude: null,
      longitude: null,
      speed: null,
      timestamp: Date.now(),
    },
    loading: true,
  });

  const watchId = useSignal<number | null>(null);
  const onEvent = $((event: GeolocationPosition) => {
    store.data = {
      accuracy: event.coords.accuracy,
      altitude: event.coords.altitude,
      altitudeAccuracy: event.coords.altitudeAccuracy,
      heading: event.coords.heading,
      latitude: event.coords.latitude,
      longitude: event.coords.longitude,
      speed: event.coords.speed,
      timestamp: event.timestamp,
    };
    store.loading = false;
  });
  const onEventError = $((err: GeolocationPositionError) => {
    store.error = {
      code: err.code,
      message: err.message,
      PERMISSION_DENIED: err.PERMISSION_DENIED,
      POSITION_UNAVAILABLE: err.POSITION_UNAVAILABLE,
      TIMEOUT: err.TIMEOUT,
    };
    store.loading = false;
  });
  // eslint-disable-next-line
  useVisibleTask$(({ cleanup }) => {
    navigator.geolocation.getCurrentPosition(onEvent, onEventError, options);
    watchId.value = navigator.geolocation.watchPosition(
      onEvent,
      onEventError,
      options
    );

    cleanup(() => {
      if (watchId.value) {
        navigator.geolocation.clearWatch(watchId.value);
      }
    });
  });
  return store;
};
