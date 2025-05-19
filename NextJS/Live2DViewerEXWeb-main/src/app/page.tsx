'use client'
import Image from 'next/image';
import images from '../../public/live2d/steam_models/img';
import { useRouter } from 'next/navigation';

const Home = () => {
  const router = useRouter();
  // Đảo ngược thứ tự của mảng images
  const reversedImages = [...images].reverse();

  return (
    <div className="flex flex-wrap mb-16">
      {reversedImages.map((image) => (
        <div key={image.id} className="w-1/2 p-[2px]">
          <div className="w-full aspect-w-1 aspect-h-1 relative cursor-pointer"
            onClick={() => {
              router.push(`/live2d/edit/?id=${image.id}`);
              window.sessionStorage.setItem('reload', 'true');
            }}
          >
            <Image
              src={image.src}
              alt={image.alt}
              width={512}
              height={512}
              priority={true}
              className="w-auto rounded-sm h-auto"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Home;
