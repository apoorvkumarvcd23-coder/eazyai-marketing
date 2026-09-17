# eazyAI static site

## Video processing

Source inspected: `public/video/hero-interview.mp4` (11.219596 seconds, 1920×1080). The checked-in asset sequences contain exactly 140 frames each, sampled at 12.478 fps (140 / duration): `public/frames/desktop` at 1440×810 / WebP quality 70, and `public/frames/mobile` at 720×1280 / WebP quality 68. Their combined payload is approximately 4.2 MB.

```powershell
ffmpeg -i public/video/hero-interview.mp4 -an -vf "fps=12.478,scale=1440:-2:flags=lanczos" -frames:v 140 -c:v libwebp -quality 70 -compression_level 6 -preset picture public/frames/desktop/frame_%04d.webp
ffmpeg -i public/video/hero-interview.mp4 -an -vf "fps=12.478,scale=720:1280:force_original_aspect_ratio=increase:flags=lanczos,crop=720:1280" -frames:v 140 -c:v libwebp -quality 68 -compression_level 6 -preset picture public/frames/mobile/frame_%04d.webp
```

The fixed canvas follows normal document scroll across the whole page; there is no pinned video section. Content is always visible HTML. A responsive middle-frame picture stays behind the canvas for reduced motion, data saver, failed images and no JavaScript. The actual image-sequence payload is below 8 MB.

### Alternate video seeking mode

Use this only for a shorter sequence or when hosting hundreds of image files is not acceptable. All-intra files seek much more smoothly but can be larger:

```powershell
ffmpeg -i input.mp4 -an -c:v libx264 -preset medium -crf 22 -g 1 -keyint_min 1 -movflags +faststart public/video/hero-scrub.mp4
ffmpeg -i input.mp4 -an -c:v libvpx-vp9 -crf 30 -b:v 0 -g 1 public/video/hero-scrub.webm
```

## Tunable constants

`FRAME_COUNT` controls sequence length; `CONCURRENCY` limits parallel image loads (default 3). Frames load every fourth image first, then fill the gaps. The closest available image is drawn on a requestAnimationFrame callback. Canvas resolution is capped at DPR 2; resize updates the cover crop and switches the image set at 768px.

## September redesign

Editorial typography and open, ruled layouts replace the feature-card grid. Original copy is informed by the typographic hierarchy and short statement-led structure in Awwwards' Studio Freight showcase: https://assets.awwwards.com/awards/gallery/2023/07/HOT-RIGHT-NOW-BOOK-2023.pdf . No site copy was reproduced.

Charts cite Ashby's 2026 State of Startup Hiring report: https://www.ashbyhq.com/talent-trends-report/reports/startup-hiring . Applications per hire by headcount: 298 (<25), 348 (25–49), 327 (50–99), 339 (100–300). Applicants interviewed per hire: 18 technical, 13 business. Bars share a zero baseline. Figures describe the source's startup sample, not measured product results. Scroll entrances and hover motion settle back to the correct values.

Contact opens the user's email client using the brief's info@eazyai.com address. No form-service account is configured; the previous Netlify-only form did not work on Render and has been removed.

## Test checklist

Check Chrome, Safari desktop/iOS, Firefox, Android Chrome; reduced-motion; slow 3G; no-JavaScript and no-GSAP fallbacks; responsive resize; and a complete scroll up/down sequence.
