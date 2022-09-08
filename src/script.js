import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Fog
const fog = new THREE.Fog('#262837', 1, 15)
scene.fog = fog

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
// Door Texture
const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture =  textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorHeightTexture =textureLoader.load('/textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorMetallnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')

// Walls Texture
const brickColor = textureLoader.load('/textures/bricks/color.jpg')
const brickNormal = textureLoader.load('/textures/bricks/normal.jpg')
const brickRoughness = textureLoader.load('/textures/bricks/roughness.jpg')
const brickAmbientOcclusion = textureLoader.load('/textures/bricks/ambientOcclusion.jpg')

// Grass Texture
const grassColor = textureLoader.load('textures/grass/color.jpg')
const grassNormal = textureLoader.load('textures/grass/normal.jpg')
const grassRoughness = textureLoader.load('textures/grass/roughness.jpg')
const grassAmbientOcclusion = textureLoader.load('textures/grass/ambientOcclusion.jpg')

grassColor.repeat.set(8,8)
grassAmbientOcclusion.repeat.set(8,8)
grassNormal.repeat.set(8,8)
grassRoughness.repeat.set(8,8)

grassColor.wrapS = grassColor.wrapT = THREE.RepeatWrapping
grassAmbientOcclusion.wrapS = grassAmbientOcclusion.wrapT = THREE.RepeatWrapping
grassNormal.wrapS = grassNormal.wrapT = THREE.RepeatWrapping
grassRoughness.wrapS = grassRoughness.wrapT = THREE.RepeatWrapping



const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)
gui.add(axesHelper,'visible').name('Axes Helper').setValue(false)

/**
 * House
 */

const house = new THREE.Group()
scene.add(house)

// walls
const walls = new THREE.Mesh(
    new THREE.BoxBufferGeometry(4,2.5,4),
    new THREE.MeshStandardMaterial({
        map : brickColor,
        aoMap : brickAmbientOcclusion,
        normalMap : brickNormal,
        roughnessMap : brickRoughness
    })
)
walls.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
)
walls.position.y = 2.5 / 2
house.add(walls)

// roof
const roof = new THREE.Mesh(
    new THREE.ConeBufferGeometry(3.5,1,4),
    new THREE.MeshStandardMaterial({
        color : '#b35f45'
    })
)
roof.position.y = 2.5 + 0.5
roof.rotation.y = Math.PI / 4
house.add(roof)

// door
const door = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(2,2.2, 100, 100),
    new THREE.MeshStandardMaterial({
        map : doorColorTexture,
        transparent : true,
        alphaMap : doorAlphaTexture,
        aoMap : doorAmbientOcclusionTexture,
        displacementMap : doorHeightTexture,
        displacementScale : 0.1,
        normalMap : doorNormalTexture,
        roughnessMap : doorRoughnessTexture,
        metalnessMap : doorMetallnessTexture
    })
)
door.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
)
door.position.set(0,1,2.01)
house.add(door)

// bushes
const bushGeomtry = new THREE.SphereBufferGeometry(1,16,16)
const bushMaterial = new THREE.MeshStandardMaterial({
    color : '#89c854'
})

const bush1 = new THREE.Mesh(bushGeomtry, bushMaterial)
bush1.scale.set(.5,.5,.5)
bush1.position.set(.8,.2,2.2)

const bush2 = new THREE.Mesh(bushGeomtry, bushMaterial)
bush2.scale.set(.25,.25,.25)
bush2.position.set(1.4,.1,2.1)

const bush3 = new THREE.Mesh(bushGeomtry, bushMaterial)
bush3.scale.set(.4,.4,.4)
bush3.position.set(-.8,.1,2.2)

const bush4 = new THREE.Mesh(bushGeomtry, bushMaterial)
bush4.scale.set(.15,.15,.15)
bush4.position.set(-1,.05,2.6)

const bush5 = new THREE.Mesh(bushGeomtry, bushMaterial)
bush5.scale.set(.4,.4,.4)
bush5.position.set(-1.3,.3,2.2)

scene.add(bush1, bush2, bush3, bush4, bush5)

// graves
const graves = new THREE.Group()
scene.add(graves)

const graveGeomtry = new THREE.BoxBufferGeometry(.6,.8,.2)
const graveMaterial = new THREE.MeshStandardMaterial({
    color : '#b2b6b1'
})
 
for(let i = 0 ; i <= 50 ; i++)
{
    const angle = Math.random() * Math.PI * 2
    const radius = 3 + Math.random() * 6
    const x = Math.sin(angle) * radius
    const z = Math.cos(angle) * radius

    const grave = new THREE.Mesh(graveGeomtry, graveMaterial)
    grave.castShadow = true

    grave.position.set(x,.3,z);
    grave.rotation.y = (Math.random() - 0.5 ) * .4
    grave.rotation.z = (Math.random() - 0.5 ) * .4
    graves.add(grave)
}

// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(20, 20),
    new THREE.MeshStandardMaterial({
        map : grassColor,
        aoMap : grassAmbientOcclusion,
        normalMap : grassNormal,
        roughnessMap : grassRoughness
    })
)
floor.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
)
floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
scene.add(floor)

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.12)
moonLight.position.set(4, 5, - 2)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(moonLight)

// Door light
const doorLight = new THREE.PointLight('#ff7d46', 1, 7)
doorLight.position.set(0, 2.2, 2.7)
house.add(doorLight)
const doorLightHelper = new THREE.PointLightHelper(doorLight)
// scene.add(doorLightHelper)

// Ghosts
const ghost1 = new THREE.PointLight('#ff00ff',1,3)
const ghost2 = new THREE.PointLight('#00ffff',1,3)
const ghost1Helper = new THREE.PointLightHelper(ghost1)
const ghost2Helper = new THREE.PointLightHelper(ghost2)
scene.add(ghost1,ghost2,ghost1Helper,ghost2Helper)
gui.add(ghost1Helper, 'visible').name('ghost1').setValue(false)
gui.add(ghost2Helper, 'visible').name('ghost2').setValue(false)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor('#262837')

/**
 * Shadows
 */
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap


moonLight.castShadow = true
doorLight.castShadow = true
ghost1.castShadow = true
ghost2.castShadow = true

walls.castShadow = true
bush1.castShadow = true
bush2.castShadow = true
bush2.castShadow = true
bush3.castShadow = true
bush4.castShadow = true

floor.receiveShadow = true

ghost1.shadow.mapSize.width = ghost1.shadow.mapSize.height = 256 
ghost1.shadow.camera.far = 7

ghost2.shadow.mapSize.width = ghost2.shadow.mapSize.height = 256 
ghost2.shadow.camera.far = 7




/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    
    // Update ghosts
    // ghost 1 
    const speed = .5
    const radius1 = 4
    const angle1 = elapsedTime * speed
    const x1 = Math.sin(angle1) * radius1
    const z1 = Math.cos(angle1) * radius1
    const y1 = Math.sin(angle1 * 3) 
    ghost1.position.set(x1,y1,z1)

    // ghost 2 
    const radius2 = 5
    const angle2 = - elapsedTime * speed
    const x2 = Math.sin(angle2) * radius2
    const z2 = Math.cos(angle2) * radius2
    const y2 = Math.sin(angle2 * 3) 
    ghost2.position.set(x2,y2,z2)


    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()