import asyncio
from utils.file_storage import save_file_from_bytes, get_file_path

async def test():
    content = b"Hello S3! This is a test."
    filename = f"test_outline_{int(asyncio.get_event_loop().time())}.pdf"
    rel_path = await save_file_from_bytes(content, "outlines", filename)
    print(f"Saved to: {rel_path}")

    full_path = get_file_path(rel_path)
    print(f"Full path: {full_path}")
    assert full_path.exists()

if __name__ == "__main__":
    asyncio.run(test())