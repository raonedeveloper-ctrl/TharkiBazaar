'use client';

import Image from 'next/image';
import Link from 'next/link';
import { EyeOff, Download as DownloadIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { PlaceholderImage } from '../lib/placeholder-images';
import { useAnalyticsContext } from '../contexts/AnalyticsProvider';

type ImageCardProps = {
  image: PlaceholderImage;
};

export function ImageCard({ image }: ImageCardProps) {
  const { trackDownload, trackOutbound } = useAnalyticsContext();

  const handleClick = () => {
    trackDownload(image.id);
    trackOutbound(image.downloadUrl);
  };

  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        <Image
          src={image.imageUrl}
          alt={image.title}
          fill
          className="object-cover blur-md"
          sizes="(min-width: 1280px) 240px, (min-width: 768px) 200px, 160px"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/60 opacity-70" />
        <div className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white">
          <EyeOff className="h-4 w-4" />
        </div>
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-foreground">{image.title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <Link href={image.downloadUrl} target="_blank" rel="noopener noreferrer nofollow">
          <Button className="w-full gap-2" onClick={handleClick}>
            <DownloadIcon className="h-4 w-4" />
            Download Now
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
