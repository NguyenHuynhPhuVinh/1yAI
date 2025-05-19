'use client'

import { useState } from 'react';
import useSWRInfinite from 'swr/infinite';
import Image from 'next/image';
import Link from 'next/link';
import { KitsuResponse } from '../types/types';
import 'animate.css';
import { motion } from 'framer-motion';
import React, { useEffect, useRef } from 'react';
import posterPlaceholder from '../../public/poster-placeholder.jpg';

const fetcher = (url: string) => fetch(url).then(res => res.json());
const PAGE_SIZE = 20;

interface Props {
  subtype: string;
  year: string;
  season: string;
}

const KitsuList: React.FC<Props> = ({ subtype, year, season }) => {
  const [animeList, setAnimeList] = useState<KitsuResponse['data']>([]);
  const [seenAnimeKeys, setSeenAnimeKeys] = useState<Set<string>>(new Set());
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const getKey = (pageIndex: number, previousPageData: KitsuResponse | null) => {
    if (previousPageData && !previousPageData.data.length) return null;
    return `https://kitsu.io/api/edge/anime?filter[season]=${season}&filter[seasonYear]=${year}&filter[subtype]=${subtype}&page[limit]=${PAGE_SIZE}&page[offset]=${pageIndex * PAGE_SIZE}`;
  };

  const { data, error, size, setSize, isValidating } = useSWRInfinite<KitsuResponse>(getKey, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    shouldRetryOnError: false,
  });

  useEffect(() => {
    setAnimeList([]);
    setSeenAnimeKeys(new Set());
    setIsLoadingMore(false);
    setSize(1);
  }, [subtype, setSize]);

  useEffect(() => {
    if (data) {
      let newAnimeList: KitsuResponse['data'][0][] = [];
      data.forEach(page => {
        newAnimeList = [...newAnimeList, ...page.data];
      });

      const filteredAnimeList = newAnimeList.filter(anime => {
        if (!seenAnimeKeys.has(anime.id)) {
          seenAnimeKeys.add(anime.id);
          return true;
        }
        return false;
      });

      const newData = filteredAnimeList.filter(anime => !animeList.some(a => a.id === anime.id));

      if (newData.length > 0) {
        setAnimeList(prevList => [...prevList, ...newData]);
      }

      if (data[data.length - 1].data.length < PAGE_SIZE && !isValidating) {
        setIsLoadingMore(false);
      } else {
        setIsLoadingMore(true);
        setSize(size => size + 1);
      }
    }
  }, [data, setSize, seenAnimeKeys, isValidating, animeList]);

  if (error) return <div>Không thể tải dữ liệu</div>;
  if (!data) return (
    <div className="grid bg-black grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {[...Array(PAGE_SIZE)].map((_, index) => (
        <div key={index} className="animate-pulse overflow-hidden px-4 py-3">
          <div className="relative w-full h-0 pb-[142.85%] rounded-xl bg-gray-300"></div>
          <div className="mt-2 h-4 bg-gray-300 rounded"></div>
        </div>
      ))}
    </div>
  );

  return (
    <motion.div
      className="grid bg-gradient-to-r from-purple-900 to-indigo-900 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {animeList.map((anime, index) => (
        <motion.div
          key={anime.id}
          className="relative group"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Link href={`/anime/?id=${anime.id}`}>
            <div className="relative w-full h-0 pb-[142.85%] rounded-xl overflow-hidden shadow-lg transform transition duration-300 group-hover:scale-105">
              <Image
                src={anime.attributes.posterImage.large}
                alt={anime.attributes.titles.en_jp || anime.attributes.titles.en}
                width={200}
                height={300}
                className="w-full h-auto object-cover rounded-lg transition-transform duration-300 ease-in-out group-hover:scale-105"
              />
              <ParticleEffect season={season} />
            </div>
            <h3 className="text-sm font-semibold mt-2 text-white group-hover:text-red-400 transition duration-300 overflow-hidden whitespace-nowrap text-ellipsis">
              {anime.attributes.titles.en_jp || anime.attributes.titles.en}
            </h3>
            <div className="flex justify-center items-center mt-1">
              <motion.h6
                className={`text-xs inline text-white rounded-full px-3 py-1 font-semibold ${getStatusColor(anime.attributes.status)}`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {getStatusText(anime.attributes.status)}
              </motion.h6>
            </div>
          </Link>
        </motion.div>
      ))}
      {isLoadingMore && (
        <div className="animate-pulse overflow-hidden px-4 py-3">
          <div className="relative w-full h-0 pb-[142.85%] rounded-xl bg-gray-300"></div>
          <div className="mt-2 h-4 bg-gray-300 rounded"></div>
        </div>
      )}
    </motion.div>
  );
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "current": return "bg-green-500";
    case "finished": return "bg-blue-500";
    case "upcoming": return "bg-gray-400";
    case "tba": return "bg-red-500";
    default: return "bg-yellow-400";
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "current": return "Đang Phát Sóng";
    case "finished": return "Đã Kết Thúc";
    case "upcoming": return "Chuẩn Bị Chiếu";
    case "tba": return "Chưa Rõ";
    default: return "Sắp Ra Mắt";
  }
};

const ParticleEffect: React.FC<{ season: string }> = ({ season }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Xóa toàn bộ canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Hủy animation frame cũ nếu có
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    // Đặt lại kích thước canvas
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Tạo mới hoàn toàn các particle
    particlesRef.current = [];
    for (let i = 0; i < 30; i++) {
      particlesRef.current.push(new Particle(canvas, season));
    }

    function animate() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesRef.current.forEach(particle => particle.update(ctx));
      animationRef.current = requestAnimationFrame(animate);
    }

    // Bắt đầu animation mới
    animate();

    // Cleanup function
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [season]);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />;
};

class Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  shape: string;

  constructor(canvas: HTMLCanvasElement, season: string) {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 5 + 2; // Tăng kích thước lên một chút
    this.speedX = Math.random() * 3 - 1.5;
    this.speedY = Math.random() * 3 - 1.5;

    switch (season.toLowerCase()) {
      case 'spring':
        this.color = 'rgba(255, 192, 203, 0.8)'; // Pink for cherry blossoms
        this.shape = 'circle';
        break;
      case 'summer':
        this.color = 'rgba(255, 255, 0, 0.8)'; // Yellow for sun
        this.shape = 'star';
        break;
      case 'fall':
        this.color = 'rgba(255, 165, 0, 0.8)'; // Orange for leaves
        this.shape = 'leaf';
        break;
      case 'winter':
        this.color = 'rgba(255, 255, 255, 0.8)'; // White for snow
        this.shape = 'snowflake';
        break;
      default:
        this.color = 'rgba(255, 255, 255, 0.8)';
        this.shape = 'circle';
    }
  }

  update(ctx: CanvasRenderingContext2D) {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.size > 0.2) this.size -= 0.1;

    this.draw(ctx);
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.size / 3;
    ctx.beginPath();

    switch (this.shape) {
      case 'circle':
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 'star':
        this.drawStar(ctx);
        ctx.fill();
        break;
      case 'leaf':
        this.drawLeaf(ctx);
        ctx.fill();
        break;
      case 'snowflake':
        this.drawSnowflake(ctx);
        // Không cần ctx.fill() ở đây vì snowflake sẽ được vẽ bằng stroke
        break;
    }
  }

  drawStar(ctx: CanvasRenderingContext2D) {
    const spikes = 5;
    const outerRadius = this.size;
    const innerRadius = this.size / 2;

    let rot = Math.PI / 2 * 3;
    let x = this.x;
    let y = this.y;
    let step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(this.x, this.y - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = this.x + Math.cos(rot) * outerRadius;
      y = this.y + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = this.x + Math.cos(rot) * innerRadius;
      y = this.y + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(this.x, this.y - outerRadius);
    ctx.closePath();
  }

  drawLeaf(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(Math.PI / 4);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(this.size, -this.size, 2 * this.size, -this.size, 2 * this.size, 0);
    ctx.bezierCurveTo(2 * this.size, this.size, this.size, this.size, 0, 0);
    ctx.fill();
    ctx.restore();
  }

  drawSnowflake(ctx: CanvasRenderingContext2D) {
    const numberOfSpokes = 6;
    const spokeLength = this.size;

    ctx.save();
    ctx.translate(this.x, this.y);

    for (let i = 0; i < numberOfSpokes; i++) {
      ctx.rotate(Math.PI * 2 / numberOfSpokes);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, spokeLength);
      ctx.stroke();

      // Thêm nhánh phụ
      ctx.beginPath();
      ctx.moveTo(0, spokeLength * 0.3);
      ctx.lineTo(spokeLength * 0.2, spokeLength * 0.5);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, spokeLength * 0.6);
      ctx.lineTo(-spokeLength * 0.2, spokeLength * 0.8);
      ctx.stroke();
    }

    ctx.restore();
  }
}

export default KitsuList;