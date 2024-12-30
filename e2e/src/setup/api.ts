import path from "path";
import { DockerComposeEnvironment, RandomUuid } from "testcontainers";
import { writeFileSync, unlinkSync } from "fs";
import { join } from "path";

const API_PORT = 3000;

export const setupApiContainer = async () => {
  const apiPath = path.resolve(__dirname, "../../../apps/api");
  const apiComposeFileName = "docker-compose.yml";
  const uuid = new RandomUuid();
  const containerSuffix = `_${uuid.nextUuid()}`;
  const apiEnvironment = await new DockerComposeEnvironment(
    apiPath,
    apiComposeFileName
  )
    .withEnvironment({
      CONTAINER_SUFFIX: containerSuffix,
    })
    .up();

  const apiContainer = apiEnvironment.getContainer(
    `testcontainers_api${containerSuffix}`
  );
  const dbContainer = apiEnvironment.getContainer(
    `testcontainers_api_db${containerSuffix}`
  );

  const networks = apiContainer.getNetworkNames();
  const networkName = networks[0] ?? "";
  const ip = apiContainer.getIpAddress(networkName);
  const host = apiContainer.getHost();
  const port = apiContainer.getMappedPort(API_PORT);

  const executeSqlFile = async (sqlContent: string, fileName: string) => {
    const tempSqlFile = join(__dirname, fileName);
    writeFileSync(tempSqlFile, sqlContent, "utf-8");
    try {
      await dbContainer.copyFilesToContainer([
        { source: tempSqlFile, target: `/temp.sql` },
      ]);
      const result = await dbContainer.exec([
        "mysql",
        "-uroot",
        "-proot",
        "-e",
        "source /temp.sql",
      ]);
      return result.output.trim();
    } finally {
      unlinkSync(tempSqlFile);
    }
  };

  return {
    apiContainer,
    dbContainer,
    executeSqlFile,
    apiInternalUrl: `http://${ip}:${API_PORT}`,
    apiPublicUrl: `http://${host}:${port}`,
    networkName,
    teardown: async () => {
      await apiEnvironment.down({ removeVolumes: true });
    },
  };
};
