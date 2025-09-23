import 'kleur/colors';
import { q as decodeKey } from './chunks/astro/server_DdYPrSzm.mjs';
import 'clsx';
import 'cookie';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/astro-designed-error-pages_CFwf64K7.mjs';
import 'es-module-lexer';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///home/meswil/PROG/Personnal/wmesiti-portfolio/","cacheDir":"file:///home/meswil/PROG/Personnal/wmesiti-portfolio/node_modules/.astro/","outDir":"file:///home/meswil/PROG/Personnal/wmesiti-portfolio/dist/","srcDir":"file:///home/meswil/PROG/Personnal/wmesiti-portfolio/src/","publicDir":"file:///home/meswil/PROG/Personnal/wmesiti-portfolio/public/","buildClientDir":"file:///home/meswil/PROG/Personnal/wmesiti-portfolio/dist/client/","buildServerDir":"file:///home/meswil/PROG/Personnal/wmesiti-portfolio/dist/server/","adapterName":"@astrojs/vercel","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"ProjectDetail/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/projectdetail","isIndex":false,"type":"page","pattern":"^\\/ProjectDetail\\/?$","segments":[[{"content":"ProjectDetail","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/ProjectDetail.astro","pathname":"/ProjectDetail","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"inline","content":"body{margin:0;padding:0}\n"}],"routeData":{"type":"page","isIndex":false,"route":"/admin/[...params]","pattern":"^\\/admin(?:\\/(.*?))?\\/?$","segments":[[{"content":"admin","dynamic":false,"spread":false}],[{"content":"...params","dynamic":true,"spread":true}]],"params":["...params"],"component":"node_modules/@sanity/astro/dist/studio/studio-route.astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["/home/meswil/PROG/Personnal/wmesiti-portfolio/node_modules/@sanity/astro/dist/studio/studio-route.astro",{"propagation":"none","containsHead":true}],["/home/meswil/PROG/Personnal/wmesiti-portfolio/src/pages/ProjectDetail.astro",{"propagation":"none","containsHead":true}],["/home/meswil/PROG/Personnal/wmesiti-portfolio/src/pages/index.astro",{"propagation":"none","containsHead":true}],["/home/meswil/PROG/Personnal/wmesiti-portfolio/src/pages/projects/[slug].astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000noop-middleware":"_noop-middleware.mjs","\u0000noop-actions":"_noop-actions.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astro-page:node_modules/@sanity/astro/dist/studio/studio-route@_@astro":"pages/admin/_---params_.astro.mjs","\u0000@astro-page:src/pages/ProjectDetail@_@astro":"pages/projectdetail.astro.mjs","\u0000@astro-page:src/pages/projects/[slug]@_@astro":"pages/projects/_slug_.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_D_9bxPRF.mjs","/home/meswil/PROG/Personnal/wmesiti-portfolio/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_BeWeELZa.mjs","@astrojs/vue/client.js":"_astro/client.lsFx4gxo.js","@astrojs/react/client.js":"_astro/client.BIBHL4Qy.js","/home/meswil/PROG/Personnal/wmesiti-portfolio/src/components/About.astro?astro&type=script&index=0&lang.ts":"_astro/About.astro_astro_type_script_index_0_lang.DdteFK7y.js","/home/meswil/PROG/Personnal/wmesiti-portfolio/src/components/SkillsTabs.astro?astro&type=script&index=0&lang.ts":"_astro/SkillsTabs.astro_astro_type_script_index_0_lang.D69VHvTH.js","/home/meswil/PROG/Personnal/wmesiti-portfolio/src/components/ProjectDetail.astro?astro&type=script&index=0&lang.ts":"_astro/ProjectDetail.astro_astro_type_script_index_0_lang.C48cqVPf.js","/home/meswil/PROG/Personnal/wmesiti-portfolio/src/components/Navbar.astro?astro&type=script&index=0&lang.ts":"_astro/Navbar.astro_astro_type_script_index_0_lang.BThW_Cri.js","/home/meswil/PROG/Personnal/wmesiti-portfolio/node_modules/sanity/lib/_chunks-es/resources2.mjs":"_astro/resources2.DDHUSZP4.js","/home/meswil/PROG/Personnal/wmesiti-portfolio/node_modules/sanity/lib/_chunks-es/VideoPlayer.mjs":"_astro/VideoPlayer.CUSb0Tyj.js","/home/meswil/PROG/Personnal/wmesiti-portfolio/node_modules/sanity/lib/_chunks-es/resources4.mjs":"_astro/resources4.Cvrz6WkP.js","/home/meswil/PROG/Personnal/wmesiti-portfolio/node_modules/sanity/lib/_chunks-es/resources.mjs":"_astro/resources.WeBxAJU_.js","/home/meswil/PROG/Personnal/wmesiti-portfolio/node_modules/sanity/lib/_chunks-es/resources5.mjs":"_astro/resources5.x6vTclPy.js","/home/meswil/PROG/Personnal/wmesiti-portfolio/node_modules/sanity/lib/_chunks-es/resources3.mjs":"_astro/resources3.DtddYyjB.js","/home/meswil/PROG/Personnal/wmesiti-portfolio/node_modules/sanity/lib/_chunks-es/ViteDevServerStopped.mjs":"_astro/ViteDevServerStopped.w0_dgs-e.js","/home/meswil/PROG/Personnal/wmesiti-portfolio/node_modules/@sanity/client/dist/_chunks-es/stegaEncodeSourceMap.js":"_astro/stegaEncodeSourceMap.DJ5icCPm.js","/home/meswil/PROG/Personnal/wmesiti-portfolio/node_modules/@sanity/ui/dist/_chunks-es/refractor.mjs":"_astro/refractor.BJVisp2u.js","/home/meswil/PROG/Personnal/wmesiti-portfolio/node_modules/sanity/lib/_chunks-es/index.mjs":"_astro/index.DNWF2njJ.js","/home/meswil/PROG/Personnal/wmesiti-portfolio/node_modules/sanity/lib/_chunks-es/index2.mjs":"_astro/index2.D67uhoBD.js","/home/meswil/PROG/Personnal/wmesiti-portfolio/node_modules/sanity/lib/_chunks-es/index3.mjs":"_astro/index3.DSZKxEn8.js","/home/meswil/PROG/Personnal/wmesiti-portfolio/node_modules/@sanity/vision/lib/_chunks-es/resources.mjs":"_astro/resources.ENVHuLbd.js","/home/meswil/PROG/Personnal/wmesiti-portfolio/node_modules/@sanity/vision/lib/_chunks-es/SanityVision.mjs":"_astro/SanityVision.MgUILuqz.js","/home/meswil/PROG/Personnal/wmesiti-portfolio/node_modules/sanity/lib/_chunks-es/resources6.mjs":"_astro/resources6.eTTajKgS.js","/home/meswil/PROG/Personnal/wmesiti-portfolio/node_modules/@sanity/astro/dist/studio/studio-component":"_astro/studio-component.CHKMkR6d.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[["/home/meswil/PROG/Personnal/wmesiti-portfolio/src/components/About.astro?astro&type=script&index=0&lang.ts","const s=\"Enchanté, moi c'est William !\",c=document.getElementById(\"typewriter\");let i=0;function r(){i<s.length&&c&&(c.innerHTML+=s.charAt(i),i++,setTimeout(r,100))}r();const o=document.querySelectorAll(\".about-tab-button\"),d=document.querySelectorAll(\".about-tab-panel\");o.forEach(e=>{e.addEventListener(\"click\",()=>{const n=e.dataset.tab;o.forEach(t=>{t.classList.remove(\"active\",\"text-indigo-300\",\"border-indigo-300\"),t.classList.add(\"text-mochawhite\",\"border-transparent\")}),d.forEach(t=>{t.classList.add(\"hidden\"),t.classList.remove(\"active\")}),e.classList.add(\"active\",\"text-indigo-300\",\"border-indigo-300\"),e.classList.remove(\"text-mochawhite\",\"border-transparent\");const a=document.querySelector(`[data-panel=\"${n}\"]`);a&&(a.classList.remove(\"hidden\"),a.classList.add(\"active\"))})});"],["/home/meswil/PROG/Personnal/wmesiti-portfolio/src/components/SkillsTabs.astro?astro&type=script&index=0&lang.ts","const i=document.querySelectorAll(\".tab-button\"),r=document.querySelectorAll(\".tab-panel\");i.forEach(a=>{a.addEventListener(\"click\",()=>{const o=a.dataset.tab;i.forEach(e=>{e.classList.remove(\"active\"),e.classList.remove(\"bg-indigo-500\"),e.classList.add(\"bg-mochasurface\",\"backdrop-blur-sm\",\"hover:bg-mochasurfacelight\",\"hover:scale-105\");const t=e.querySelector(\".w-2.h-2\");t&&(t.classList.remove(\"bg-white\"),t.classList.add(\"bg-mochawhite/60\"))}),r.forEach(e=>{e.classList.add(\"hidden\"),e.classList.remove(\"active\",\"fade-in\")}),a.classList.add(\"active\"),a.classList.remove(\"bg-mochasurface\",\"backdrop-blur-sm\",\"hover:bg-mochasurfacelight\",\"hover:scale-105\"),a.classList.add(\"bg-indigo-500\",\"hover:bg-indigo-600\",\"hover:scale-105\");const s=a.querySelector(\".w-2.h-2\");s&&(s.classList.remove(\"bg-mochawhite/60\"),s.classList.add(\"bg-white\"));const c=document.querySelector(`[data-panel=\"${o}\"]`);c&&(c.classList.remove(\"hidden\"),c.classList.add(\"active\",\"fade-in\"))})});"],["/home/meswil/PROG/Personnal/wmesiti-portfolio/src/components/ProjectDetail.astro?astro&type=script&index=0&lang.ts","const l=document.getElementById(\"carousel-track\"),d=document.getElementById(\"carousel-prev\"),u=document.getElementById(\"carousel-next\"),c=document.querySelectorAll(\".carousel-dot\");if(l&&c.length>1){let s=function(){const t=-e*100;l.style.transform=`translateX(${t}%)`,c.forEach((n,i)=>{i===e?(n.classList.remove(\"bg-mochasurface\",\"hover:bg-mochasurfacelight\"),n.classList.add(\"bg-indigo-400\")):(n.classList.remove(\"bg-indigo-400\"),n.classList.add(\"bg-mochasurface\",\"hover:bg-mochasurfacelight\"))})},o=function(){e=(e+1)%r,s()},a=function(){e=(e-1+r)%r,s()},e=0;const r=c.length;u?.addEventListener(\"click\",o),d?.addEventListener(\"click\",a),c.forEach((t,n)=>{t.addEventListener(\"click\",()=>{e=n,s()})}),setInterval(o,5e3),document.addEventListener(\"keydown\",t=>{t.key===\"ArrowLeft\"&&a(),t.key===\"ArrowRight\"&&o()})}"],["/home/meswil/PROG/Personnal/wmesiti-portfolio/src/components/Navbar.astro?astro&type=script&index=0&lang.ts","const t=document.getElementById(\"mobile-menu-button\"),e=document.getElementById(\"mobile-menu\"),a=document.querySelectorAll(\".mobile-nav-link\");function l(){e?.classList.contains(\"opacity-100\")?(e?.classList.remove(\"opacity-100\",\"visible\",\"translate-y-0\"),e?.classList.add(\"opacity-0\",\"invisible\",\"translate-y-2\"),t?.classList.remove(\"mobile-menu-open\")):(e?.classList.remove(\"opacity-0\",\"invisible\",\"translate-y-2\"),e?.classList.add(\"opacity-100\",\"visible\",\"translate-y-0\"),t?.classList.add(\"mobile-menu-open\"))}function n(){e?.classList.remove(\"opacity-100\",\"visible\",\"translate-y-0\"),e?.classList.add(\"opacity-0\",\"invisible\",\"translate-y-2\"),t?.classList.remove(\"mobile-menu-open\")}t?.addEventListener(\"click\",l);a.forEach(i=>{i.addEventListener(\"click\",n)});document.addEventListener(\"keydown\",i=>{i.key===\"Escape\"&&n()});document.addEventListener(\"click\",i=>{const s=e?.contains(i.target),o=t?.contains(i.target);!s&&!o&&n()});window.addEventListener(\"resize\",()=>{window.innerWidth>=1024&&n()});"]],"assets":["/_astro/profile.CzTLHwW3.webp","/_astro/ProjectDetail.Dm8V2oq_.css","/favicon.svg","/_astro/SanityVision.MgUILuqz.js","/_astro/VideoPlayer.CUSb0Tyj.js","/_astro/ViteDevServerStopped.w0_dgs-e.js","/_astro/browser.DSvZCfOK.js","/_astro/client.BIBHL4Qy.js","/_astro/client.DX9NJ8SR.js","/_astro/client.lsFx4gxo.js","/_astro/index.DNWF2njJ.js","/_astro/index2.D67uhoBD.js","/_astro/index3.DSZKxEn8.js","/_astro/refractor.BJVisp2u.js","/_astro/resources.ENVHuLbd.js","/_astro/resources.WeBxAJU_.js","/_astro/resources2.DDHUSZP4.js","/_astro/resources3.DtddYyjB.js","/_astro/resources4.Cvrz6WkP.js","/_astro/resources5.x6vTclPy.js","/_astro/resources6.eTTajKgS.js","/_astro/stegaEncodeSourceMap.DJ5icCPm.js","/_astro/studio-component.CEgZqfX4.js","/_astro/studio-component.CHKMkR6d.js","/ProjectDetail/index.html","/index.html"],"buildFormat":"directory","checkOrigin":true,"serverIslandNameMap":[],"key":"QEb6OU+k1CkmGJxTRC7+K8SHFOspnmRS3OR934byFNo="});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = null;

export { manifest };
