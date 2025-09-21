from llama_cloud_services.beta.classifier.client import ClassifyClient
from llama_cloud.client import AsyncLlamaCloud
import os

client = AsyncLlamaCloud(token=os.getenv["LLAMA_CLOUD_API_KEY"])
project_id = os.getenv["llama_projectID"]
organization_id = os.getenv["organization_id"]
classifier = ClassifyClient(client, project_id=project_id, organization_id=organization_id)