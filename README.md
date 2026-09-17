# eazyAI static site

## Video processing

Source inspected: `public/video/hero-interview.mp4` (11.219596 seconds, 1920×1080). The checked-in asset sequences contain exactly 140 frames each, sampled at 12.478 fps (140 / duration): `public/frames/desktop` at 1440×810 / WebP quality 70, and `public/frames/mobile` at 720×1280 / WebP quality 68. Their combined payload is approximately 4.2 MB.

```powershell
ffmpeg -i public/video/hero-interview.mp4 -an -vf "fps=12.478,scale=1440:-2:flags=lanczos" -frames:v 140 -c:v libwebp -quality 70 -compression_level 6 -preset picture public/frames/desktop/frame_%04d.webp
ffmpeg -i public/video/hero-interview.mp4 -an -vf "fps=12.478,scale=720:1280:force_original_aspect_ratio=increase:flags=lanczos,crop=720:1280" -frames:v 140 -c:v libwebp -quality 68 -compression_level 6 -preset picture public/frames/mobile/frame_%04d.webp
```

The implementation shows the source video as a graceful fallback for reduced-motion, data-saver, failed-frame, and no-JavaScript cases. The actual image-sequence payload is below 8 MB.

### Alternate video seeking mode

Use this only for a shorter sequence or when hosting hundreds of image files is not acceptable. All-intra files seek much more smoothly but can be larger:

```powershell
ffmpeg -i input.mp4 -an -c:v libx264 -preset medium -crf 22 -g 1 -keyint_min 1 -movflags +faststart public/video/hero-scrub.mp4
ffmpeg -i input.mp4 -an -c:v libvpx-vp9 -crf 30 -b:v 0 -g 1 public/video/hero-scrub.webm
```

## Tunable constants

`frameCount` controls sequence length; `scrollLength` controls pinned scroll distance; `scrub` controls catch-up smoothing; `textTimings` controls the normalized start/end positions of each hero message.

## Test checklist

Check Chrome, Safari desktop/iOS, Firefox, Android Chrome; reduced-motion; slow 3G; no-JavaScript and no-GSAP fallbacks; responsive resize; and a complete scroll up/down sequence.
