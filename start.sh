#!/bin/bash
cd /home/u189057706/public_html/convertter || exit
echo "Iniciando o Node.js..." >> /home/u189057706/public_html/convertter/start.log
/usr/bin/node src/server.js >> /home/u189057706/public_html/convertter/start.log 2>&1