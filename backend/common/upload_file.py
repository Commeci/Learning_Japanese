import oci
from app.utils.file_name_creator import generate_random_filename

# OCI config 파일을 사용하여 클라이언트 초기화
config = oci.config.from_file("~/.oci/config", "DEFAULT")
object_storage_client = oci.object_storage.ObjectStorageClient(config)

# 업로드할 파일 경로와 버킷, 객체 이름 지정
namespace = object_storage_client.get_namespace().data
bucket_name = 'IchiBucket'  # 업로드할 버킷 이름

def get_extension(file_name):
    return file_name.split('/')[-1].split('.')[-1]

def file_upload(file_path):
    object_name = f'{generate_random_filename(extension=get_extension(file_path)).split("/")[-1]}'   # 업로드할 파일 경로

    # 파일을 읽고 객체로 업로드
    with open(file_path, 'rb') as file_data:
        object_storage_client.put_object(namespace, bucket_name, object_name, file_data)

    print(f"File {object_name} has been uploaded to bucket {bucket_name}.")
    
    return object_name
