import { component$ } from "@builder.io/qwik";
import { useGeolocation } from "./hooks/use-geolocation";

export default component$(() => {
  const geolocation = useGeolocation();
  return (
    <>
      <head>
        <meta charSet="utf-8" />
        <title>Qwik Blank App</title>
      </head>
      <body>
        <h1>Qwik Use</h1>

        <h2>Geolocation Hooks</h2>
        <pre>{JSON.stringify(geolocation, null, 4)}</pre>
      </body>
    </>
  );
});
