"""Converte o snapshot JSON público em recurso JavaScript local (sem rede)."""
from __future__ import annotations

import hashlib
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parent
source = ROOT / "data" / "board.json"
live_source = ROOT / "data" / "board-live.json"
target = ROOT / "data" / "board.js"

raw = source.read_bytes()
live_raw = live_source.read_bytes()
legacy = json.loads(raw)
board = json.loads(live_raw)
assert "data" in board and "board" in board["data"]
assert len(legacy["data"]["board"]["entities"]) == 105
assert len(board["data"]["board"]["entities"]) == 105
assert len(board["data"]["board"]["archive"]) == 61
assert len(board["data"]["board"]["collections"]) == 5

serialized = json.dumps(board, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/")
serialized_legacy = json.dumps(legacy, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/")
target.write_text("/* Catálogo público Envisioning/WKO e snapshot histórico, consulta em 2026-11-01. */\nwindow.RADAR_BOARD = " + serialized + ";\nwindow.RADAR_LEGACY = " + serialized_legacy + ";\n", encoding="utf-8")
print("Arquivo gerado:", target.name)
print("Registros atuais:", len(board["data"]["board"]["entities"]))
print("Registros no arquivo oficial:", len(board["data"]["board"]["archive"]))
print("SHA-256 do snapshot anterior:", hashlib.sha256(raw).hexdigest())
print("SHA-256 do catálogo atualizado:", hashlib.sha256(live_raw).hexdigest())
