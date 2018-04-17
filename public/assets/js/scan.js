var socket = io ();
;
var renderer,
    scene,
    camera,
    container;

var arSource,
    arContext,
    arMarker;

var 
    mymesh;

init($('#marker').val());



socket.on('TrueSucess', ()=> {
    clearInterval(interval);
    setTimeout(()=> { 
        location.href="/game";
    }, 2500);
})

window.addEventListener('touchstart', function() {

    // create empty buffer
    var buffer = myContext.createBuffer(1, 1, 22050);
    var source = myContext.createBufferSource();
    source.buffer = buffer;

    // connect to output (your speakers)
    source.connect(myContext.destination);

    // play the file
    source.noteOn(0);

}, false);



function marker(name){
    arMarker = new THREEx.ArMarkerControls(arContext, camera, {
        type : 'pattern',
        patternUrl : './assets/data/' + name +'.patt',
        changeMatrixMode: 'cameraTransformMatrix'
    });
}

function yes (){
    
    
    chassename = $('#cn').val();
    pseudo = $('#pseudo').val();
    step = $('#step').val();
    var tab = [chassename, pseudo, step];
    socket.emit('Success', tab);

    var audio = document.getElementById("audio");
    $('body').addEventListener('touchstart', event => {
        audio.play();
    })
}

function showText(text){
    var loader = new THREE.FontLoader();

    loader.load( './assets/font/helvetiker_regular.typeface.json', function ( font ) {

        var material = new THREE.LineBasicMaterial( {
            color: "rgb(255, 128, 0)"
        } );
        var textGeom = new THREE.TextGeometry( text, {
            font: font, // Must be lowercase!
            size: 0.5,
            height: 0.09
        });
        var textMesh = new THREE.Mesh( textGeom, material );
        textMesh.rotateX(-90);
        textMesh.position.set(0, 0, 0);   
        scene.add( textMesh );
    
        // Do some optional calculations. This is only if you need to get the
        // width of the generated text
        textGeom.computeBoundingBox();
        textGeom.textWidth = textGeom.boundingBox.max.x - textGeom.boundingBox.min.x;

    });
}

function init(mn){
    container = document.getElementById('camera');

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    scene = new THREE.Scene();
    camera = new THREE.Camera();

    renderer.setClearColor(0x000000, 0);
    renderer.setSize(window.innerWidth, window.innerHeight);

    container.appendChild(renderer.domElement);
    $('#camera').append("<button id='return' class='btn btn-silver mt-md text-uppercase' style='position: absolute; bottom: 5px;'> return </button>")
    scene.add(camera);
    scene.visible = false;
    showText("Step " + $('#step').val() + " Cleared");
    arSource = new THREEx.ArToolkitSource({
        sourceType : 'webcam',
    });

    arContext = new THREEx.ArToolkitContext({
        cameraParametersUrl: './assets/data/camera_para.dat',
        detectionMode: 'mono',
    });

    marker(mn);
    /* handle */
    arSource.init(function(){
        arSource.onResize();
        arSource.copySizeTo(renderer.domElement);

        if(arContext.arController !== null) arSource.copySizeTo(arContext.arController.canvas);

    });

    arContext.init(function onCompleted(){
        
        camera.projectionMatrix.copy(arContext.getProjectionMatrix());

    });

    
    render();
}   


function render(){
    requestAnimationFrame(render);
    renderer.render(scene,camera);                

    if(arSource.ready === false) return;

    arContext.update(arSource.domElement);
    scene.visible = camera.visible;
    $('#return').click( () => {
        location.href="/game";
    })
}

var interval = setInterval(function(){ if(scene.visible){
    yes();
} }, 1000);