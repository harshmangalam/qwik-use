import { component$ } from "@builder.io/qwik";
import { useGeolocation } from "./hooks/use-geolocation";
import { useBattery } from "./hooks/use-battery";
export default component$(() => {
  const geolocation = useGeolocation();
  const batterySig = useBattery();
  return (
    <>
      <head>
        <meta charSet="utf-8" />
        <title>Qwik Blank App</title>
      </head>
      <body
        style={{ maxWidth: "1200px", padding: "24px 16px", margin: "auto" }}
      >
        <h1>Qwik Use</h1>

        <h2>Geolocation Hooks</h2>
        <pre>{JSON.stringify(geolocation, null, 4)}</pre>

        <h2>Battery Hooks</h2>
        <pre>{JSON.stringify(batterySig.value, null, 4)}</pre>
      </body>
    </>
  );
});
