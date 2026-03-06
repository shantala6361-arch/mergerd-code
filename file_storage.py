import os
import aiofiles
from fastapi import UploadFile
from pathlib import Path

UPLOAD_DIR = os.getenv("UPLOAD_DIR", "./uploads")

async def save_upload_file(
    upload_file: UploadFile,
    subdir: str,
    filename: str
) -> str:
    dir_path = Path(UPLOAD_DIR) / subdir
    dir_path.mkdir(parents=True, exist_ok=True)

    file_path = dir_path / filename
    async with aiofiles.open(file_path, "wb") as buffer:
        content = await upload_file.read()
        await buffer.write(content)

    return str(Path(subdir) / filename)

async def save_file_from_bytes(
    content: bytes,
    subdir: str,
    filename: str
) -> str:
    dir_path = Path(UPLOAD_DIR) / subdir
    dir_path.mkdir(parents=True, exist_ok=True)

    file_path = dir_path / filename
    async with aiofiles.open(file_path, "wb") as buffer:
        await buffer.write(content)

    return str(Path(subdir) / filename)

def get_file_path(relative_path: str) -> Path:
    return Path(UPLOAD_DIR) / relative_path

def delete_file(relative_path: str):
    file_path = get_file_path(relative_path)
    if file_path.exists():
        file_path.unlink()