@echo off
cd /d "E:\codex-no\portfolio"
if not exist "runtime" mkdir "runtime"
"D:\Node.JS\node.exe" "node_modules\vite\bin\vite.js" --host 127.0.0.1 --port 5173 >> "runtime\preview.log" 2>> "runtime\preview-error.log"
