# generate_slug.py

Generates URL-safe slugs for new entries in `projects.json`. The tool follows existing conventions: **games** use hyphen-separated slugs (`7-days-to-die`), while **applications** remove spaces entirely (`101birthdaycards`). Non-ASCII characters are stripped, `&` becomes `and`, `+` becomes `plus`, and names with CJK characters plus an English translation in parentheses are handled automatically. If the generated slug already exists in `projects.json`, the tool appends a numeric suffix and displays the existing entry for reference.

No external dependencies are required — the script uses only the Python 3 standard library.

## Usage

```bash
# Generate a slug for an application
python3 scripts/generate_slug.py "My New App" --type application

# Generate a slug for a game
python3 scripts/generate_slug.py "Cool Game" --type game

# Preview the slug without checking uniqueness
python3 scripts/generate_slug.py "Cool Game" --type game --dry-run

# Use a custom path to projects.json
python3 scripts/generate_slug.py "My App" --type application --json-path /path/to/projects.json
```
