#!/usr/bin/python3

from urllib.parse import urlparse, unquote
import ntpath
import subprocess
import csv

rootName = 'https://azurlane.koumakan.jp'
out = "src/images/ShipCardImg/"
with open('src/shipcardscrape.csv') as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    line_count = 0
    for row in csv_reader:
        if line_count == 0:
            # print(f'Column names are {", ".join(row)}')
            line_count += 1
        else:
            urlFname = row[2]
            b = urlFname.encode('utf-8-sig')
            decoded = b.decode('utf-8-sig').strip()
            url = rootName + unquote(decoded)
            outfile = out + ntpath.basename(url)
            print(url)
            line_count += 1
            subprocess.run(['curl', url, "--output", outfile, "--progress-bar"])
    print(f'Processed {line_count} lines.')
    
print("done!")
