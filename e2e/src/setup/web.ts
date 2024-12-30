import path from "path";
import { GenericContainer } from "testcontainers";

const WEB_PORT = 3200;

export const setupWebContainer = async (apiHost, networkName) => {
  const webPath = path.resolve(__dirname, "../../../apps/web");
  const webContainer = await (
    await GenericContainer.fromDockerfile(webPath)
      .withBuildArgs({ NEXT_PUBLIC_API_URL: apiHost })
      .withCache(true)
      // .build("web")
      .build("web", { deleteOnExit: true })
  )
    .withExposedPorts(WEB_PORT)
    .withNetworkMode(networkName)
    .start();

  const webPort = webContainer.getMappedPort(WEB_PORT);
  const webHost = `http://${webContainer.getHost()}:${webPort}`;

  return {
    webContainer,
    webHost,
    teardown: async () => {
      await webContainer.stop({ remove: true, removeVolumes: true });
      // await webContainer.stop();
    },
  };
};
