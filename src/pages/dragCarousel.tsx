import { useEffect, useState } from "react";
import { registDrag } from "@/utils";

const imageList = [
  "https://blog.kakaocdn.net/dn/dpxiAT/btqUBv6Fvpn/E8xUMncq7AVuDeOim0LrMk/img.jpg",
  "https://blog.kakaocdn.net/dn/BGT7X/btqUzvTqi5h/flp39GdJH0GU6mo7cTbbhk/img.jpg",
  "https://blog.kakaocdn.net/dn/bWnmfv/btqUBwqZvwA/3CiXGt3SR0TXoOveRJxV91/img.jpg",
  "https://blog.kakaocdn.net/dn/XsLCO/btqUL8PQLwp/NZWCU2jAYKkKSXwcohBKTK/img.jpg",
  "https://blog.kakaocdn.net/dn/bG3iVL/btqUvCZPaRL/ofIjkNWJP1mj2bOG9fie51/img.jpg",
];

const SLIDER_W = 400;
const SLIDER_H = 400;

const inrange = (v: number, min: number, max: number) => {
    if (v < min) return min;
    if (v > max) return max;
    return v;
};

const ViewBox = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transX, setTransX] = useState(0);

  return (
    <div
      className="overflow-hidden"
      style={{
        width: SLIDER_W,
        height: SLIDER_H,
      }}
    >
      <div
        className="flex"
        style={{
            transform: `translateX(${-currentIndex * SLIDER_W + transX}px)`,
            transition: `transform ${transX ? 0 : 300}ms ease-in-out 0s`,
        }}
        {...registDrag({
            onDragChange: (deltaX) => {
              setTransX(inrange(deltaX, -SLIDER_W, SLIDER_W));
            },
            onDragEnd: (deltaX) => {
              const maxIndex = imageList.length - 1;
        
              if (deltaX < -100) setCurrentIndex(inrange(currentIndex + 1, 0, maxIndex));
              if (deltaX > 100) setCurrentIndex(inrange(currentIndex - 1, 0, maxIndex));
        
              setTransX(0);
            },
        })}
      >
        {imageList.map((url, i) => (
          <div key={i} className="flex-shrink-0">
            <img src={url} alt="img" width={SLIDER_W} draggable={false} />
          </div>
        ))}
      </div>
    </div>
  );
};

const ViewBox2 = () => {
    const slideList = [imageList.at(-1), ...imageList, imageList.at(0)];
    const [currentIndex, setCurrentIndex] = useState(1);
    const [transX, setTransX] = useState(0);
    const [animate, setAnimate] = useState(false);
  
    return (
      <div
        className="overflow-hidden"
        style={{
          width: SLIDER_W,
          height: SLIDER_H,
        }}
      >
        <div
          className="flex"
          style={{
              transform: `translateX(${-currentIndex * SLIDER_W + transX}px)`,
              transition: `transform ${animate ? 300 : 0}ms ease-in-out 0s`,
          }}
          {...registDrag({
              onDragChange: (deltaX) => {
                setTransX(inrange(deltaX, -SLIDER_W, SLIDER_W));
              },
              onDragEnd: (deltaX) => {
                const maxIndex = slideList.length - 1;
          
                if (deltaX < -100) setCurrentIndex(inrange(currentIndex + 1, 0, maxIndex));
                if (deltaX > 100) setCurrentIndex(inrange(currentIndex - 1, 0, maxIndex));
          
                setAnimate(true);
                setTransX(0);
              },
          })}
          onTransitionEnd={() => {
            setAnimate(false);
        
            if (currentIndex === 0) {
              setCurrentIndex(slideList.length - 2);
            } else if (currentIndex === slideList.length - 1) {
              setCurrentIndex(1);
            }
          }}
        >
          {slideList.map((url, i) => (
            <div key={i} className="flex-shrink-0">
              <img src={url} alt="img" width={SLIDER_W} draggable={false} />
            </div>
          ))}
        </div>
      </div>
    );
};
  
const ViewBox3 = () => {
    const slideList = [imageList.at(-1), ...imageList, imageList.at(0)];
    const [currentIndex, setCurrentIndex] = useState(1);
    const [transX, setTransX] = useState(0);
    const [animate, setAnimate] = useState(false);
    const [isRunning, setIsRunning] = useState(true);
    const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null); // 타이머 ID 저장

    useEffect(() => {
        if (intervalId) {
            clearInterval(intervalId);
          }

        if (isRunning) {
            const interval = setInterval(() => {
                setCurrentIndex((prevCount) => 
                    (prevCount + 1 < slideList.length) ? prevCount + 1 : 2);
                setAnimate(true)
            }, 1000);
            setIntervalId(interval)
        }
    
        return () => {
            if(intervalId) clearInterval(intervalId)
            setAnimate(false)
        };
      }, [isRunning]);
  
    const handleStop = () => {
      if (intervalId) clearInterval(intervalId);
      setIsRunning(false);
      setIntervalId(null);
    };
    
    return (
      <div
        className="overflow-hidden"
        style={{
          width: SLIDER_W,
          height: SLIDER_H,
        }}
      >
        {isRunning.toString()}
        <div
          className="flex"
          style={{
              transform: `translateX(${-currentIndex * SLIDER_W + transX}px)`,
              transition: `transform ${animate ? 300 : 0}ms ease-in-out 0s`,
          }}
          {...registDrag({
              onDragChange: (deltaX) => {
                setTransX(inrange(deltaX, -SLIDER_W, SLIDER_W));
                handleStop()
              },
              onDragEnd: (deltaX) => {
                const maxIndex = slideList.length - 1;
          
                if (deltaX < -100) setCurrentIndex(inrange(currentIndex + 1, 0, maxIndex));
                if (deltaX > 100) setCurrentIndex(inrange(currentIndex - 1, 0, maxIndex));
          
                setAnimate(true);
                setTransX(0);
                setIsRunning(true)
              },
          })}
          onTransitionEnd={() => {
            setAnimate(false);
        
            if (currentIndex === 0) {
              setCurrentIndex(slideList.length - 2);
            } else if (currentIndex === slideList.length - 1) {
              setCurrentIndex(1);
            }
          }}
        >
          {slideList.map((url, i) => (
            <div key={i} className="flex-shrink-0">
              <img src={url} alt="img" width={SLIDER_W} draggable={false} />
            </div>
          ))}
        </div>
      </div>
    );
};

const Carousel = () => {
  return (
    <div className="flex justify-center items-center flex-col p-4 gap-3">
      <h1>Carousel</h1>
      <ViewBox />
      <h1>Infinity Carousel</h1>
      <ViewBox2 />
      <h1>Auto Carousel</h1>
      <ViewBox3 />
    </div>
  );
};

export default Carousel;
