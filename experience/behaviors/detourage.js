// Behavior « detourage » : supprime le fond vert pur en haut de la vidéo
// directement dans le matériau de base, SANS filtre de décoloration (spill)
// ni distorsion de gamma. Toutes les couleurs de l'affiche et de la vidéo
// restent 100 % d'origine, sans aucun effet de brouillard.

function appliquerDetourage(ctx) {
  if (ctx.state.detoure) return
  const brique = ctx.bricks.get('video-anthonin')
  if (!brique || !brique.object3d || !brique.object3d.children[0]) return

  const mesh = brique.object3d.children[0]
  if (!mesh.material) return

  mesh.material.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <map_fragment>',
      `
      #ifdef USE_MAP
        vec4 sampledDiffuseColor = texture2D( map, vMapUv );
        #ifdef DECODE_VIDEO_TEXTURE
          sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
        #endif
        // Efface uniquement le vert pur RVB 255 tout en haut (vMapUv.y > 0.6)
        // sans aucun impact sur les autres couleurs ni voile brumeux
        if (vMapUv.y > 0.6) {
          float greenExcess = sampledDiffuseColor.g - max(sampledDiffuseColor.r, sampledDiffuseColor.b);
          if (greenExcess > 0.28) {
            float a = clamp((0.48 - greenExcess) / 0.15, 0.0, 1.0);
            sampledDiffuseColor.a *= a;
          }
        }
        diffuseColor *= sampledDiffuseColor;
      #endif
      `
    )
  }
  mesh.material.needsUpdate = true
  ctx.state.detoure = true
}

/** @type {import('../../core/behaviors').Behavior} */
export default {
  onFound(ctx) {
    appliquerDetourage(ctx)
  },

  onUpdate(ctx) {
    if (!ctx.state.detoure) {
      appliquerDetourage(ctx)
    }
  },
}
