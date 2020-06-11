@echo off
tree /f .|findstr /V "¾í" >doc_tree.md
git add .
git commit -m "commit from auto upload shell"
git push
pause