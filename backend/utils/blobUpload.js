import dotenv from "dotenv";
dotenv.config();

let blobServiceClient = null;

async function getBlobClient() {
  if (!blobServiceClient) {
    const { BlobServiceClient } = await import("@azure/storage-blob");
    const connStr = process.env.AZURE_STORAGE_CONNECTION_STRING;
    if (!connStr) {
      throw new Error("Azure Storage connection string is not configured");
    }
    blobServiceClient = BlobServiceClient.fromConnectionString(connStr);
  }
  return blobServiceClient;
}

export const uploadExcelFileToAzure = async (Buffer, fileName) => {
  try {
    const client = await getBlobClient();
    const containerClient = client.getContainerClient(
      process.env.AZURE_CONTAINER_NAME || "practitioner-images"
    );
    const newFileName = `${Date.now()}-${fileName}`;
    const blockBlobClient = containerClient.getBlockBlobClient(
      `embrace-img/${newFileName}`
    );

    await blockBlobClient.uploadData(Buffer, {
      blobHTTPHeaders: {
        blobContentType: "application/octet-stream",
      },
    });
    const blobUrl = blockBlobClient.url;
    console.log(`Blob URL: ${blobUrl}`);
    console.log(`File ${newFileName} uploaded to Azure Blob Storage`);
    return blobUrl;
  } catch (err) {
    console.log(err);
    throw new Error(
      `Failed to upload file to Azure Blob Storage: ${err.message}`
    );
  }
};
