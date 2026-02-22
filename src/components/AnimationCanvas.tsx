import { forwardRef, useImperativeHandle, useRef } from 'react';

const AnimationCanvas = forwardRef<HTMLCanvasElement>((_, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useImperativeHandle(ref, () => canvasRef.current!);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10"
      style={{ width: '100vw', height: '100vh' }}
    />
  );
});

AnimationCanvas.displayName = 'AnimationCanvas';
export default AnimationCanvas;
