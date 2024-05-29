const easingFns: {[key: string]: Function } = {
    "linear": (t: number) => t,
    "easeIn": (t: number) => t * t,
    "easeOut": (t: number) => t * (2 - t),
    "easeInOut": (t: number) => t < 0.5? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
    "easeOutBack": (t: number) => {
        const c1 = 2.70158;
        const c3 = c1 + 1;
        return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
      },
    "easeInBack": (t: number) => {
        const c1 = 2.70158;
        const c3 = c1 + 1;
        return c3 * t * t * t - c1 * t * t;
    }
  };

export function interpolate(start: number, end: number, totalTime: number, currentTime: number, easing: string) {
    // Calculate the fraction of the animation that has completed
    const fractionComplete = currentTime / totalTime;
  
    // Apply the easing function to the fraction of completion
    const easedFraction = easingFns[easing](fractionComplete);
  
    // Calculate the interpolated value
    const interpolatedValue = start + (end - start) * easedFraction;
  
    return interpolatedValue;
  }