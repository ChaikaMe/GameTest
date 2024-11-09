import { useEffect, useMemo, useRef, useState } from "react";
import css from "./Field.module.css";
import Wall from "../Wall/Wall";
import collideCheck from "../../Helper/collideCheck";

export default function Field() {
  // land Ref
  const landRef = useRef(null);

  // Walls

  const walls = useMemo(
    () => [
      {
        width: 50,
        height: 50,
        top: 100,
        left: 100,
      },
      {
        width: 50,
        height: 50,
        top: 100,
        left: 350,
      },
      {
        width: 50,
        height: 50,
        top: 350,
        left: 350,
      },
      {
        width: 50,
        height: 50,
        top: 350,
        left: 100,
      },
    ],
    []
  );

  // Test projectile

  const testProjectile = useMemo(
    () => [{ width: 5, height: 5, speed: 10 }],
    []
  );

  // Land Size
  const landWidth = 500;
  const landHeight = 500;

  // Animation loop reference for moving
  const animationFrameId = useRef(null);

  // Player / Character / Mouse-------------------------------------------------------------------
  // Position
  const [charPos, setCharPos] = useState({
    x: 250,
    y: 250,
  });
  const prevCharPos = useRef(charPos);
  const speed = 2;

  // Char ref
  const charRef = useRef(null);

  // Rotation
  const [rotationDeg, setRotationDeg] = useState(0);

  // Char movement ------------------------------------------------------------------------

  // Keys Ref

  const keysPressed = useRef({
    a: false,
    w: false,
    s: false,
    d: false,
  });

  // Key/Mouse listener
  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key.toLowerCase();
      if (key in keysPressed.current) {
        keysPressed.current[key] = true;
      }
    };

    const handleKeyUp = (event) => {
      const key = event.key.toLowerCase();
      if (key in keysPressed.current) {
        keysPressed.current[key] = false;
      }
    };

    const handleMouseMovement = (event) => {
      setMousePos({
        x: event.clientX,
        y: event.clientY,
      });
    };

    const handleMouseClick = (event) => {};

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("mousemove", handleMouseMovement);
    window.addEventListener("click", handleMouseClick);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("mousemove", handleMouseMovement);
      window.removeEventListener("click", handleMouseClick);
    };
  }, []);

  // Animation loop
  useEffect(() => {
    const updatePosition = () => {
      let newX = charPos.x;
      let newY = charPos.y;
      const charData = charRef.current.getBoundingClientRect();
      const landData = landRef.current.getBoundingClientRect();

      const isCollidingWithAnyWall = (newRect) =>
        walls.some((wall) =>
          collideCheck({
            rect1: newRect,
            rect2: {
              ...wall,
              top: wall.top + landData.top,
              left: wall.left + landData.left,
            },
          })
        );

      if (keysPressed.current.d) {
        newX + speed > landWidth - 5 ||
        isCollidingWithAnyWall({
          ...charData,
          left: charData.left + speed,
          top: charData.top,
        })
          ? ""
          : (newX += speed);
      }
      if (keysPressed.current.a) {
        newX - speed < 5 ||
        isCollidingWithAnyWall({
          ...charData,
          left: charData.left - speed,
          top: charData.top,
        })
          ? ""
          : (newX -= speed);
      }
      if (keysPressed.current.w) {
        newY - speed < 5 ||
        isCollidingWithAnyWall({
          ...charData,
          left: charData.left,
          top: charData.top - speed,
        })
          ? ""
          : (newY -= speed);
      }
      if (keysPressed.current.s) {
        newY + speed > landWidth - 5 ||
        isCollidingWithAnyWall({
          ...charData,
          left: charData.left,
          top: charData.top + speed,
        })
          ? ""
          : (newY += speed);
      }

      if (newX !== charPos.x || newY !== charPos.y) {
        setCharPos({ x: newX, y: newY });
      }

      animationFrameId.current =
        requestAnimationFrame(updatePosition);
    };

    animationFrameId.current = requestAnimationFrame(updatePosition);

    return () => {
      cancelAnimationFrame(animationFrameId.current);
    };
  }, [charPos, walls]);

  // Mouse -----------------------------------------------------------------------
  // Mouse Position by char --------------------------------
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const prevMousePos = useRef(mousePos);

  // Mouse rotate animation loop
  const animationFrameIdMouse = useRef(null);

  useEffect(() => {
    const updatePosition = () => {
      if (
        mousePos.x !== prevMousePos.current.x ||
        mousePos.y !== prevMousePos.current.y ||
        charPos.x !== prevCharPos.current.x ||
        charPos.y !== prevCharPos.current.y
      ) {
        const { left, top } = charRef.current.getBoundingClientRect();
        const { x, y } = mousePos;
        const deg = Math.atan2(top - y, left - x) * (180 / Math.PI);
        setRotationDeg(deg);
        prevMousePos.current = mousePos;
        prevCharPos.current = charPos;
      }
      animationFrameIdMouse.current =
        requestAnimationFrame(updatePosition);
    };
    animationFrameIdMouse.current =
      requestAnimationFrame(updatePosition);
    return () => {
      cancelAnimationFrame(animationFrameIdMouse.current);
    };
  }, [mousePos, charPos]);

  // Projectile fire

  const animationFrameIdProjectile = useRef(null);

  const [projectileArray, setProjectileArray] = useState([]);

  const createProjectile = (newProjectile) => {
    setProjectileArray(...projectileArray, newProjectile);
  };

  useEffect(() => {
    const projectileFire = (spell) => {
      const degInRadians = (rotationDeg * Math.PI) / 180;
    };
  });

  return (
    <div className={css.field}>
      <div
        className={css.land}
        style={{ width: landWidth, height: landHeight }}
        ref={landRef}
      >
        <div
          className={css.pl}
          style={{
            left: charPos.x,
            top: charPos.y,
            transform: `rotate(${rotationDeg - 90}deg)`,
          }}
          ref={charRef}
        >
          <div className={css.fakePl}>
            <div className={css.wand}></div>
          </div>
        </div>
        {walls.map((wall, index) => {
          return <Wall styleData={wall} key={index} />;
        })}
      </div>
    </div>
  );
}
