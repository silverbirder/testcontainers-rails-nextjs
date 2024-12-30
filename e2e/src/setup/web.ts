import path from "path";
import { GenericContainer, RandomUuid } from "testcontainers";

const WEB_PORT = 3200;

export const setupWebContainer = async (
  apiInternalUrl,
  apiPublicUrl,
  networkName
) => {
  const webPath = path.resolve(__dirname, "../../../apps/web");
  const uuid = new RandomUuid();
  const containerSuffix = `${uuid.nextUuid()}`;
  const webContainer = await (
    await GenericContainer.fromDockerfile(webPath)
      .withBuildArgs({
        API_URL: apiInternalUrl,
        NEXT_PUBLIC_API_URL: apiPublicUrl,
      })
      .build(`web:${containerSuffix}`, { deleteOnExit: true })
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
    },
  };
};
