import { Ref, computed } from 'vue'
import { SlideBackground } from '@/types/slides'

// The page background data into CSS styles
export default (background: Ref<SlideBackground | undefined>) => {
  const backgroundStyle = computed(() => {
    if (!background.value) return { backgroundColor: '#fff' }

    const {
      type,
      color,
      image,
      imageSize,
      gradientColor,
      gradientRotate,
      gradientType,
    } = background.value

    // Pure color background
    if (type === 'solid') return { backgroundColor: color }

    // Background patterns
    // Including: background, and the size of the background, whether repeated
    else if (type === 'image') {
      if (!image) return { backgroundColor: '#fff' }
      if (imageSize === 'repeat') {
        return {
          backgroundImage: `url(${image}`,
          backgroundRepeat: 'repeat',
          backgroundSize: 'contain',
        }
      }
      return {
        backgroundImage: `url(${image}`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: imageSize || 'cover',
      }
    }

    // 渐变色背景
    else if (type === 'gradient') {
      const rotate = gradientRotate || 0
      const color1 = gradientColor ? gradientColor[0] : '#fff'
      const color2 = gradientColor ? gradientColor[1] : '#fff'
      
      if (gradientType === 'radial') return { backgroundImage: `radial-gradient(${color1}, ${color2}` }
      return { backgroundImage: `linear-gradient(${rotate}deg, ${color1}, ${color2}` }
    }

    return { backgroundColor: '#fff' }
  })

  return {
    backgroundStyle,
  }
}