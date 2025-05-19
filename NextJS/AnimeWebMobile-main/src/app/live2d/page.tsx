'use client'
import Image from 'next/image';
import { motion } from 'framer-motion';
import images from '../../../public/live2d/steam_models/img';
import { useRouter } from 'next/navigation';

const Home = () => {
    const router = useRouter();
    const reversedImages = [...images].reverse();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: 'spring',
                stiffness: 100
            }
        }
    };

    return (
        <motion.div
            className="flex flex-wrap mb-16"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {reversedImages.map((image) => (
                <motion.div
                    key={image.id}
                    className="w-1/2 p-[2px]"
                    variants={itemVariants}
                >
                    <div
                        className="w-full aspect-w-1 aspect-h-1 relative cursor-pointer"
                        onClick={() => {
                            router.push(`/live2d/show/edit/?id=${image.id}`);
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
                </motion.div>
            ))}
        </motion.div>
    );
};

export default Home;
