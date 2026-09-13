"use client";

import { useEffect, useRef } from "react";

// A slow, drifting field of engraved contour lines rendered in WebGL.
// Reacts to the pointer and to scroll; pauses when off screen or hidden.

const VERT = `
attribute vec2 a;
void main(){ gl_Position = vec4(a, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_mouse;
uniform float u_scroll;
uniform float u_fade;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
float noise(vec2 p){
  vec2 i = floor(p); vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}
float fbm(vec2 p){
  float v = 0.0; float a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++) { v += a * noise(p); p = m * p; a *= 0.5; }
  return v;
}

void main(){
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_res) / u_res.y;
  vec2 m = (u_mouse - 0.5) * vec2(0.35, -0.25);
  float t = u_time * 0.045;
  vec2 p = uv * 1.5 + m + vec2(0.0, u_scroll * 0.35);
  vec2 q = vec2(fbm(p + t), fbm(p + vec2(5.2, 1.3) - t * 0.7));
  float h = fbm(p + 1.8 * q);

  float bands = abs(fract(h * 15.0) - 0.5);
  float line = 1.0 - smoothstep(0.0, 0.05 + 0.05 * h, bands);
  float fog = smoothstep(0.25, 0.85, h);

  vec3 charcoal = vec3(0.110, 0.102, 0.090);
  vec3 bone = vec3(0.910, 0.875, 0.784);
  vec3 olive = vec3(0.478, 0.498, 0.306);

  vec3 col = charcoal;
  col = mix(col, olive, fog * 0.16);
  col += bone * line * (0.07 + 0.16 * fog);

  float v = 1.0 - smoothstep(0.35, 1.15, length(uv * vec2(0.85, 1.0)));
  col = mix(charcoal, col, v * u_fade);
  gl_FragColor = vec4(col, 1.0);
}
`;

export default function Fog({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      canvas.style.opacity = "0";
      return;
    }
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const a = gl.getAttribLocation(prog, "a");
    gl.enableVertexAttribArray(a);
    gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);

    const u = {
      res: gl.getUniformLocation(prog, "u_res"),
      time: gl.getUniformLocation(prog, "u_time"),
      mouse: gl.getUniformLocation(prog, "u_mouse"),
      scroll: gl.getUniformLocation(prog, "u_scroll"),
      fade: gl.getUniformLocation(prog, "u_fade"),
    };

    let w = 0;
    let h = 0;
    const resize = () => {
      const scale = Math.min(window.devicePixelRatio, 1.5) * 0.5;
      w = Math.max(1, Math.floor(canvas.clientWidth * scale));
      h = Math.max(1, Math.floor(canvas.clientHeight * scale));
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
    const onMove = (e: PointerEvent) => {
      mouse.tx = e.clientX / window.innerWidth;
      mouse.ty = e.clientY / window.innerHeight;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let visible = true;
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
    io.observe(canvas);

    let fade = 0;
    let raf = 0;
    const start = performance.now();
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible || document.hidden) return;
      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;
      fade += (1 - fade) * 0.03;
      const scroll = Math.min(1, window.scrollY / Math.max(1, window.innerHeight));
      gl.uniform2f(u.res, w, h);
      gl.uniform1f(u.time, (now - start) / 1000);
      gl.uniform2f(u.mouse, mouse.x, mouse.y);
      gl.uniform1f(u.scroll, scroll);
      gl.uniform1f(u.fade, fade);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return <canvas ref={ref} className={`block h-full w-full ${className}`} aria-hidden />;
}
