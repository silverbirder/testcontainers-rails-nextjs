import path from "path";
import { DockerComposeEnvironment } from "testcontainers";

const API_PORT = 3000;

export const setupApiContainer = async () => {
  const apiPath = path.resolve(__dirname, "../../../apps/api");
  const apiComposeFileName = "docker-compose.yml";
  const containerSuffix = `_${Date.now()}`;
  const apiEnvironment = await new DockerComposeEnvironment(
    apiPath,
    apiComposeFileName
  )
    .withEnvironment({
      CONTAINER_SUFFIX: containerSuffix,
    })
    // 実装時は、以下のコメントを外して
    // .withNoRecreate()
    .up();

  const apiContainer = apiEnvironment.getContainer(
    `testcontainers_api${containerSuffix}`
  );
  const networks = apiContainer.getNetworkNames();
  const networkName = networks[0] ?? "";
  const ip = apiContainer.getIpAddress(networkName);
  const host = apiContainer.getHost();
  const port = apiContainer.getMappedPort(API_PORT);

  return {
    apiContainer,
    apiInternalUrl: `http://${ip}:${API_PORT}`,
    apiPublicUrl: `http://${host}:${port}`,
    networkName,
    teardown: async () => {
      await apiEnvironment.down({ removeVolumes: true });
    },
  };
};
