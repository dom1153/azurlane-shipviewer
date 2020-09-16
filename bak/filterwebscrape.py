import csv

outf = open('test.txt', 'w')
#f.write("%s\n" % str(row))
rootName = 'https://azurlane.koumakan.jp'
with open('src/shipcardscrape.csv') as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    line_count = 0
    for row in csv_reader:
        if line_count == 0:
            # print(f'Column names are {", ".join(row)}')
            line_count += 1
        else:
            # print(f'\t{row[0]} works in the {row[1]} department, and was born in {row[2]}.')
            print(row[2])
            outf.write(rootName + row[2] + "\n")
            line_count += 1
    print(f'Processed {line_count} lines.')