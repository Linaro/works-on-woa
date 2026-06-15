import json
import subprocess
import shutil
from pathlib import Path

# Prompt to format app names:
# "Take the given app names and return them in this exact format:
# app_names = [
# "App Name 1",
# "App Name 2",
# ...
# ]
# Rules:
# - Use double quotes
# - Preserve exact spelling and casing
# - One item per line
# - No extra text before or after"

# ---- INPUT ----
app_names = [
"Notion",
"Mail Hub",
"Blip Transfer",
"Shotcut",
"Sakura photo Viewer",
"foobar2000",
"MakeCode for Adafruit",
"Wondershare filmora",
"VPN Proxy Browser: Unlimited",
"Unigram",
"Sketchbook Pro",
"Rust",
"Nebo",
"GroupMe",
"Facebook Messenger",
"colored Note",
"AutoCAD - DWG Viewer & Editor",
"Adobe Audition",
"1Password",
"3D Viewer",
".NET Runtime",
"Python",
"WireShark",
"WinObj",
"WinDBG",
"Stremio",
"ProcDump",
"McAfee Total Protection",
"McAfee LiveSafe",
"Margareta Certificate Management",
"LuaJIT",
"LoadOrder",
"Hitman pro",
"Git",
"GHC",
"Electron",
"Draw.io",
"DART",
"Chromium",
"BlueBeam Revu",
"Reaper",
"Leonardo",
"zotero",
"Mattermost",
"Everything",
"OpenText MicroFocus Universal Discovery",
"PDF-Xchange Editor",
"PDF24 Creator",
"Obsidian"
]

app_set = set(name.lower() for name in app_names)

# ===== Paths =====
# Run this script from the scripts folder
PROJECTS_JSON = Path("../src/data/content/projects.json").resolve()
BACKUP_JSON = Path("projects_backup.json").resolve()

# ---- BACKUP ----
shutil.copyfile(PROJECTS_JSON, BACKUP_JSON)

# ---- LOAD ----
with open(PROJECTS_JSON, "r", encoding="utf-8") as f:
    data = json.load(f)

# ---- PROCESS ----
changed_apps = []
not_found = set(app_set)

for app in data:
    name = app.get("name", "").lower()

    if name in app_set:
        not_found.discard(name)
        if app.get("emulationType") != "native":
            app["emulationType"] = "native"
            changed_apps.append(app.get("name"))

# ---- SAVE ----
with open(PROJECTS_JSON, "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

# ---- GIT DIFF ----
print("\n--- Git Diff Preview ---\n")
subprocess.run(["git", "diff", str(PROJECTS_JSON)])

# ---- OUTPUT ----
print("\n✅ Apps updated:")
for app in changed_apps:
    print(f"- {app}")

print(f"\nTotal updated: {len(changed_apps)}")

print("\n❌ Apps not found:")
for app in sorted(not_found):
    print(f"- {app}")