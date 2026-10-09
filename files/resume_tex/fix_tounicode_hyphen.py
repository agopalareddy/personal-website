import pikepdf
import re
import sys

path = sys.argv[1]
pdf = pikepdf.open(path)

count = 0
for page in pdf.pages:
    resources = page.get("/Resources", None)
    if resources is None:
        continue
    fonts = resources.get("/Font", None)
    if fonts is None:
        continue
    for name, font in fonts.items():
        tu = font.get("/ToUnicode", None)
        if tu is None:
            continue
        data = bytes(tu.read_bytes()).decode("latin-1")
        # Replace any bfchar/bfrange target mapping to <2010> with <002D>
        # Handles lines like: <XX> <2010>  or  <XX> <XX> <2010>
        new_data, n = re.subn(r"<2010>", "<002D>", data)
        if n > 0:
            tu.write(new_data.encode("latin-1"))
            count += n
            print(f"Patched {n} occurrence(s) of <2010> -> <002D> in font {name}")

pdf.save(path.replace(".pdf", "_fixed.pdf"))
print(f"Total patches: {count}")
