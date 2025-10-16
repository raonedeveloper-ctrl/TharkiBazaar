import { ImageCard } from '../components/ImageCard';
import { AdSlot } from '../components/AdSlot';
import { RotatingAdSlot } from '../components/RotatingAdSlot';
import { placeholderImages } from '../lib/placeholder-images';

const LEFT_COLUMN_ADS = [
  { slotId: 'left-1', key: 'd36c2f4dfc3863469f3b2132607617c6', width: 160, height: 600 },
  { slotId: 'left-2', key: '9ab75744061e372e002498c8b7270b8e', width: 160, height: 300 },
  { slotId: 'left-3', key: 'd36c2f4dfc3863469f3b2132607617c6', width: 160, height: 600 },
  { slotId: 'left-4', key: '9ab75744061e372e002498c8b7270b8e', width: 160, height: 300 },
  { slotId: 'left-5', key: 'd36c2f4dfc3863469f3b2132607617c6', width: 160, height: 600 },
] as const;

const RIGHT_STATIC_ADS = [
  { slotId: 'right-3', key: '72b7232ca3ae40f63836f3c472360365', width: 300, height: 250 },
  { slotId: 'right-4', key: 'b7193586f4106b807d27a90a71d22c37', width: 320, height: 50 },
  { slotId: 'right-5', key: '72b7232ca3ae40f63836f3c472360365', width: 300, height: 250 },
] as const;

const RIGHT_ROTATION = [
  { key: '72b7232ca3ae40f63836f3c472360365', width: 300, height: 250 },
  { key: 'b7193586f4106b807d27a90a71d22c37', width: 320, height: 50 },
];

const NATIVE_CONFIG = {
  scriptSrc: 'https://pl27734286.revenuecpmgate.com/2e5cb186c4b38f8965debe7933cde6dd/invoke.js',
  containerId: 'container-2e5cb186c4b38f8965debe7933cde6dd',
};

export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-10 lg:px-6">
      <header className="text-center">
        <h1 className="text-3xl font-black uppercase tracking-[0.35em] text-slate-800 sm:text-4xl">TharkiBazaar</h1>
        <p className="mt-3 text-sm text-slate-500">
          Blurred teasers, one-click Terabox drops, and aggressive monetisation—optimised for both desktop and mobile.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-[210px_minmax(0,1fr)_320px]">
        <aside className="hidden flex-col gap-4 lg:flex">
          {LEFT_COLUMN_ADS.map((ad) => (
            <AdSlot
              key={ad.slotId}
              slotId={ad.slotId}
              type="highperformance"
              config={{ key: ad.key, width: ad.width, height: ad.height }}
            />
          ))}
        </aside>

        <div className="flex flex-col gap-6">
          <section className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
            {placeholderImages.map((image) => (
              <ImageCard key={image.id} image={image} />
            ))}
          </section>

          <AdSlot slotId="native-1" type="native" config={NATIVE_CONFIG} />
        </div>

        <aside className="hidden flex-col gap-4 lg:flex">
          <RotatingAdSlot slotId="right-1" items={RIGHT_ROTATION} />
          <AdSlot slotId="right-2" type="highperformance" config={{ key: '518bb62c4fe828a47ab0530ed37ad2bf', width: 468, height: 60 }} />
          {RIGHT_STATIC_ADS.map((ad) => (
            <AdSlot
              key={ad.slotId}
              slotId={ad.slotId}
              type="highperformance"
              config={{ key: ad.key, width: ad.width, height: ad.height }}
            />
          ))}
        </aside>
      </section>
    </main>
  );
}
