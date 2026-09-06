#!/usr/bin/env python3
"""Build the donaldjenkins.com icon set from the square identity master.

Writes icon.svg, favicon.ico and the four PNGs into OUT. It does NOT write a
manifest: the served one is static/manifest.webmanifest and there must not be
a second, competing copy.

No third-party dependencies: rasterising is macOS `sips`, and the .ico
container is written here. Change a number and rerun rather than editing
any output by hand.
"""
import os, re, struct, subprocess, sys, xml.etree.ElementTree as ET

SRC = sys.argv[1] if len(sys.argv) > 1 else 'master.svg'
OUT = sys.argv[2] if len(sys.argv) > 2 else 'out'
SVG = 'http://www.w3.org/2000/svg'
ICO_SIZES = (16, 32, 48)          # entries packed into favicon.ico
PNGS = {'apple-touch-icon.png': 180, 'icon-192.png': 192,
        'icon-512.png': 512, 'avatar-1024.png': 1024}
RENDER = 2048                      # master raster, downsampled from


def sips(*args):
    subprocess.run(['sips', *args], check=True,
                   stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)


def clean_svg(src):
    """Strip the editor's namespaces and metadata; keep title and artwork."""
    ET.register_namespace('', SVG)
    root = ET.parse(src).getroot()
    view = root.get('viewBox')
    title = (root.find(f'{{{SVG}}}title') or ET.Element('x')).text or 'Donald Jenkins'
    keep = []
    for el in root:
        tag = el.tag.split('}')[-1]
        if tag not in ('rect', 'path', 'circle', 'g', 'polygon'):
            continue
        attrs = {k: v for k, v in el.attrib.items()
                 if '{' not in k and k != 'id'}
        keep.append((tag, attrs))
    parts = [f'<svg xmlns="{SVG}" viewBox="{view}">', f'<title>{title}</title>']
    for tag, attrs in keep:
        a = ' '.join(f'{k}="{v}"' for k, v in attrs.items())
        parts.append(f'<{tag} {a}/>')
    parts.append('</svg>')
    return '\n  '.join(parts[:-1]) + '\n' + parts[-1] + '\n'


def write_ico(png_paths, dest):
    """ICO container holding PNG-compressed entries (as raffish.design does)."""
    blobs = [open(p, 'rb').read() for p in png_paths]
    n = len(blobs)
    head = struct.pack('<HHH', 0, 1, n)
    offset = 6 + 16 * n
    dirs, body = [], []
    for size, blob in zip(ICO_SIZES, blobs):
        dirs.append(struct.pack('<BBBBHHII',
                                size if size < 256 else 0,
                                size if size < 256 else 0,
                                0, 0, 1, 32, len(blob), offset))
        body.append(blob)
        offset += len(blob)
    open(dest, 'wb').write(head + b''.join(dirs) + b''.join(body))


def main():
    os.makedirs(OUT, exist_ok=True)
    icon_svg = os.path.join(OUT, 'icon.svg')
    open(icon_svg, 'w').write(clean_svg(SRC))

    # one high-resolution raster, downsampled for every size: smoother
    # antialiasing at 16 and 32px than rasterising the vector at that size
    big = os.path.join(OUT, '_master.png')
    sips('-s', 'format', 'png', SRC, '--out', big, '-Z', str(RENDER))

    tmp = []
    for size in ICO_SIZES:
        p = os.path.join(OUT, f'_ico-{size}.png')
        subprocess.run(['cp', big, p], check=True)
        sips('-Z', str(size), p)
        tmp.append(p)
    write_ico(tmp, os.path.join(OUT, 'favicon.ico'))
    for p in tmp:
        os.remove(p)

    for name, size in PNGS.items():
        p = os.path.join(OUT, name)
        subprocess.run(['cp', big, p], check=True)
        sips('-Z', str(size), p)
    os.remove(big)

    print('built into', OUT)


if __name__ == '__main__':
    main()
