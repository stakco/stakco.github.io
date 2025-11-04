STAKCO CDN FILE STRUCTURE SPECIFICATION
Version: 1.0
Last updated: 2025-10-26

----------------------------------------
1. HOSTS
----------------------------------------
All media files are stored in Google Cloud Storage under the following public endpoints:

    Images: https://storage.googleapis.com/stakco-images/
    Videos: https://storage.googleapis.com/stakco-videos/
    Audio:  https://storage.googleapis.com/stakco-audios/

----------------------------------------
2. FILE PATH STRUCTURE
----------------------------------------
Each stored file follows the same base path pattern:

    {HOST}/{USER_ID}/{PUZZLE_ID}/{FILE_NAME}

Example:
    https://storage.googleapis.com/stakco-images/109949450257686494443/20251001A2A3_3/20251001A2A3_0.png

----------------------------------------
3. PATH SEGMENTS
----------------------------------------
USER_ID:
    A unique numeric identifier assigned to the creator or owner of the puzzle.

PUZZLE_ID:
    Encodes puzzle identity and metadata.
    Example: 20251001A2A3_3
    - "20251001A2A3" → base puzzle ID (unique per puzzle)
    - "_3" → number of layers contained in the puzzle

FILE_NAME:
    Refers to the actual media file within the puzzle folder.
    Example pattern:
        {BASE_PUZZLE_ID}_{LAYER_INDEX}.png
    For n layers → files range from index 0 to n-1.

    Example:
        20251001A2A3_0.png
        20251001A2A3_1.png
        20251001A2A3_2.png

----------------------------------------
4. FUTURE EXTENSIONS
----------------------------------------
Future versions may extend the PUZZLE_ID to include additional encoded metadata such as:
    - Puzzle type or category
    - Version number
    - Display mode or format code

All extensions must preserve backward compatibility with the base path pattern.

----------------------------------------
5. PURPOSE
----------------------------------------
This specification defines how applications should:
    - Construct valid media URLs.
    - Parse URLs to identify user ownership and puzzle layer structure.
    - Maintain consistent naming and retrieval conventions across all Stakco apps.
