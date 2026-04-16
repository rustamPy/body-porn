#!/usr/bin/env python3
import csv
import sys

from transformers import pipeline

translator = pipeline("translation", model="Helsinki-NLP/opus-mt-en-ru")


def translate_text(text):
    """Translate text to Russian"""
    try:
        result = translator(text, max_length=512)
        if result and len(result) > 0:
            return result[0]["translation_text"]
        return text
    except Exception as e:
        print(f"Translation error: {e}", file=sys.stderr)
        return text


# Read CSV
input_file = "healthy-recipes.csv"
output_file = "healthy-recipes-ru.csv"

rows = []
with open(input_file, "r", encoding="utf-8") as f:
    reader = csv.reader(f)
    headers = next(reader)
    rows = list(reader)

print(f"Translating {len(rows)} recipes to Russian...", file=sys.stderr)

# Translate rows
translated_rows = []
for i, row in enumerate(rows):
    if (i + 1) % 10 == 0:
        print(f"Translated {i + 1}/{len(rows)}", file=sys.stderr)

    recipe_name = row[0]
    meal_type = row[1]  # Keep unchanged
    instructions = row[7]

    # Translate recipe name and instructions
    translated_name = translate_text(recipe_name)
    translated_instructions = translate_text(instructions)

    translated_rows.append(
        [
            translated_name,
            meal_type,
            row[2],  # Calories
            row[3],  # Protein_g
            row[4],  # Fiber_g
            row[5],  # Carbs_g
            row[6],  # Fat_g
            translated_instructions,
        ]
    )

# Write to file
with open(output_file, "w", encoding="utf-8", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(headers)
    writer.writerows(translated_rows)

print("Translation complete!", file=sys.stderr)
