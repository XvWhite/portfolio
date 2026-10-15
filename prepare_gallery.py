from pathlib import Path
import json, re
from PIL import Image, ImageOps
Image.MAX_IMAGE_PIXELS = 300_000_000

root = Path('E:/codex-no/郭春浩作品集文件')
dest = Path('E:/codex-no/portfolio/public/images/gallery')
groups = {
 'scene': root/'Nana Jacqueline/NJ图片/场景模特',
 'looks': root/'Nana Jacqueline/NJ图片/look图',
 'tear': root/'Nana Jacqueline/NJ图片/Tear Drop系列首饰海报',
 'toposh': root/'TOPOSH品牌珠宝/TOPOSH/品牌海报',
}
manifest = {}
for name, folder in groups.items():
    target = dest/name
    target.mkdir(parents=True, exist_ok=True)
    files = sorted((p for p in folder.iterdir() if p.suffix.lower() in ['.png','.jpg','.jpeg','.webp']), key=lambda p: [int(t) if t.isdigit() else t for t in re.split(r'(\d+)', p.name)])
    items = []
    for index, path in enumerate(files):
        with Image.open(path) as original:
            im = ImageOps.exif_transpose(original).convert('RGB')
            im.thumbnail((2200,2200), Image.Resampling.LANCZOS)
            filename = f'{index+1:02}.webp'
            im.save(target/filename, 'WEBP', quality=90, method=4)
            items.append({'src':f'/images/gallery/{name}/{filename}', 'alt':path.stem, 'title':path.stem, 'source':path.name, 'width':im.width, 'height':im.height})
    manifest[name] = items
Path('E:/codex-no/portfolio/src/gallery-data.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
print({key:len(value) for key,value in manifest.items()})
