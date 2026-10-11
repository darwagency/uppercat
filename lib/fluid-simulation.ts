// Velocities use simulation cells/second. A separate, finer dye grid preserves
// liquid folds while keeping the pressure solve inexpensive.
const SETTINGS = {
  simulationResolution: 192,
  dyeResolution: 768,
  pressureIterations: 20,
  vorticity: 20,
  velocityDecay: 0.85,
  dyeDecay: 1.9,
  idleDuration: 3200,
  maxInjections: 12,
  radiusScale: 2,
};

const MURAL_URL = "/images/cursor-mural.webp";

const VERTEX = `#version 300 es
in vec2 position;
out vec2 uv;
void main() {
  uv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const HEADER = `#version 300 es
precision highp float;
precision highp sampler2D;
in vec2 uv;
out vec4 result;
`;

// Manual bilinear sampling supports GPUs without float-linear filtering.
const BILINEAR = `
vec4 sampleLinear(sampler2D source, vec2 coord) {
  vec2 size = vec2(textureSize(source, 0));
  vec2 p = coord * size - 0.5;
  vec2 cell = floor(p);
  vec2 f = fract(p);
  vec2 a = (cell + 0.5) / size;
  vec2 t = 1.0 / size;
  return mix(mix(texture(source, a), texture(source, a + vec2(t.x, 0.0)), f.x),
             mix(texture(source, a + vec2(0.0, t.y)), texture(source, a + t), f.x), f.y);
}`;

const FRAGMENTS = {
  splat: `
uniform sampler2D source;
uniform vec2 points[12];
uniform vec4 amounts[12];
uniform float radii[12];
uniform int count;
uniform float aspect;
void main() {
  vec4 ink = texture(source, uv);
  for (int i = 0; i < 12; i++) {
    if (i >= count) break;
    vec2 p = uv - points[i];
    p.x *= aspect;
    float falloff = exp(-dot(p, p) / (radii[i] * radii[i]));
    ink += falloff * amounts[i];
  }
  result = ink;
}`,
  advect: `
uniform sampler2D source;
uniform sampler2D velocity;
uniform vec2 velocityTexel;
uniform float dt;
uniform float decay;
${BILINEAR}
void main() {
  vec2 flow = sampleLinear(velocity, uv).xy;
  // Midpoint backtrace follows curved flow better than one Euler step.
  vec2 midpoint = sampleLinear(velocity, uv - 0.5 * dt * flow * velocityTexel).xy;
  vec2 back = uv - dt * midpoint * velocityTexel;
  result = sampleLinear(source, back) * exp(-decay * dt);
}`,
  curl: `
uniform sampler2D velocity;
uniform vec2 texel;
void main() {
  float left = texture(velocity, uv - vec2(texel.x, 0.0)).y;
  float right = texture(velocity, uv + vec2(texel.x, 0.0)).y;
  float bottom = texture(velocity, uv - vec2(0.0, texel.y)).x;
  float top = texture(velocity, uv + vec2(0.0, texel.y)).x;
  result = vec4(0.5 * (right - left - top + bottom), 0.0, 0.0, 1.0);
}`,
  vortices: `
uniform sampler2D velocity;
uniform sampler2D curl;
uniform vec2 texel;
uniform float dt;
uniform float strength;
void main() {
  float left = abs(texture(curl, uv - vec2(texel.x, 0.0)).r);
  float right = abs(texture(curl, uv + vec2(texel.x, 0.0)).r);
  float bottom = abs(texture(curl, uv - vec2(0.0, texel.y)).r);
  float top = abs(texture(curl, uv + vec2(0.0, texel.y)).r);
  float center = texture(curl, uv).r;
  vec2 gradient = 0.5 * vec2(right - left, top - bottom);
  gradient /= length(gradient) + 0.0001;
  vec2 force = strength * center * vec2(gradient.y, -gradient.x);
  vec2 flow = texture(velocity, uv).xy + force * dt;
  result = vec4(clamp(flow, vec2(-1100.0), vec2(1100.0)), 0.0, 1.0);
}`,
  divergence: `
uniform sampler2D velocity;
uniform vec2 texel;
void main() {
  vec2 center = texture(velocity, uv).xy;
  float left = uv.x < texel.x ? -center.x : texture(velocity, uv - vec2(texel.x, 0.0)).x;
  float right = uv.x > 1.0 - texel.x ? -center.x : texture(velocity, uv + vec2(texel.x, 0.0)).x;
  float bottom = uv.y < texel.y ? -center.y : texture(velocity, uv - vec2(0.0, texel.y)).y;
  float top = uv.y > 1.0 - texel.y ? -center.y : texture(velocity, uv + vec2(0.0, texel.y)).y;
  result = vec4(0.5 * (right - left + top - bottom), 0.0, 0.0, 1.0);
}`,
  pressure: `
uniform sampler2D pressure;
uniform sampler2D divergence;
uniform vec2 texel;
void main() {
  float left = texture(pressure, uv - vec2(texel.x, 0.0)).r;
  float right = texture(pressure, uv + vec2(texel.x, 0.0)).r;
  float bottom = texture(pressure, uv - vec2(0.0, texel.y)).r;
  float top = texture(pressure, uv + vec2(0.0, texel.y)).r;
  float d = texture(divergence, uv).r;
  result = vec4((left + right + bottom + top - d) * 0.25, 0.0, 0.0, 1.0);
}`,
  project: `
uniform sampler2D pressure;
uniform sampler2D velocity;
uniform vec2 texel;
void main() {
  float left = texture(pressure, uv - vec2(texel.x, 0.0)).r;
  float right = texture(pressure, uv + vec2(texel.x, 0.0)).r;
  float bottom = texture(pressure, uv - vec2(0.0, texel.y)).r;
  float top = texture(pressure, uv + vec2(0.0, texel.y)).r;
  vec2 flow = texture(velocity, uv).xy - 0.5 * vec2(right - left, top - bottom);
  if (uv.x < texel.x || uv.x > 1.0 - texel.x) flow.x = 0.0;
  if (uv.y < texel.y || uv.y > 1.0 - texel.y) flow.y = 0.0;
  result = vec4(flow, 0.0, 1.0);
}`,
  bloom: `
uniform sampler2D dye;
uniform sampler2D mural;
uniform vec2 muralScale;
${BILINEAR}
void main() {
  vec4 ink = sampleLinear(dye, uv);
  vec3 color = texture(mural, (uv - 0.5) * muralScale + 0.5).rgb;
  float bright = smoothstep(0.35, 1.8, ink.a);
  result = vec4(color * bright * 0.3, 1.0);
}`,
  blur: `
uniform sampler2D source;
uniform vec2 direction;
${BILINEAR}
void main() {
  vec3 color = sampleLinear(source, uv).rgb * 0.227027;
  color += sampleLinear(source, uv + direction * 1.384615).rgb * 0.316216;
  color += sampleLinear(source, uv - direction * 1.384615).rgb * 0.316216;
  color += sampleLinear(source, uv + direction * 3.230769).rgb * 0.070270;
  color += sampleLinear(source, uv - direction * 3.230769).rgb * 0.070270;
  result = vec4(color, 1.0);
}`,
  display: `
uniform sampler2D dye;
uniform sampler2D bloom;
uniform sampler2D mural;
uniform vec2 muralScale;
uniform vec2 texel;
${BILINEAR}
void main() {
  vec4 ink = sampleLinear(dye, uv);
  // The mural stays fixed; only the simulated liquid mask moves and curls.
  vec3 color = texture(mural, (uv - 0.5) * muralScale + 0.5).rgb;
  float left = sampleLinear(dye, uv - vec2(texel.x, 0.0)).a;
  float right = sampleLinear(dye, uv + vec2(texel.x, 0.0)).a;
  float bottom = sampleLinear(dye, uv - vec2(0.0, texel.y)).a;
  float top = sampleLinear(dye, uv + vec2(0.0, texel.y)).a;
  // Density gradients light the folds, giving the ink a liquid surface.
  vec3 normal = normalize(vec3((left - right) * 3.5, (bottom - top) * 3.5, 0.35));
  float light = clamp(dot(normal, normalize(vec3(-0.4, 0.65, 0.7))), 0.0, 1.0);
  float rim = pow(1.0 - normal.z, 2.0) * 0.1;
  color = clamp(color * (0.94 + light * 0.08) + vec3(rim), 0.0, 1.0);
  float alpha = 1.0 - exp(-max(ink.a - 0.018, 0.0) * 1.55);
  vec3 glow = sampleLinear(bloom, uv).rgb;
  float glowAlpha = max(glow.r, max(glow.g, glow.b)) * 0.65;
  float opacity = alpha + glowAlpha * (1.0 - alpha);
  // Premultiplied output leaves unoccupied pixels completely transparent.
  result = vec4(color * alpha + glow * (1.0 - alpha) * 0.65, opacity);
}`,
};

type Target = { texture: WebGLTexture; framebuffer: WebGLFramebuffer; width: number; height: number };
type Pair = { read: Target; write: Target; swap: () => void };
type Program = { handle: WebGLProgram; uniforms: Record<string, WebGLUniformLocation> };
type Pointer = { x: number; y: number; time: number };
type Injection = { x: number; y: number; dx: number; dy: number; speed: number; distance: number };

export function createFluidSimulation(canvas: HTMLCanvasElement): (() => void) | undefined {
  const gl = canvas.getContext("webgl2", {
    alpha: true, premultipliedAlpha: true, antialias: false,
    depth: false, stencil: false, powerPreference: "low-power",
  });
  if (!gl) return;
  if (!gl.getExtension("EXT_color_buffer_float")) {
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    return;
  }

  const programs: Program[] = [];
  const targets = new Set<Target>();
  const buffers: WebGLBuffer[] = [];
  const pointers = new Map<number, Pointer>();
  const injections: Injection[] = [];
  const coarsePointer = window.matchMedia("(pointer: coarse)");
  const device = navigator as Navigator & { deviceMemory?: number };
  let lowQuality = coarsePointer.matches || (device.hardwareConcurrency || 8) <= 4 || (device.deviceMemory || 8) <= 4;
  let frame = 0;
  let lastFrame = 0;
  let lastInput = 0;
  let slowFrames = 0;
  let measuredFrames = 0;
  let needsResize = true;
  let needsClear = false;
  let nextRender = 0;
  let stopped = false;
  let resourcesInvalid = false;
  const muralImage = new Image();
  let muralTexture: WebGLTexture | null = null;
  let muralReady = false;
  let muralAspect = 1;
  let velocity: Pair;
  let dye: Pair;
  let pressure: Pair;
  let divergence: Target;
  let curl: Target;
  let glow: Pair;

  const destroyTarget = (target: Target) => {
    if (!resourcesInvalid && !gl.isContextLost()) {
      gl.deleteTexture(target.texture);
      gl.deleteFramebuffer(target.framebuffer);
    }
    targets.delete(target);
  };

  const release = () => {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    targets.forEach(destroyTarget);
    if (!resourcesInvalid && !gl.isContextLost()) {
      programs.forEach((program) => gl.deleteProgram(program.handle));
      buffers.forEach((buffer) => gl.deleteBuffer(buffer));
      if (muralTexture) gl.deleteTexture(muralTexture);
    }
    muralTexture = null;
    muralImage.onload = null;
    muralImage.onerror = null;
    programs.length = 0;
    buffers.length = 0;
    pointers.clear();
    injections.length = 0;
    if (!gl.isContextLost()) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
    }
  };

  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type);
    if (!shader) throw new Error("Unable to create fluid shader");
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const message = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw new Error(message || "Unable to compile fluid shader");
    }
    return shader;
  };

  const makeProgram = (fragment: string): Program => {
    const vertex = compile(gl.VERTEX_SHADER, VERTEX);
    let pixel: WebGLShader | undefined;
    const handle = gl.createProgram();
    try {
      pixel = compile(gl.FRAGMENT_SHADER, HEADER + fragment);
      if (!handle) throw new Error("Unable to create fluid program");
      gl.attachShader(handle, vertex);
      gl.attachShader(handle, pixel);
      gl.bindAttribLocation(handle, 0, "position");
      gl.linkProgram(handle);
      if (!gl.getProgramParameter(handle, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(handle) || "Unable to link fluid program");
      const program: Program = { handle, uniforms: {} };
      programs.push(program);
      const count = gl.getProgramParameter(handle, gl.ACTIVE_UNIFORMS) as number;
      for (let i = 0; i < count; i++) {
        const info = gl.getActiveUniform(handle, i);
        if (!info) continue;
        const location = gl.getUniformLocation(handle, info.name);
        if (location !== null) program.uniforms[info.name] = location;
      }
      return program;
    } catch (error) {
      if (handle) gl.deleteProgram(handle);
      throw error;
    } finally {
      gl.deleteShader(vertex);
      if (pixel) gl.deleteShader(pixel);
    }
  };

  const makeTarget = (width: number, height: number, channels: number): Target => {
    const texture = gl.createTexture();
    const framebuffer = gl.createFramebuffer();
    if (!texture || !framebuffer) {
      if (texture) gl.deleteTexture(texture);
      if (framebuffer) gl.deleteFramebuffer(framebuffer);
      throw new Error("Unable to allocate fluid buffer");
    }
    const target = { texture, framebuffer, width, height };
    targets.add(target);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    const internal = channels === 1 ? gl.R16F : channels === 2 ? gl.RG16F : gl.RGBA16F;
    const format = channels === 1 ? gl.RED : channels === 2 ? gl.RG : gl.RGBA;
    gl.texImage2D(gl.TEXTURE_2D, 0, internal, width, height, 0, format, gl.HALF_FLOAT, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) throw new Error("Unsupported fluid buffer format");
    gl.viewport(0, 0, width, height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    return target;
  };

  const makePair = (width: number, height: number, channels: number): Pair => {
    const pair = {
      read: makeTarget(width, height, channels),
      write: makeTarget(width, height, channels),
      swap() { [pair.read, pair.write] = [pair.write, pair.read]; },
    };
    return pair;
  };

  const dimensions = (resolution: number): [number, number] => {
    const aspect = window.innerWidth / Math.max(1, window.innerHeight);
    // Bound allocation on ultrawide displays.
    return aspect > 1
      ? [Math.round(resolution * Math.min(aspect, 2.5)), resolution]
      : [resolution, Math.round(resolution / Math.max(aspect, 0.4))];
  };

  const resize = () => {
    targets.forEach(destroyTarget);
    const ratio = Math.min(window.devicePixelRatio || 1, lowQuality ? 1 : 1.5);
    const scale = Math.min(ratio, 1920 / Math.max(window.innerWidth, window.innerHeight));
    canvas.width = Math.max(1, Math.round(window.innerWidth * scale));
    canvas.height = Math.max(1, Math.round(window.innerHeight * scale));
    const sim = dimensions(lowQuality ? 128 : SETTINGS.simulationResolution);
    const color = dimensions(lowQuality ? 384 : SETTINGS.dyeResolution);
    const bloom = dimensions(lowQuality ? 96 : 192);
    velocity = makePair(...sim, 2);
    pressure = makePair(...sim, 1);
    divergence = makeTarget(...sim, 1);
    curl = makeTarget(...sim, 1);
    dye = makePair(...color, 4);
    glow = makePair(...bloom, 4);
    needsResize = false;
  };

  const use = (program: Program) => gl.useProgram(program.handle);
  const texture = (program: Program, name: string, target: Target, unit: number) => {
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, target.texture);
    gl.uniform1i(program.uniforms[name], unit);
  };
  const draw = (target: Target | null) => {
    gl.bindFramebuffer(gl.FRAMEBUFFER, target?.framebuffer || null);
    gl.viewport(0, 0, target?.width || canvas.width, target?.height || canvas.height);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  };
  const texel = (program: Program) => gl.uniform2f(program.uniforms.texel, 1 / velocity.read.width, 1 / velocity.read.height);

  let shaders: Record<keyof typeof FRAGMENTS, Program>;
  try {
    shaders = Object.fromEntries(Object.entries(FRAGMENTS).map(([name, fragment]) => [name, makeProgram(fragment)])) as typeof shaders;
    const quad = gl.createBuffer();
    if (!quad) throw new Error("Unable to create fluid mesh");
    buffers.push(quad);
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.disable(gl.BLEND);
    gl.disable(gl.DEPTH_TEST);
    resize();
    muralTexture = gl.createTexture();
    if (!muralTexture) throw new Error("Unable to allocate mural texture");
    gl.bindTexture(gl.TEXTURE_2D, muralTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(4));
  } catch (error) {
    console.warn("Fluid cursor unavailable:", error);
    release();
    return;
  }

  // Upload all deposits together: two draws per frame, irrespective of mouse Hz.
  const splat = (target: Pair, batch: Injection[], isVelocity: boolean) => {
    const program = shaders.splat;
    const points = new Float32Array(SETTINGS.maxInjections * 2);
    const amounts = new Float32Array(SETTINGS.maxInjections * 4);
    const radii = new Float32Array(SETTINGS.maxInjections);
    batch.forEach((injection, i) => {
      points.set([injection.x, injection.y], i * 2);
      radii[i] = (17 + Math.min(injection.speed, 2.5) * 4) * SETTINGS.radiusScale / window.innerHeight;
      if (isVelocity) {
        amounts.set([injection.dx * velocity.read.width * 32, injection.dy * velocity.read.height * 32, 0, 0], i * 4);
      } else {
        // Distance weighting keeps slow/high-frequency input from accumulating
        // extra dye merely because the browser delivers more pointer events.
        const density = (0.38 + Math.min(injection.speed, 2) * 0.12) * Math.min(injection.distance / 8, 2);
        // Neutral density reveals the photograph without adding a color tint.
        amounts.set([density, density, density, density], i * 4);
      }
    });
    use(program);
    texture(program, "source", target.read, 0);
    gl.uniform2fv(program.uniforms["points[0]"], points);
    gl.uniform4fv(program.uniforms["amounts[0]"], amounts);
    gl.uniform1fv(program.uniforms["radii[0]"], radii);
    gl.uniform1i(program.uniforms.count, batch.length);
    gl.uniform1f(program.uniforms.aspect, window.innerWidth / window.innerHeight);
    draw(target.write);
    target.swap();
  };

  const advect = (target: Pair, dt: number, decay: number) => {
    const program = shaders.advect;
    use(program);
    texture(program, "source", target.read, 0);
    texture(program, "velocity", velocity.read, 1);
    gl.uniform2f(program.uniforms.velocityTexel, 1 / velocity.read.width, 1 / velocity.read.height);
    gl.uniform1f(program.uniforms.dt, dt);
    gl.uniform1f(program.uniforms.decay, decay);
    draw(target.write);
    target.swap();
  };

  const step = (dt: number) => {
    advect(velocity, dt, SETTINGS.velocityDecay);
    use(shaders.curl);
    texture(shaders.curl, "velocity", velocity.read, 0);
    texel(shaders.curl);
    draw(curl);

    use(shaders.vortices);
    texture(shaders.vortices, "velocity", velocity.read, 0);
    texture(shaders.vortices, "curl", curl, 1);
    texel(shaders.vortices);
    gl.uniform1f(shaders.vortices.uniforms.dt, dt);
    gl.uniform1f(shaders.vortices.uniforms.strength, SETTINGS.vorticity);
    draw(velocity.write);
    velocity.swap();

    use(shaders.divergence);
    texture(shaders.divergence, "velocity", velocity.read, 0);
    texel(shaders.divergence);
    draw(divergence);

    // Rebuild pressure each step so previous solves do not accumulate energy.
    gl.bindFramebuffer(gl.FRAMEBUFFER, pressure.read.framebuffer);
    gl.clear(gl.COLOR_BUFFER_BIT);
    use(shaders.pressure);
    texture(shaders.pressure, "divergence", divergence, 1);
    texel(shaders.pressure);
    for (let i = 0; i < (lowQuality ? 12 : SETTINGS.pressureIterations); i++) {
      texture(shaders.pressure, "pressure", pressure.read, 0);
      draw(pressure.write);
      pressure.swap();
    }

    use(shaders.project);
    texture(shaders.project, "pressure", pressure.read, 0);
    texture(shaders.project, "velocity", velocity.read, 1);
    texel(shaders.project);
    draw(velocity.write);
    velocity.swap();
    advect(dye, dt, SETTINGS.dyeDecay);
  };

  const bindMural = (program: Program) => {
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, muralTexture);
    gl.uniform1i(program.uniforms.mural, 2);
    const aspect = window.innerWidth / window.innerHeight;
    // Centered background-size: cover, using CSS viewport dimensions rather
    // than the capped canvas resolution so the artwork never stretches.
    gl.uniform2f(program.uniforms.muralScale, Math.min(1, aspect / muralAspect), Math.min(1, muralAspect / aspect));
  };

  const display = () => {
    if (!muralReady) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.clear(gl.COLOR_BUFFER_BIT);
      return;
    }
    use(shaders.bloom);
    texture(shaders.bloom, "dye", dye.read, 0);
    bindMural(shaders.bloom);
    draw(glow.write);
    glow.swap();
    use(shaders.blur);
    for (const horizontal of [true, false]) {
      texture(shaders.blur, "source", glow.read, 0);
      gl.uniform2f(shaders.blur.uniforms.direction, horizontal ? 1 / glow.read.width : 0, horizontal ? 0 : 1 / glow.read.height);
      draw(glow.write);
      glow.swap();
    }
    use(shaders.display);
    texture(shaders.display, "dye", dye.read, 0);
    texture(shaders.display, "bloom", glow.read, 1);
    bindMural(shaders.display);
    gl.uniform2f(shaders.display.uniforms.texel, 1 / dye.read.width, 1 / dye.read.height);
    draw(null);
  };

  const render = (now: number) => {
    frame = 0;
    if (stopped || document.hidden || gl.isContextLost()) return;
    if (now - lastInput > SETTINGS.idleDuration) {
      // Stop GPU work once the ink has faded; the next gesture starts clean.
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.clear(gl.COLOR_BUFFER_BIT);
      needsClear = true;
      lastFrame = 0;
      nextRender = 0;
      return;
    }
    // Keep high-refresh displays from running the full solver at 144/240 FPS.
    if (now < nextRender) { frame = requestAnimationFrame(render); return; }
    nextRender = Math.max(nextRender + 1000 / 60, now);
    const elapsed = lastFrame ? (now - lastFrame) / 1000 : 1 / 60;
    if (lastFrame && !lowQuality) {
      measuredFrames++;
      if (elapsed > 0.026) slowFrames++;
      if (measuredFrames >= 90) {
        if (slowFrames > 35) { lowQuality = true; needsResize = true; }
        measuredFrames = 0;
        slowFrames = 0;
      }
    }
    lastFrame = now;
    try {
      if (needsResize) resize();
      if (needsClear) {
        targets.forEach((target) => {
          gl.bindFramebuffer(gl.FRAMEBUFFER, target.framebuffer);
          gl.clear(gl.COLOR_BUFFER_BIT);
        });
        needsClear = false;
      }
      const batch = injections.splice(0);
      if (batch.length) {
        splat(velocity, batch, true);
        splat(dye, batch, false);
      }
      const dt = Math.min(Math.max(elapsed, 1 / 240), 1 / 30);
      // Smaller steps keep fast gestures stable on slower GPUs.
      const steps = dt > 0.022 ? 2 : 1;
      for (let i = 0; i < steps; i++) step(dt / steps);
      display();
      frame = requestAnimationFrame(render);
    } catch (error) {
      console.warn("Fluid cursor stopped:", error);
      stopped = true;
      release();
    }
  };

  const wake = () => {
    if (!frame && !stopped && !document.hidden) frame = requestAnimationFrame(render);
  };
  const onPointerMove = (event: PointerEvent) => {
    if (stopped || document.hidden || (event.pointerType === "touch" && !pointers.has(event.pointerId))) return;
    const samples = event.getCoalescedEvents?.();
    for (const sample of samples?.length ? samples : [event]) {
      const now = performance.now();
      const previous = pointers.get(event.pointerId);
      const point = { x: sample.clientX, y: sample.clientY, time: sample.timeStamp };
      pointers.set(event.pointerId, point);
      if (!previous || point.time - previous.time > 180) continue;
      const dx = point.x - previous.x;
      const dy = point.y - previous.y;
      const distance = Math.hypot(dx, dy);
      if (distance < 0.15) continue;
      const speed = distance / Math.max(8, point.time - previous.time);
      const count = Math.min(8, Math.max(1, Math.ceil(distance / 10)));
      for (let i = 1; i <= count; i++) {
        injections.push({
          x: (previous.x + dx * i / count) / window.innerWidth,
          y: 1 - (previous.y + dy * i / count) / window.innerHeight,
          dx: dx / window.innerWidth / count,
          dy: -dy / window.innerHeight / count,
          speed,
          distance: distance / count,
        });
      }
      // Merge nearby samples when input exceeds the GPU budget, preserving
      // momentum and traveled distance rather than dropping fast gestures.
      while (injections.length > SETTINGS.maxInjections) {
        let closest = 0;
        let smallest = Infinity;
        for (let i = 0; i < injections.length - 1; i++) {
          const a = injections[i], b = injections[i + 1];
          const gap = Math.hypot((a.x - b.x) * window.innerWidth, (a.y - b.y) * window.innerHeight);
          if (gap < smallest) { smallest = gap; closest = i; }
        }
        const a = injections[closest], b = injections[closest + 1];
        const weight = b.distance / (a.distance + b.distance);
        injections.splice(closest, 2, {
          x: a.x + (b.x - a.x) * weight, y: a.y + (b.y - a.y) * weight,
          dx: a.dx + b.dx, dy: a.dy + b.dy,
          speed: a.speed + (b.speed - a.speed) * weight,
          distance: a.distance + b.distance,
        });
      }
      lastInput = now;
      wake();
    }
  };
  const onPointerDown = (event: PointerEvent) => {
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY, time: event.timeStamp });
  };
  const onPointerEnd = (event: PointerEvent) => { pointers.delete(event.pointerId); };
  const onPointerOut = (event: PointerEvent) => { if (!event.relatedTarget) pointers.delete(event.pointerId); };
  const onResize = () => { needsResize = true; pointers.clear(); injections.length = 0; };
  const onVisibility = () => {
    pointers.clear();
    injections.length = 0;
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    lastFrame = 0;
    nextRender = 0;
    needsClear = true;
    if (!gl.isContextLost()) { gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.clear(gl.COLOR_BUFFER_BIT); }
  };
  const onContextLost = (event: Event) => {
    event.preventDefault();
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    stopped = true;
    resourcesInvalid = true;
    pointers.clear();
    injections.length = 0;
  };
  const cleanup = () => {
    stopped = true;
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerdown", onPointerDown);
    window.removeEventListener("pointerup", onPointerEnd);
    window.removeEventListener("pointercancel", onPointerEnd);
    window.removeEventListener("pointerout", onPointerOut);
    window.removeEventListener("resize", onResize);
    window.removeEventListener("blur", onVisibility);
    document.removeEventListener("visibilitychange", onVisibility);
    canvas.removeEventListener("webglcontextlost", onContextLost);
    release();
  };

  muralImage.onload = () => {
    if (stopped || resourcesInvalid || gl.isContextLost() || !muralTexture) return;
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, muralTexture);
    // DOM images are top-down; the solver's UV coordinates are bottom-up.
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, muralImage);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    muralAspect = muralImage.naturalWidth / muralImage.naturalHeight;
    muralReady = true;
    if (lastInput > 0 && performance.now() - lastInput < SETTINGS.idleDuration) wake();
  };
  muralImage.onerror = () => {
    if (!stopped) {
      console.warn("Fluid cursor mural could not be loaded");
      cleanup();
    }
  };
  muralImage.src = MURAL_URL;

  window.addEventListener("pointermove", onPointerMove, { passive: true });
  window.addEventListener("pointerdown", onPointerDown, { passive: true });
  window.addEventListener("pointerup", onPointerEnd, { passive: true });
  window.addEventListener("pointercancel", onPointerEnd, { passive: true });
  window.addEventListener("pointerout", onPointerOut, { passive: true });
  window.addEventListener("resize", onResize);
  window.addEventListener("blur", onVisibility);
  document.addEventListener("visibilitychange", onVisibility);
  canvas.addEventListener("webglcontextlost", onContextLost);

  return cleanup;
}
