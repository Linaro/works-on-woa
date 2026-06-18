import json
from pathlib import Path

# ===== Paths =====
# Run this script from the scripts folder
NEW_JSON = Path("China_Apps_with_slugs.json")  # name of the newly generated JSON file
PROJECTS_JSON = Path("../src/data/content/projects.json").resolve()


def load_json(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def save_json(path, data):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def main():
    # Load files
    new_data = load_json(NEW_JSON)
    projects_data = load_json(PROJECTS_JSON)

    # Existing values in projects.json
    existing_slugs = {str(item.get("slug", "")).strip().lower() for item in projects_data}
    existing_names = {str(item.get("name", "")).strip().lower() for item in projects_data}

    to_append = []
    already_exists = []

    for item in new_data:
        slug = str(item.get("slug", "")).strip().lower()
        name = str(item.get("name", "")).strip().lower()

        # Duplicate check
        if slug in existing_slugs or name in existing_names:
            already_exists.append(item.get("name", ""))
        else:
            to_append.append(item)
            if slug:
                existing_slugs.add(slug)
            if name:
                existing_names.add(name)

    # Append only new entries
    if to_append:
        projects_data.extend(to_append)
        save_json(PROJECTS_JSON, projects_data)

    # Print summary
    print("\n===== Summary =====")
    print(f"New apps added: {len(to_append)}")
    print(f"Already existing apps skipped: {len(already_exists)}")

    if to_append:
        print("\nAdded apps:")
        for item in to_append:
            print(f"- {item.get('name', '')}")

    if already_exists:
        print("\nHey, these apps are already in the file:")
        for name in already_exists:
            print(f"- {name}")


if __name__ == "__main__":
    main()