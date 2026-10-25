import type { CSSProperties, ImgHTMLAttributes } from 'react';
import { asset, type Photo } from '../data';
import photoLayout from '../data/photo-layout.json';

type Layout = { thumbWidth: number; previewWidth: number; previewHeight: number; focal?: number[] };
type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet' | 'width' | 'height'> & {
  photo: Photo;
  framed?: boolean;
};

export default function JournalImage({
  photo,
  framed = false,
  sizes = '(max-width: 760px) calc(100vw - 44px), 400px',
  alt = photo.caption,
  loading = 'lazy',
  style,
  ...props
}: Props) {
  const layout = (photoLayout as Record<string, Layout>)[photo.id];
  const preview = asset(`assets/previews/${photo.id}.webp`);
  const imageStyle: CSSProperties = framed && layout?.focal
    ? { objectPosition: `${layout.focal[0]}% ${layout.focal[1]}%`, ...style }
    : style ?? {};

  return (
    <img
      {...props}
      src={preview}
      srcSet={layout ? `${asset(photo.thumb)} ${layout.thumbWidth}w, ${preview} ${layout.previewWidth}w, ${asset(photo.src)} ${photo.width}w` : undefined}
      sizes={sizes}
      alt={alt}
      width={photo.width}
      height={photo.height}
      loading={loading}
      decoding="async"
      style={imageStyle}
    />
  );
}
