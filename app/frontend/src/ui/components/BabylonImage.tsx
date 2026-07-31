import { useRef, useEffect } from 'react'
import { BabylonButtonType, babylonButton } from '../../game/BabylonButton'

interface BabylonImageProps {
  type: BabylonButtonType;
}

const BabylonImage = ({type}: BabylonImageProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    return babylonButton(canvasRef.current, type);
  }, [])

  return (
    <canvas ref={canvasRef} />
  )
}

export default BabylonImage
