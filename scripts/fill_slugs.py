import json
from pyexpat import errors
import subprocess
import sys
import re
from pathlib import Path
import pandas as pd

# ====== File paths ======
INPUT_JSON = Path("China_Apps.json")   # keep the name of json file (should be in the same folder as this file)
OUTPUT_JSON = Path("China_Apps_with_slugs.json")
OUTPUT_CSV = Path("China_Apps_with_slugs.csv")
NOTES_CSV = Path("slug_notes.csv")

# Path to generate_slug.py in the same folder
SLUG_SCRIPT = Path(__file__).with_name("generate_slug.py")


def extract_slug(output_text):
    """
    Extract slug value from output like:
      slug: birdpaper

    or:
      slug: 101birthdaycards2
      (note: ...)
    """
    match = re.search(r'^\s*slug:\s*(\S+)', output_text, re.MULTILINE)
    if match:
        return match.group(1).strip()
    raise ValueError(f"Could not extract slug from output:\n{output_text}")


def extract_note(output_text):
    """
    Extract note text if present, e.g.
      (note: '101birthdaycards' was already taken, suffixed to '101birthdaycards2')
    Returns only the text inside/including 'note: ...' or None.
    """
    match = re.search(r'^\s*\((note:.*)\)\s*$', output_text, re.MULTILINE)
    if match:
        return match.group(1).strip()
    return None


def generate_slug(name, item_type="application"):
    """
    Calls generate_slug.py and returns:
      slug, note, full_output
    """
    result = subprocess.run(
        [sys.executable, str(SLUG_SCRIPT), name, "--type", item_type],
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace"
    )

    output = ((result.stdout or "") + "\n" + (result.stderr or "")).strip()

    if result.returncode != 0:
        raise RuntimeError(output)

    slug = extract_slug(output)
    note = extract_note(output)

    return slug, note, output


def main():
    # Load JSON
    with open(INPUT_JSON, "r", encoding="utf-8") as f:
        data = json.load(f)

    updated_count = 0
    errors = []
    note_rows = []

    total = len(data)

    for i, item in enumerate(data, start=1):
        name = str(item.get("name", "")).strip()
        item_type = str(item.get("type", "application")).strip()
        current_slug = str(item.get("slug", "")).strip()

        if not name:
            errors.append({
                "row": i,
                "name": "",
                "error": "Missing name"
            })
            print(f"[{i}/{total}] ERROR -> Missing name")
            continue

        # Only fill if slug is empty
        if not current_slug:
            try:
                slug, note, full_output = generate_slug(name, item_type)
                item["slug"] = slug
                updated_count += 1

                if note:
                    note_rows.append({
                        "row": i,
                        "name": name,
                        "slug": slug,
                        "note": note
                    })
                    print(f"[{i}/{total}] OK NOTE -> {name} --> {slug}")
                else:
                    print(f"[{i}/{total}] OK -> {name} --> {slug}")

            except Exception as e:
                errors.append({
                    "row": i,
                    "name": name,
                    "error": str(e)
                })
                print(f"[{i}/{total}] ERROR -> {name}: {e}")

    # Save updated JSON
    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    # Save updated CSV
    df = pd.DataFrame(data)

    if "categories" in df.columns:
        df["categories"] = df["categories"].apply(
            lambda x: ", ".join(x) if isinstance(x, list) else x
        )

    df.to_csv(OUTPUT_CSV, index=False, encoding="utf-8-sig")

    # Save note rows
    if note_rows:
        notes_df = pd.DataFrame(note_rows)
        notes_df.to_csv(NOTES_CSV, index=False, encoding="utf-8-sig")
    else:
        # create empty file with headers if no notes found
        pd.DataFrame(columns=["row", "name", "slug", "note"]).to_csv(
            NOTES_CSV, index=False, encoding="utf-8-sig"
        )

    print("\nDone.")
    print(f"Slugs filled: {updated_count}")
    print(f"Updated JSON saved to: {OUTPUT_JSON}")
    print(f"Updated CSV saved to: {OUTPUT_CSV}")
    print(f"Slug notes saved to: {NOTES_CSV}")


    if errors:
        print("\nErrors:")
        for err in errors:
            print(f"Row {err['row']} | {err['name']} | {err['error']}")


if __name__ == "__main__":
    main()