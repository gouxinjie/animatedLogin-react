import { useEffect, useRef, useState } from "react";

// 全组件共享一份鼠标坐标，避免每只眼睛各自监听 mousemove。
function usePointerPosition() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const frameRef = useRef(null);
  const latestPositionRef = useRef(mousePosition);

  useEffect(() => {
    const flushPointerPosition = () => {
      frameRef.current = null;
      setMousePosition(latestPositionRef.current);
    };

    const handleMouseMove = (event) => {
      latestPositionRef.current = { x: event.clientX, y: event.clientY };

      if (frameRef.current === null) {
        frameRef.current = window.requestAnimationFrame(flushPointerPosition);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);

      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  return mousePosition;
}

// 随机眨眼节奏，保持角色处于“活着”的状态感。
function useBlinking(minDelay = 3000, maxDelay = 7000, duration = 150) {
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    let blinkTimerId;
    let resetTimerId;
    let isActive = true;

    const scheduleBlink = () => {
      blinkTimerId = window.setTimeout(() => {
        setIsBlinking(true);

        resetTimerId = window.setTimeout(() => {
          setIsBlinking(false);

          if (isActive) {
            scheduleBlink();
          }
        }, duration);
      }, Math.random() * (maxDelay - minDelay) + minDelay);
    };

    scheduleBlink();

    return () => {
      isActive = false;
      window.clearTimeout(blinkTimerId);
      window.clearTimeout(resetTimerId);
    };
  }, [duration, maxDelay, minDelay]);

  return isBlinking;
}

// 在显示密码时随机触发“偷看”动作，不改变原有交互时机。
function usePeeking(enabled, minDelay = 2000, maxDelay = 5000, duration = 800) {
  const [isPeeking, setIsPeeking] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setIsPeeking(false);
      return undefined;
    }

    let peekTimerId;
    let resetTimerId;
    let isActive = true;

    const schedulePeek = () => {
      peekTimerId = window.setTimeout(() => {
        setIsPeeking(true);

        resetTimerId = window.setTimeout(() => {
          setIsPeeking(false);

          if (isActive) {
            schedulePeek();
          }
        }, duration);
      }, Math.random() * (maxDelay - minDelay) + minDelay);
    };

    schedulePeek();

    return () => {
      isActive = false;
      window.clearTimeout(peekTimerId);
      window.clearTimeout(resetTimerId);
    };
  }, [duration, enabled, maxDelay, minDelay]);

  return isPeeking;
}

// 根据鼠标与当前眼球中心点的夹角，计算瞳孔偏移量。
function calculateLookOffset(ref, mousePosition, maxDistance) {
  if (!ref.current) {
    return { x: 0, y: 0 };
  }

  const rect = ref.current.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const deltaX = mousePosition.x - centerX;
  const deltaY = mousePosition.y - centerY;
  const distance = Math.min(Math.hypot(deltaX, deltaY), maxDistance);
  const angle = Math.atan2(deltaY, deltaX);

  return {
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance,
  };
}

function Pupil({
  mousePosition,
  size = 12,
  maxDistance = 5,
  pupilColor = "#2D2D2D",
  forceLookX,
  forceLookY,
}) {
  const pupilRef = useRef(null);
  const pos =
    forceLookX !== undefined && forceLookY !== undefined
      ? { x: forceLookX, y: forceLookY }
      : calculateLookOffset(pupilRef, mousePosition, maxDistance);

  return (
    <div
      ref={pupilRef}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: pupilColor,
        borderRadius: "50%",
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        transition: "transform 0.1s ease-out",
      }}
    />
  );
}

function EyeBall({
  mousePosition,
  size = 18,
  pupilSize = 7,
  maxDistance = 5,
  eyeColor = "white",
  pupilColor = "#2D2D2D",
  isBlinking = false,
  forceLookX,
  forceLookY,
}) {
  const eyeRef = useRef(null);
  const pos =
    forceLookX !== undefined && forceLookY !== undefined
      ? { x: forceLookX, y: forceLookY }
      : calculateLookOffset(eyeRef, mousePosition, maxDistance);

  return (
    <div
      ref={eyeRef}
      style={{
        width: `${size}px`,
        height: isBlinking ? "2px" : `${size}px`,
        backgroundColor: eyeColor,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        transition: "height 0.15s ease",
      }}
    >
      {!isBlinking ? (
        <div
          style={{
            width: `${pupilSize}px`,
            height: `${pupilSize}px`,
            backgroundColor: pupilColor,
            borderRadius: "50%",
            transform: `translate(${pos.x}px, ${pos.y}px)`,
            transition: "transform 0.1s ease-out",
          }}
        />
      ) : null}
    </div>
  );
}

function CelebrationSparkle({ delay = "0s", left, top, size = 14, rotate = "0deg" }) {
  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width: `${size}px`,
        height: `${size}px`,
        transform: `rotate(${rotate})`,
        animation: `celebrationSparkle 1.4s ease-in-out ${delay} infinite`,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "#FFFFFF",
          clipPath: "polygon(50% 0%, 62% 38%, 100% 50%, 62% 62%, 50% 100%, 38% 62%, 0% 50%, 38% 38%)",
          opacity: 0.95,
        }}
      />
    </div>
  );
}

function CelebrationRibbon({ left, top, color, delay = "0s", rotate = "0deg" }) {
  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width: "10px",
        height: "38px",
        borderRadius: "999px",
        background: `linear-gradient(180deg, ${color} 0%, rgba(255,255,255,0.1) 100%)`,
        transform: `rotate(${rotate})`,
        animation: `celebrationRibbon 1.8s ease-in-out ${delay} infinite`,
        pointerEvents: "none",
      }}
    />
  );
}

export default function AnimatedCharacters({
  isTyping = false,
  isPasswordFocused = false,
  showPassword = false,
  passwordLength = 0,
  isSubmitting = false,
}) {
  const mousePosition = usePointerPosition();
  const isPurpleBlinking = useBlinking();
  const isBlackBlinking = useBlinking();

  const [isLookingAtEachOther, setIsLookingAtEachOther] = useState(false);

  const purpleRef = useRef(null);
  const blackRef = useRef(null);
  const yellowRef = useRef(null);
  const orangeRef = useRef(null);

  // 输入邮箱时角色会短暂互看，形成一个轻微的互动反馈。
  useEffect(() => {
    if (isTyping) {
      setIsLookingAtEachOther(true);
      const timerId = window.setTimeout(() => setIsLookingAtEachOther(false), 800);
      return () => window.clearTimeout(timerId);
    }

    setIsLookingAtEachOther(false);
    return undefined;
  }, [isTyping]);

  const isShowingPassword = passwordLength > 0 && showPassword;
  const isHidingPassword = passwordLength > 0 && !showPassword;
  const isLookingAway = isPasswordFocused && !showPassword;
  const isPurplePeeking = usePeeking(isShowingPassword);
  const isCelebrating = isSubmitting;

  // 面部和身体都会跟随鼠标，但位移范围被限制在一个较小区间内。
  const calculatePosition = (ref) => {
    if (!ref.current) return { faceX: 0, faceY: 0, bodySkew: 0 };

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 3;
    const deltaX = mousePosition.x - centerX;
    const deltaY = mousePosition.y - centerY;

    return {
      faceX: Math.max(-15, Math.min(15, deltaX / 20)),
      faceY: Math.max(-10, Math.min(10, deltaY / 30)),
      bodySkew: Math.max(-6, Math.min(6, -deltaX / 120)),
    };
  };

  const purplePos = calculatePosition(purpleRef);
  const blackPos = calculatePosition(blackRef);
  const yellowPos = calculatePosition(yellowRef);
  const orangePos = calculatePosition(orangeRef);

  const purpleLook = {
    x: isCelebrating ? 0 : isLookingAway ? -5 : isShowingPassword ? (isPurplePeeking ? 4 : -4) : isLookingAtEachOther ? 3 : undefined,
    y: isCelebrating ? -2 : isLookingAway ? -5 : isShowingPassword ? (isPurplePeeking ? 5 : -4) : isLookingAtEachOther ? 4 : undefined,
  };

  const blackLook = {
    x: isCelebrating ? 0 : isLookingAway ? -4 : isShowingPassword ? -4 : isLookingAtEachOther ? 0 : undefined,
    y: isCelebrating ? -2 : isLookingAway ? -5 : isShowingPassword ? -4 : isLookingAtEachOther ? -4 : undefined,
  };

  const lowerCharactersLook = {
    x: isCelebrating ? 0 : isLookingAway ? -5 : isShowingPassword ? -5 : undefined,
    y: isCelebrating ? -2 : isLookingAway ? -5 : isShowingPassword ? -4 : undefined,
  };

  return (
    <div
      style={{
        position: "relative",
        width: "550px",
        height: "400px",
        animation: isCelebrating ? "charactersCelebrate 0.9s ease-in-out infinite alternate" : "none",
      }}
    >
      {isCelebrating ? (
        <>
          <CelebrationSparkle left="34px" top="126px" delay="0s" size={18} rotate="-12deg" />
          <CelebrationSparkle left="118px" top="58px" delay="0.25s" size={12} rotate="18deg" />
          <CelebrationSparkle left="238px" top="18px" delay="0.1s" size={16} rotate="-6deg" />
          <CelebrationSparkle left="414px" top="72px" delay="0.35s" size={14} rotate="22deg" />
          <CelebrationSparkle left="472px" top="142px" delay="0.18s" size={18} rotate="-18deg" />
          <CelebrationRibbon left="78px" top="26px" color="#FF8A80" delay="0.1s" rotate="-24deg" />
          <CelebrationRibbon left="196px" top="8px" color="#FFD54F" delay="0.32s" rotate="18deg" />
          <CelebrationRibbon left="362px" top="24px" color="#80CBC4" delay="0.18s" rotate="-14deg" />
          <CelebrationRibbon left="458px" top="34px" color="#CE93D8" delay="0.4s" rotate="28deg" />
        </>
      ) : null}

      {/* 紫色角色承担主要表情变化：转头、偷看和跟随输入状态。 */}
      <div
        ref={purpleRef}
        style={{
          position: "absolute",
          bottom: 0,
          left: "70px",
          width: "180px",
          height: isCelebrating ? "430px" : isLookingAway || isTyping || isHidingPassword ? "440px" : "400px",
          backgroundColor: "#6C3FF5",
          borderRadius: "10px 10px 0 0",
          zIndex: 1,
          transform: isCelebrating
            ? "skewX(-6deg) translateY(-18px) rotate(-4deg) translateZ(0)"
            : isShowingPassword
              ? "skewX(0deg) translateZ(0)"
              : isLookingAway
                ? "skewX(-14deg) translateX(-20px) translateZ(0)"
                : isTyping || isHidingPassword
                  ? `skewX(${purplePos.bodySkew - 12}deg) translateX(40px) translateZ(0)`
                  : `skewX(${purplePos.bodySkew}deg) translateZ(0)`,
          transformOrigin: "bottom center",
          willChange: "transform, height",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          transition: "all 0.7s ease-in-out",
        }}
      >
        <div
          style={{
            position: "absolute",
            display: "flex",
            gap: "32px",
            left: isCelebrating
              ? "48px"
              : isLookingAway
                ? "20px"
                : isShowingPassword
                  ? "20px"
                  : isLookingAtEachOther
                    ? "55px"
                    : `${45 + purplePos.faceX}px`,
            top: isCelebrating
              ? "54px"
              : isLookingAway
                ? "25px"
                : isShowingPassword
                  ? "35px"
                  : isLookingAtEachOther
                    ? "65px"
                    : `${40 + purplePos.faceY}px`,
            transition: "all 0.7s ease-in-out",
          }}
        >
          <EyeBall
            mousePosition={mousePosition}
            size={18}
            pupilSize={7}
            maxDistance={5}
            isBlinking={isPurpleBlinking}
            forceLookX={purpleLook.x}
            forceLookY={purpleLook.y}
          />
          <EyeBall
            mousePosition={mousePosition}
            size={18}
            pupilSize={7}
            maxDistance={5}
            isBlinking={isPurpleBlinking}
            forceLookX={purpleLook.x}
            forceLookY={purpleLook.y}
          />
        </div>
      </div>

      {/* 黑色角色主要负责与紫色角色的“互看”配合。 */}
      <div
        ref={blackRef}
        style={{
          position: "absolute",
          bottom: 0,
          left: "240px",
          width: "120px",
          height: "310px",
          backgroundColor: "#2D2D2D",
          borderRadius: "8px 8px 0 0",
          zIndex: 2,
          transform: isCelebrating
            ? "skewX(8deg) translateY(-30px) rotate(6deg) translateZ(0)"
            : isShowingPassword
              ? "skewX(0deg) translateZ(0)"
              : isLookingAway
                ? "skewX(12deg) translateX(-10px) translateZ(0)"
                : isLookingAtEachOther
                  ? `skewX(${blackPos.bodySkew * 1.5 + 10}deg) translateX(20px) translateZ(0)`
                  : isTyping || isHidingPassword
                    ? `skewX(${blackPos.bodySkew * 1.5}deg) translateZ(0)`
                    : `skewX(${blackPos.bodySkew}deg) translateZ(0)`,
          transformOrigin: "bottom center",
          willChange: "transform",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          transition: "all 0.7s ease-in-out",
        }}
      >
        <div
          style={{
            position: "absolute",
            display: "flex",
            gap: "24px",
            left: isCelebrating
              ? "28px"
              : isLookingAway
                ? "10px"
                : isShowingPassword
                  ? "10px"
                  : isLookingAtEachOther
                    ? "32px"
                    : `${26 + blackPos.faceX}px`,
            top: isCelebrating
              ? "24px"
              : isLookingAway
                ? "20px"
                : isShowingPassword
                  ? "28px"
                  : isLookingAtEachOther
                    ? "12px"
                    : `${32 + blackPos.faceY}px`,
            transition: "all 0.7s ease-in-out",
          }}
        >
          <EyeBall
            mousePosition={mousePosition}
            size={16}
            pupilSize={6}
            maxDistance={4}
            isBlinking={isBlackBlinking}
            forceLookX={blackLook.x}
            forceLookY={blackLook.y}
          />
          <EyeBall
            mousePosition={mousePosition}
            size={16}
            pupilSize={6}
            maxDistance={4}
            isBlinking={isBlackBlinking}
            forceLookX={blackLook.x}
            forceLookY={blackLook.y}
          />
        </div>
      </div>

      {/* 下方两个角色只做较轻量的视线跟随，避免画面过于嘈杂。 */}
      <div
        ref={orangeRef}
        style={{
          position: "absolute",
          bottom: 0,
          left: "0px",
          width: "240px",
          height: "200px",
          zIndex: 3,
          backgroundColor: "#FF9B6B",
          borderRadius: "120px 120px 0 0",
          transform: isCelebrating
            ? "skewX(-4deg) translateY(-12px) rotate(-2deg) translateZ(0)"
            : isShowingPassword
              ? "skewX(0deg) translateZ(0)"
              : `skewX(${orangePos.bodySkew}deg) translateZ(0)`,
          transformOrigin: "bottom center",
          willChange: "transform",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          boxShadow: "inset 0 -2px 0 #FF9B6B",
          transition: "all 0.7s ease-in-out",
        }}
      >
        <div
          style={{
            position: "absolute",
            display: "flex",
            gap: "32px",
            left: isCelebrating ? "84px" : isLookingAway ? "50px" : isShowingPassword ? "50px" : `${82 + orangePos.faceX}px`,
            top: isCelebrating ? "78px" : isLookingAway ? "75px" : isShowingPassword ? "85px" : `${90 + orangePos.faceY}px`,
            transition: "all 0.2s ease-out",
          }}
        >
          <Pupil
            mousePosition={mousePosition}
            size={12}
            maxDistance={5}
            forceLookX={lowerCharactersLook.x}
            forceLookY={lowerCharactersLook.y}
          />
          <Pupil
            mousePosition={mousePosition}
            size={12}
            maxDistance={5}
            forceLookX={lowerCharactersLook.x}
            forceLookY={lowerCharactersLook.y}
          />
        </div>
        <div
          style={{
            position: "absolute",
            left: "92px",
            top: isCelebrating ? "118px" : "132px",
            width: "56px",
            height: "26px",
            borderBottom: "4px solid #2D2D2D",
            borderRadius: "0 0 56px 56px",
            opacity: isCelebrating ? 1 : 0,
            transition: "all 0.3s ease-out",
          }}
        />
      </div>

      <div
        ref={yellowRef}
        style={{
          position: "absolute",
          bottom: 0,
          left: "310px",
          width: "140px",
          height: "230px",
          backgroundColor: "#E8D754",
          borderRadius: "70px 70px 0 0",
          zIndex: 4,
          transform: isCelebrating
            ? "skewX(4deg) translateY(-20px) rotate(3deg) translateZ(0)"
            : isShowingPassword
              ? "skewX(0deg) translateZ(0)"
              : `skewX(${yellowPos.bodySkew}deg) translateZ(0)`,
          transformOrigin: "bottom center",
          willChange: "transform",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          boxShadow: "inset 0 -2px 0 #E8D754",
          transition: "all 0.7s ease-in-out",
        }}
      >
        <div
          style={{
            position: "absolute",
            display: "flex",
            gap: "24px",
            left: isCelebrating ? "52px" : isLookingAway ? "20px" : isShowingPassword ? "20px" : `${52 + yellowPos.faceX}px`,
            top: isCelebrating ? "36px" : isLookingAway ? "30px" : isShowingPassword ? "35px" : `${40 + yellowPos.faceY}px`,
            transition: "all 0.2s ease-out",
          }}
        >
          <Pupil
            mousePosition={mousePosition}
            size={12}
            maxDistance={5}
            forceLookX={lowerCharactersLook.x}
            forceLookY={lowerCharactersLook.y}
          />
          <Pupil
            mousePosition={mousePosition}
            size={12}
            maxDistance={5}
            forceLookX={lowerCharactersLook.x}
            forceLookY={lowerCharactersLook.y}
          />
        </div>
        <div
          style={{
            position: "absolute",
            width: "80px",
            height: "4px",
            backgroundColor: "#2D2D2D",
            borderRadius: isCelebrating ? "0 0 999px 999px" : "999px",
            left: isCelebrating ? "32px" : isLookingAway ? "15px" : isShowingPassword ? "10px" : `${40 + yellowPos.faceX}px`,
            top: isCelebrating ? "88px" : isLookingAway ? "78px" : isShowingPassword ? "88px" : `${88 + yellowPos.faceY}px`,
            transform: isCelebrating ? "scaleX(0.85)" : "none",
            transition: "all 0.2s ease-out",
          }}
        />
      </div>
    </div>
  );
}
