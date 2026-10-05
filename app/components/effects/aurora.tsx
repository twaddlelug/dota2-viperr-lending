import { Color, Mesh, Program, Renderer, Triangle } from 'ogl'
import { useEffect, useRef } from 'react'

const DESKTOP_STOPS = ['#4a1410', '#050303', '#3a0e0b']
const MOBILE_STOPS = ['#4a1410', '#200806', '#3a0e0b']
const GLOW_COLOR = '#d8432c'
const MIN_CANVAS_WIDTH = 800

const toRgb = (hex: string) => {
  const c = new Color(hex)
  return [c.r, c.g, c.b]
}

const VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`

const FRAG = `#version 300 es
precision highp float;

uniform float uTime;
uniform vec3 uColorStops[3];
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform vec3 uGlowColor;

out vec4 fragColor;

vec3 permute(vec3 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

float snoise(vec2 v) {
  const vec4 C = vec4(
    0.211324865405187, 0.366025403784439,
    -0.577350269189626, 0.024390243902439
  );
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);

  vec3 p = permute(
    permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0)
  );

  vec3 m = max(
    0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)),
    0.0
  );
  m = m * m;
  m = m * m;

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);

  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;

  vec3 rampColor = uv.x < 0.5
    ? mix(uColorStops[0], uColorStops[1], uv.x * 2.0)
    : mix(uColorStops[1], uColorStops[2], (uv.x - 0.5) * 2.0);

  float height = exp(snoise(vec2(uv.x * 2.0 + uTime * 0.1, uTime * 0.25)) * 0.5);
  float intensity = 0.6 * (uv.y * 3.5 - height + 0.2);

  float auroraAlpha = smoothstep(-0.05, 0.45, intensity);
  vec3 auroraColor = intensity * rampColor;

  float cursorEffect = smoothstep(0.6, 0.0, distance(uv, uMouse / uResolution));

  fragColor = vec4(
    mix(auroraColor, uGlowColor, cursorEffect * 0.3),
    max(auroraAlpha, cursorEffect * 0.5)
  );
}
`

type Engine = {
  renderer: Renderer
  program: Program
  mesh: Mesh
  canvas: HTMLCanvasElement
}

let engine: Engine | null | undefined
let hasDrawn = false

function getEngine(): Engine | null {
  if (engine !== undefined) return engine

  try {
    const renderer = new Renderer({
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      dpr: Math.min(window.devicePixelRatio, 1.5),
    })
    const { gl } = renderer
    gl.clearColor(0, 0, 0, 0)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)

    const geometry = new Triangle(gl)
    delete geometry.attributes.uv

    const stops = window.innerWidth > 1024 ? DESKTOP_STOPS : MOBILE_STOPS
    const program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        uTime: { value: 0 },
        uColorStops: { value: stops.map(toRgb) },
        uResolution: { value: [0, 0] },
        uMouse: { value: [0, 0] },
        uGlowColor: { value: toRgb(GLOW_COLOR) },
      },
    })
    const mesh = new Mesh(gl, { geometry, program })
    engine = { renderer, program, mesh, canvas: gl.canvas }
  } catch {
    engine = null
  }
  return engine
}

export const auroraIsWarm = () => hasDrawn

export function Aurora({ onReady }: { onReady?: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const onReadyRef = useRef(onReady)
  onReadyRef.current = onReady

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const shared = getEngine()
    if (!shared) {
      onReadyRef.current?.()
      return
    }
    const { renderer, program, mesh, canvas } = shared
    container.appendChild(canvas)

    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let reported = false
    const draw = (time: number) => {
      program.uniforms.uTime.value = time * 0.001
      renderer.render({ scene: mesh })
      hasDrawn = true
      if (!reported) {
        reported = true
        onReadyRef.current?.()
      }
    }

    const resize = () => {
      const width = Math.max(container.offsetWidth, MIN_CANVAS_WIDTH)
      const height = container.offsetHeight
      renderer.setSize(width, height)
      program.uniforms.uResolution.value = [width, height]
      if (still) draw(performance.now())
    }
    resize()

    let raf = 0
    const frame = (time: number) => {
      raf = requestAnimationFrame(frame)
      draw(time)
    }
    const start = () => {
      if (still) draw(performance.now())
      else if (!raf) raf = requestAnimationFrame(frame)
    }
    const stop = () => {
      cancelAnimationFrame(raf)
      raf = 0
    }

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      program.uniforms.uMouse.value = [
        e.clientX - rect.left,
        rect.height - (e.clientY - rect.top),
      ]
    }

    const observer = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0.05, rootMargin: '0px 0px 100px 0px' }
    )
    observer.observe(container)
    window.addEventListener('resize', resize)
    if (!still) {
      window.addEventListener('mousemove', onMouseMove, { passive: true })
    }

    return () => {
      stop()
      observer.disconnect()
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)

      canvas.remove()
    }
  }, [])
  return <div ref={containerRef} className="absolute h-full w-full" />
}
