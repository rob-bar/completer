// This script will (eventually) apply each comp and then export to a PDF Presentation with overlays of font information
// Written by David Klawitter

#target photoshop

main();

///////////////////////////////////////////////////////////////////////////
// Function: getVisibleTextLayers
// Usage: Does a recursive search of layers and collects all text layer references
//        in to a single array, layers.
// Input: ActiveDocument, Array
///////////////////////////////////////////////////////////////////////////
function getVisibleTextLayers(doc, layers) {
  var layersCount = doc.layers.length;
  
  for (var layersIndex = 0; layersIndex < layersCount; layersIndex++) {
    var layer = doc.layers[layersIndex];
    
    if (layer.visible) {
      if (layer.typename == "LayerSet") {
        getVisibleTextLayers(layer, layers);
      } else if (isTextLayer(layer)) {
        layers.push(layer);
      }
    }
  }
}

///////////////////////////////////////////////////////////////////////////
// Function: isTextLayer
// Usage: Determines whether or not the layer ref passed in is a text layer
// Input: ArtLayer
// Return: true if the layer is a text layer
///////////////////////////////////////////////////////////////////////////

function isTextLayer(layer) {
  if (layer.typename == "ArtLayer") {
    if (layer.kind == "LayerKind.TEXT") {
      return true;
    }
  }
  return false;
}

///////////////////////////////////////////////////////////////////////////
// Function: userFriendly
// Usage: Converts constants to user-friendly copy
// Input: string
// Return: a string
///////////////////////////////////////////////////////////////////////////
function userFriendly(obj) 
{
  if (obj == "TypeUnits.PIXELS")
    return "px";
  else if (obj == "TypeUnits.POINTS") {
    return "pt";
  } else {
    return obj;
  }
}


function positionLayer( lyr, x, y ){// layerObject, Number, Number
   // if can not move layer return
   if(lyr.iisBackgroundLayer||lyr.positionLocked) return
   // get the layer bounds
   var layerBounds = lyr.bounds;
   // get top left position
   var layerX = layerBounds[0].value;
   var layerY = layerBounds[1].value;
   // the difference between where layer needs to be and is now
   var deltaX = x-layerX;
   var deltaY = y-layerY;
   // move the layer into position
   lyr.translate (deltaX, deltaY);
}

function main()
{
  var layerCompsCount = app.activeDocument.layerComps.length;
  
  // Handle both cases where a doc has defined layer comps and also where it does not
  if (layerCompsCount > 0) {  
    alert('no support for comps yet');
    /*
    for (layerCompsIndex = 0; layerCompsIndex < layerCompsCount; layerCompsIndex++) {
      var textLayers = new Array();
      var layerCompRef = activeDocument.layerComps[layerCompsIndex];

      layerCompRef.apply();

      // Collect text layers for comp
      findTextLayers(app.activeDocument, textLayers);
    
      alert(textLayers);
    }*/  
  } else {
    var layers = new Array();
    getVisibleTextLayers(app.activeDocument, layers);
        
    for (layerIndex = 0; layerIndex < layers.length; layerIndex++) {
      layer = layers[layerIndex];
      
      // CREATE TEXT (HINT) LAYER
      var artLayerRef = app.activeDocument.artLayers.add();

      artLayerRef.kind = LayerKind.TEXT;
      
      // Set the contents of the text layer
      var textItemRef = artLayerRef.textItem
      textItemRef.contents = layer.typename;
      //textItemRef.color = 
      textItemRef.size = 18;
      
      //artLayerRef.translate(500, 500); // move relative to it's original position
      positionLayer(artLayerRef, layer.bounds[0], layer.bounds[1])
      
      // CREATE FILL LAYER
      var fillLayerRef = app.activeDocument.artLayers.add();
      
      // Determine the layer bounds
      var a = [fillLayerRef.bounds[0], fillLayerRef.bounds[1]];
      var b = [fillLayerRef.bounds[2], fillLayerRef.bounds[1]];
      var c = [fillLayerRef.bounds[0], fillLayerRef.bounds[3]];
      var d = [fillLayerRef.bounds[2], fillLayerRef.bounds[3]];
      
      app.activeDocument.selection.select([a, b, c, d], SelectionType.REPLACE);
      
      // Fill the backing layer with background fill color
      var fillColor = new SolidColor();
      fillColor.rgb.red = 255;
      fillColor.rgb.green = 0;
      fillColor.rgb.blue = 0;
      
      app.activeDocument.selection.fill(fillColor, ColorBlendMode.NORMAL, 75, false);
      
      artLayerRef = null;
      fillLayerRef = null;
      textItemRef = null;
    }
  }
}