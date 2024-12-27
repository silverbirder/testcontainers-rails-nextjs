import path from "path";
import { DockerComposeEnvironment } from "testcontainers";

const API_PORT = 3000;

export const setupApiContainer = async () => {
  const apiPath = path.resolve(__dirname, "../../../apps/api");
  const apiComposeFileName = "docker-compose.yml";
  const containerSuffix = `_${Date.now()}`;
  const dbPort = `${Math.floor(10000 + Math.random() * 50000)}`;
  const apiPort = `${Math.floor(10000 + Math.random() * 50000)}`;
  const apiEnvironment = await new DockerComposeEnvironment(
    apiPath,
    apiComposeFileName
  )
    .withEnvironment({
      CONTAINER_SUFFIX: containerSuffix,
      DB_PORT: dbPort,
      API_PORT: apiPort,
    })
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
