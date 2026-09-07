#!/usr/bin/env python3
"""Build the donaldjenkins.com icon set from the canonical square mark.

The master is `brand/icon/icon.svg`, which is a byte-for-byte copy of
`System/40 Identity/assets/donaldjenkins-favicon.svg` in the vault — the
canonical favicon build described in the Design charter §4. It is
transparent, carries a `prefers-color-scheme: dark` block, and uses the
palette colours Gurkha #9C9B77, Summer Green #94C7A1 and Chicago #575757.

⛔ The master is READ, never written. Earlier versions of this script also
emitted a "cleaned" icon.svg, which is how a drifted Inkscape file came to be
the source of truth and how #A8A67A / #96C8A2 reached every raster the site
served. To change the artwork, change the canonical file in the vault and
copy it here; do not edit anything in this folder by hand.

The dark-mode <style> block is stripped before rasterising, so the PNGs and
the .ico are the LIGHT rendering. Presentation attributes carry the same
colours, so nothing else changes.

No third-party dependencies: rasterising is macOS `sips`, and the .ico
container is written here. Change a number and rerun rather than editing
any output by hand.

    python3 scripts/build-icons.py brand/icon/icon.svg brand/icon
"""
import os, re, struct, subprocess, sys

SRC = sys.argv[1] if len(sys.argv) > 1 else 'brand/icon/icon.svg'
OUT = sys.argv[2] if len(sys.argv) > 2 else 'brand/icon'
ICO_SIZES = (16, 32, 48)          # entries packed into favicon.ico
PNGS = {'apple-touch-icon.png': 180, 'icon-192.png': 192,
        'icon-512.png': 512, 'avatar-1024.png': 1024}
RENDER = 2048                      # master raster, downsampled from
STYLE_RE = re.compile(r'\s*<style>.*?</style>', re.S)


def sips(*args):
    subprocess.run(['sips', *args], check=True,
                   stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)


def light_svg(src, dest):
    """The master with its dark-mode <style> removed, for rasterising."""
    svg = open(src, encoding='utf-8').read()
    stripped = STYLE_RE.sub('', svg)
    if '<style' in stripped:
        sys.exit(f'{src}: a <style> block survived stripping — check the source')
    open(dest, 'w', encoding='utf-8').write(stripped)


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

    light = os.path.join(OUT, '_light.svg')
    light_svg(SRC, light)

    # one high-resolution raster, downsampled for every size: smoother
    # antialiasing at 16 and 32px than rasterising the vector at that size
    big = os.path.join(OUT, '_master.png')
    sips('-s', 'format', 'png', light, '--out', big, '-Z', str(RENDER))

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
    os.remove(light)

    print('built into', OUT)


if __name__ == '__main__':
    main()
