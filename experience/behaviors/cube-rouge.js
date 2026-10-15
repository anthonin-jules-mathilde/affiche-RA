// Behavior « cube-rouge » : crée un cube 3D rouge au centre de l'affiche,
// décollé vers le spectateur (z = 0.15), qui tourne doucement sur lui-même.

/** @type {import('../../core/behaviors').Behavior} */
export default {
  onFound(ctx) {
    if (!ctx.state.cube) {
      // Cube de 20 % de la largeur de l'affiche (1 unité = largeur de l'affiche)
      const taille = 0.2
      const geometrie = new ctx.THREE.BoxGeometry(taille, taille, taille)
      const matiere = new ctx.THREE.MeshStandardMaterial({
        color: 0xff2d37,
        roughness: 0.35,
        metalness: 0.15,
      })
      const cube = new ctx.THREE.Mesh(geometrie, matiere)

      // Centre de l'affiche (x = 0.5, y = 0.5) et décollé de 0.15 vers le spectateur
      const position = ctx.toLocal(0.5, 0.5, 0.15)
      cube.position.copy(position)

      ctx.poster.add(cube)
      ctx.state.cube = cube
    } else if (ctx.state.cube.parent !== ctx.poster) {
      ctx.poster.add(ctx.state.cube)
    }

    ctx.state.cube.visible = true
  },

  onLost(ctx) {
    if (ctx.state.cube) {
      ctx.state.cube.visible = false
    }
  },

  onUpdate(ctx, t, dt) {
    if (!ctx.state.cube || !ctx.state.cube.visible) return

    // Rotation lente sur lui-même
    ctx.state.cube.rotation.x += dt * 0.6
    ctx.state.cube.rotation.y += dt * 1.0
  },
}
