import os
import shutil

targets = {"chrome": "manifest.v3.json", "firefox": "manifest.v2.json"}

src_dir = "src"
dist_dir = "dist"
shared_files = ["content.js", "background.js"]

for target_name, manifest_file in targets.items():
    out_path = os.path.join(dist_dir, target_name)

    if os.path.exists(out_path):
        shutil.rmtree(out_path)
    os.makedirs(out_path, exist_ok=True)

    for file in shared_files:
        shutil.copy(os.path.join(src_dir, file), os.path.join(out_path, file))

    shutil.copy(
        os.path.join(src_dir, manifest_file), os.path.join(out_path, "manifest.json")
    )

    print(f"✅ Built {target_name} extension in '{out_path}'")
