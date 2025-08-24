import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FlyControls } from 'three/addons/controls/FlyControls.js';

import { Line2 } from 'three/addons/lines/Line2.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';
import * as GeometryUtils from 'three/addons/utils/GeometryUtils.js';

import {Planet}  from "./planet.js";
import {dataPlanets} from "./data.js"
import {dataDwarfPlanets} from "./data.js"

//import * as dat from './lib/dat.gui.module.js';
import {GUI} from "./lib/dat.gui.module.js"
//OBJECT DATA ARRAYS
let planetOrbits = [];
let planetObjects = [];
let planetLines =[];
let dwarfPlanetOrbits = [];
let dwarfPlanetObjects = [];
let dwarfPlanetLines =[];

let planetGroup, planetLinesGroup;
let dwarfPlanetGroup, dwarfPlanetLinesGroup;
let sun;

let raycaster, pointer;
let sunLight,ambLight;
let renderer,camera,cameraFocus,cameraTime,cameraTarget,cameraTemp,cameraControls,scene;



let time = Date.now()*0.0000001;

//CONSTANTS
const divisions = 128; //Resolution of orbit lines
const sunMass = 1e8; //Sun mass in kg
const scaleFactor = 10;
const auEarthRadiusRatio = 0.00425875*100; //Ratio of the earth radius to 1 Astronomical Unit
const map = new THREE.TextureLoader().load("./res/circle-04-hit.png");
const CLEAR_COLOR =0x000f0f;

const gui = new GUI();
const guiPlanetFolder = gui.addFolder("Planets");
const guiDwarfPlanetFolder = gui.addFolder("Dwarf Planets");

//line////////////////////////////////////

let matLine;


init();
createAstronomicalBodies();
animate();

function init()
{
    //Raycasting setup
    raycaster = new THREE.Raycaster();
    raycaster.layers.set(1); //collision layer just for planets
    pointer = new THREE.Vector2();

    //Renderer setup
    renderer = new THREE.WebGLRenderer({
        logarithmicDepthBuffer: true,
        antialias: true,
    });
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setClearColor( 0x000f0f, 1.0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    
    //Scene & camera setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.0001,
        1e22,
    );
    camera.position.set(-90, 140, 140); 
    cameraTime = 1.0;

    ///SUN OBJECT
    const sunGeo = new THREE.SphereGeometry(109*auEarthRadiusRatio, 30, 30);
    const sunMat = new THREE.MeshBasicMaterial({
        color: 0xfaaf00,
    });
    sun = new THREE.Mesh(sunGeo, sunMat);
    sun.renderOrder = 99;
    sun.layers.enable(1);
    scene.add(sun); 
    cameraFocus = sun;

    //Camera controls setup
    cameraControls = new OrbitControls(camera, renderer.domElement);
    //cameraControls = new  FlyControls(camera, renderer.domElement);
    //cameraControls.enableDamping =true;


    //Initializing generic line material
    matLine = new LineMaterial( {

        color: 0xffffff,
        linewidth: 3, // in world units with size attenuation, pixels otherwise
        vertexColors: true,
     
        dashed: false,
        alphaToCoverage: false,
    
    } );
    matLine.resolution.set( window.innerWidth, window.innerHeight );



    //Lighting
    sunLight = new THREE.PointLight( 0xffffff, 10, 0, 0.1);
    scene.add(sunLight);
    ambLight = new THREE.AmbientLight( 0x0f0f0f ); // soft white light
    scene.add( ambLight );

}

function createAstronomicalBodies()
{

    

    ///////////////////////////////////////////////
    //PLANETS
    planetGroup = new THREE.Group();
    planetLinesGroup = new THREE.Group();
    planetOrbits = [];
    planetObjects = [];
    planetLines =[];
    for(let i =0;i<dataPlanets.length;i++)
    {
        let _group = new THREE.Group();
        //Orbit calculation objects
        planetOrbits[i] = new Planet(sunMass);
        planetOrbits[i].setOrbitalElements(dataPlanets[i][0]*scaleFactor,dataPlanets[i][1],dataPlanets[i][2],dataPlanets[i][3],dataPlanets[i][4],dataPlanets[i][5]);
        planetOrbits[i].calculateSemiConstants();

        //PLanet object
        let geo = new THREE.SphereGeometry(dataPlanets[i][7]*scaleFactor*auEarthRadiusRatio, 64, 32);
        let mat = new THREE.MeshPhongMaterial({
            shininess: 25,    
        });
        let color = new THREE.Color(dataPlanets[i][6]);
        //color.setHSL(Math.random(),1.0,0.5);
        planetObjects[i] = new THREE.Mesh(geo, mat);
        planetObjects[i].material.color.set(color);
        planetObjects[i].layers.enable(1);
        _group.add(planetObjects[i]);

        //Orbit lines
        let attr = planetOrbits[i].calculateOrbitLineColor(divisions,color.r,color.g,color.b);
        //let attr = planetOrbits[i].calculateOrbitLine(divisions); 
        let pLineGeometry = new LineGeometry();
        pLineGeometry.setPositions(attr[0]);
        pLineGeometry.setColors(attr[1]);
        planetLines[i] = new Line2(pLineGeometry, matLine);
        planetLinesGroup.add(planetLines[i]);

        //Sprite for raycasting purposes
        const _sprite = new THREE.Sprite( new THREE.SpriteMaterial( { color: '#69f', sizeAttenuation: false, opacity: 0.0, transparent: true, map: map } ) );
		_sprite.position.copy(planetObjects[i].position);
        //_sprite.parent = planetObjects[i];
        _sprite.layers.enable(1);
	    _sprite.scale.set( 0.1, 0.1, 0.1 );
		_group.add( _sprite );
        _group.name = i;


        let _symgroup = new THREE.Group();

        //symbol cutout
        let symCutGeo = new THREE.SphereGeometry(0.03, 64, 32);
        let symCutMat = new THREE.MeshBasicMaterial({
            color: CLEAR_COLOR,
            opacity: 1.0,    
            transparent: true,
            depthWrite: false,
        });
        let _symbolCutout = new THREE.Mesh(symCutGeo, symCutMat);
        _symbolCutout.position.copy(planetObjects[i].position);
        _symbolCutout.renderOrder = -9;
        _symgroup.add(_symbolCutout);
        
        //Symbol Sprite
        const symText = new THREE.TextureLoader().load(dataPlanets[i][8]);
        const _symbol = new THREE.Sprite( new THREE.SpriteMaterial({ 
            color: dataPlanets[i][6], 
            sizeAttenuation: true, 
            opacity: 1.0, 
            transparent: true, 
            depthTest: false,
            map: symText
            }) 
        );
        _symbol.renderOrder = 9;
        _symbol.position.copy(planetObjects[i].position);
	    _symbol.scale.set( 0.05, 0.05, 0.05 );
        _symgroup.add( _symbol);
        _symgroup.name = "symbol";


		_group.add( _symgroup );
        
        planetGroup.add(_group);


        //
    }
    scene.add(planetGroup);
    scene.add(planetLinesGroup);

    //gui
    guiPlanetFolder.open();
    guiPlanetFolder.add(planetGroup,"visible").name("Symbols");
    guiPlanetFolder.add(planetLinesGroup,"visible").name("Lines");

    

    //DWARF PLANETS
    dwarfPlanetGroup = new THREE.Group();
    dwarfPlanetLinesGroup = new THREE.Group();
    dwarfPlanetOrbits = [];
    dwarfPlanetObjects = [];
    dwarfPlanetLines =[];
    for(let i =0;i<dataDwarfPlanets.length;i++){

        let _group = new THREE.Group();
        //Orbit calculation objects
        dwarfPlanetOrbits[i] = new Planet(sunMass);
        dwarfPlanetOrbits[i].setOrbitalElements(dataDwarfPlanets[i][0]*scaleFactor,dataDwarfPlanets[i][1],dataDwarfPlanets[i][2],dataDwarfPlanets[i][3],dataDwarfPlanets[i][4],dataDwarfPlanets[i][5]);
        dwarfPlanetOrbits[i].calculateSemiConstants();

        //PLanet object
        let geo = new THREE.SphereGeometry(2, 16, 8);
        let mat = new THREE.MeshPhongMaterial({
            shininess: 25,    
        });
        let color = new THREE.Color(dataDwarfPlanets[i][6]);
        //color.setHSL(Math.random(),1.0,0.5);
        dwarfPlanetObjects[i] = new THREE.Mesh(geo, mat);
        dwarfPlanetObjects[i].material.color.set(color);
        dwarfPlanetObjects[i].layers.enable(1);
        _group.add(dwarfPlanetObjects[i]);

        //Sprite for raycasting purposes
        const _sprite = new THREE.Sprite( new THREE.SpriteMaterial( { color: '#69f', sizeAttenuation: false, opacity: 0.0, transparent: true, map: map } ) );
		_sprite.position.copy(dwarfPlanetObjects[i].position);
        //_sprite.parent = planetObjects[i];
        _sprite.layers.enable(1);
	    _sprite.scale.set( 0.1, 0.1, 0.1 );
		_group.add( _sprite );
        _group.name = i;


        let _symgroup = new THREE.Group();

        //symbol cutout
        let symCutGeo = new THREE.SphereGeometry(0.03, 64, 32);
        let symCutMat = new THREE.MeshBasicMaterial({
            color: CLEAR_COLOR,
            opacity: 1.0,    
            transparent: true,
            depthWrite: false,
        });
        let _symbolCutout = new THREE.Mesh(symCutGeo, symCutMat);
        _symbolCutout.position.copy(dwarfPlanetObjects[i].position);
        _symbolCutout.renderOrder = -9;
        _symgroup.add(_symbolCutout);

        const symText = new THREE.TextureLoader().load(dataDwarfPlanets[i][8]);
        const _symbol = new THREE.Sprite( new THREE.SpriteMaterial({ 
            color: dataDwarfPlanets[i][6], 
            sizeAttenuation: true, 
            opacity: 1.0, 
            transparent: true, 
            depthTest: false,
            map: symText 
        }));
        _symbol.renderOrder = 9;
        _symbol.position.copy(dwarfPlanetObjects[i].position);
	    _symbol.scale.set( 0.05, 0.05, 0.05 );
        _symgroup.add( _symbol);
        _symgroup.name = "symbol";

		_group.add( _symgroup );

        dwarfPlanetGroup.add(_group);
        //Orbit lines
        let tempLineMat = new THREE.LineDashedMaterial({

            color: 0xffffff,
            linewidth: 5,
            scale: 1,
            dashSize: dataDwarfPlanets[i][7]*scaleFactor,
            gapSize: dataDwarfPlanets[i][7]*scaleFactor,
            vertexColors: true,
            
        
        } );
        let attr = dwarfPlanetOrbits[i].calculateOrbitLineColor(divisions,color.r,color.g,color.b);
        let pLineGeometry = new THREE.BufferGeometry();
        pLineGeometry.setAttribute( 'position', new THREE.Float32BufferAttribute( attr[0], 3 ) );
        pLineGeometry.setAttribute( 'color', new THREE.Float32BufferAttribute( attr[1], 3 ) );
        dwarfPlanetLines[i] = new THREE.Line(pLineGeometry, tempLineMat);
        dwarfPlanetLines[i].computeLineDistances();
        dwarfPlanetLinesGroup.add(dwarfPlanetLines[i]);


    }
    scene.add(dwarfPlanetGroup);
    scene.add(dwarfPlanetLinesGroup);

    guiDwarfPlanetFolder.open();
    guiDwarfPlanetFolder.add(dwarfPlanetGroup,"visible").name("Symbols");
    guiDwarfPlanetFolder.add(dwarfPlanetLinesGroup,"visible").name("Lines");
}
function animate() {
    

    //render shit
    renderer.clearDepth();
    //matLine.resolution.set( window.innerWidth, window.innerHeight );
    cameraControls.update();
    //
    time = Date.now()*0.0000001;
  
    
    //Planet orbit list
    let _planets = planetGroup.children;
    for(let i =0;i<_planets.length;i++)
    {
        let index = _planets[i].name;
        let delta = planetOrbits[index].caluclateOrbitalPosition(time);

        //planetObjects[i].position.set(delta[0],delta[1],delta[2]);
        planetGroup.children[i].position.set(delta[0],delta[1],delta[2]);

        let _symbol = planetGroup.children[i].getObjectByName("symbol");
        let _dist = planetGroup.children[i].position.distanceTo(new THREE.Vector3(0,0,0))
        let _scaling =  _dist - Math.log2(_dist);
        _scaling = Math.max(_scaling,1500);
        _symbol.scale.set(_scaling,_scaling,_scaling);


    }


    //Dwarf planet orbit list
    for(let i = 0; i<dwarfPlanetOrbits.length;i++)
    {
        let delta = [];
        delta = dwarfPlanetOrbits[i].caluclateOrbitalPosition(time);
        dwarfPlanetGroup.children[i].position.set(delta[0],delta[1],delta[2]);

        let _symbol = dwarfPlanetGroup.children[i].getObjectByName("symbol");
        let _dist = dwarfPlanetGroup.children[i].position.distanceTo(new THREE.Vector3(0,0,0))
        let _scaling =  _dist - Math.log2(_dist);
        _scaling = Math.max(_scaling,1500);
        _symbol.scale.set(_scaling,_scaling,_scaling);

    }

    cameraTarget = cameraFocus.position;
    if(cameraTime<1.0){
        
        cameraControls.target = cameraTemp.lerp(cameraTarget,cameraTime);
        cameraTime+=0.061;
    }
    else{
        cameraControls.target = cameraTarget;
    }
    //orbit.zoomSpeed = Math.pow(2,orbit.getDistance()*0.0001);
    cameraControls.update();
    renderer.render(scene, camera);

}


function onMouseUp( event ) {

	// calculate pointer position in normalized device coordinates
	// (-1 to +1) for both components
	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    raycaster.setFromCamera( pointer, camera );

        
        // calculate objects intersecting the picking ray
        const intersects = raycaster.intersectObjects(scene.children);

        if(intersects.length>0){
        cameraFocus = intersects[0].object.parent;
        cameraControls.saveState();
        cameraTemp = cameraControls.target.clone();
        cameraTime = 0.0;
        }
        

        //orbit.target = intersects[0].object.position;

}


window.addEventListener( 'mouseup', onMouseUp );

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    matLine.resolution.set( window.innerWidth, window.innerHeight );
    renderer.setSize(window.innerWidth, window.innerHeight);
});

renderer.setAnimationLoop(animate);
